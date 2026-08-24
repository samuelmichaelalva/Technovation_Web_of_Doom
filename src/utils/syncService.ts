import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { TeamSession } from '../types/game';
import { saveLocalSession, getLocalSession, getDeviceToken } from './storage';

export interface SyncResponse {
  success: boolean;
  message?: string;
  session?: TeamSession;
  isLockedByOtherDevice?: boolean;
}

/**
 * Log in team and check for 1 Device = 1 Active Session Lock
 */
export async function initializeTeamSession(teamId: string, teamName: string): Promise<SyncResponse> {
  const deviceToken = getDeviceToken();
  const now = new Date().toISOString();

  // Local-first fallback session
  const fallbackSession: TeamSession = {
    teamId,
    teamName,
    deviceToken,
    startTime: now,
    score: 0,
    currentQuestionIdx: 0,
    answers: {},
    hintsUsed: [],
    isCompleted: false,
    lastActiveAt: now,
    tabSwitchCount: 0,
    isDisqualified: false,
  };

  if (!isSupabaseConfigured || !supabase) {
    saveLocalSession(fallbackSession);
    return { success: true, session: fallbackSession };
  }

  try {
    // 1. Ensure team exists in `teams` table
    await supabase.from('teams').upsert(
      { team_id: teamId, team_name: teamName },
      { onConflict: 'team_id' }
    );

    // 2. Query existing active session for this team
    const { data: existingSessions, error: selectErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('team_id', teamId)
      .limit(1);

    if (selectErr) {
      console.warn('Supabase select session error:', selectErr.message);
    }

    if (existingSessions && existingSessions.length > 0) {
      const activeSession = existingSessions[0];

      // Check device token lock (Allow same device to reconnect, block foreign device if active)
      if (activeSession.device_token && activeSession.device_token !== deviceToken && !activeSession.is_completed) {
        // If last active was within 30 minutes, enforce 1 device lock
        const lastActiveTime = new Date(activeSession.last_active_at || activeSession.start_time).getTime();
        const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;

        if (lastActiveTime > thirtyMinsAgo) {
          return {
            success: false,
            isLockedByOtherDevice: true,
            message: `ACCESS DENIED: Team ID [${teamId}] is currently active on another device!`
          };
        }
      }

      // Reconnect/Resume session on this device
      const resumedSession: TeamSession = {
        id: activeSession.id,
        teamId: activeSession.team_id,
        teamName,
        deviceToken,
        startTime: activeSession.start_time,
        score: activeSession.score || 0,
        currentQuestionIdx: activeSession.current_question_idx || 0,
        answers: activeSession.answers || {},
        hintsUsed: activeSession.hints_used || [],
        isCompleted: activeSession.is_completed || false,
        lastActiveAt: now,
        tabSwitchCount: activeSession.tab_switch_count || 0,
        isDisqualified: activeSession.is_disqualified || false,
      };

      // Update active device token & heart-beat
      await supabase.from('sessions').update({
        device_token: deviceToken,
        last_active_at: now
      }).eq('team_id', teamId);

      saveLocalSession(resumedSession);
      return { success: true, session: resumedSession };
    }

    // 3. Create fresh session in Supabase
    const { data: newSession, error: insertErr } = await supabase
      .from('sessions')
      .insert({
        team_id: teamId,
        device_token: deviceToken,
        start_time: now,
        score: 0,
        current_question_idx: 0,
        answers: {},
        hints_used: [],
        is_completed: false,
        last_active_at: now
      })
      .select()
      .single();

    if (insertErr) {
      console.warn('Supabase insert session error:', insertErr.message);
    }

    const sessionToSave: TeamSession = {
      id: newSession?.id,
      ...fallbackSession
    };

    saveLocalSession(sessionToSave);
    return { success: true, session: sessionToSave };

  } catch (err) {
    console.error('Session initialization error', err);
    saveLocalSession(fallbackSession);
    return { success: true, session: fallbackSession };
  }
}

/**
 * Update Team Progress (Answers stored as JSONB in Supabase)
 */
export async function syncSessionState(session: TeamSession): Promise<void> {
  saveLocalSession(session);

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const now = new Date().toISOString();
    await supabase.from('sessions').upsert({
      team_id: session.teamId,
      device_token: session.deviceToken,
      score: session.score,
      current_question_idx: session.currentQuestionIdx,
      answers: session.answers, // JSONB
      hints_used: session.hintsUsed, // JSONB
      is_completed: session.isCompleted,
      last_active_at: now,
      ...(session.isCompleted ? { end_time: now } : {})
    }, { onConflict: 'team_id' });
  } catch (e) {
    console.warn('Background Supabase sync error', e);
  }
}

/**
 * Fetch all sessions for Admin Leaderboard
 */
export async function fetchAdminSessions(): Promise<{ session: TeamSession; teamName: string }[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalSession();
    return local ? [{ session: local, teamName: local.teamName }] : [];
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        teams ( team_name )
      `)
      .order('score', { ascending: false });

    if (error || !data) {
      console.warn('Error fetching admin sessions:', error);
      const local = getLocalSession();
      return local ? [{ session: local, teamName: local.teamName }] : [];
    }

    return data.map((item: any) => ({
      session: {
        id: item.id,
        teamId: item.team_id,
        teamName: item.teams?.team_name || item.team_id,
        deviceToken: item.device_token,
        startTime: item.start_time,
        endTime: item.end_time,
        score: item.score,
        currentQuestionIdx: item.current_question_idx,
        answers: item.answers || {},
        hintsUsed: item.hints_used || [],
        isCompleted: item.is_completed,
        lastActiveAt: item.last_active_at,
        tabSwitchCount: item.tab_switch_count || 0,
        isDisqualified: item.is_disqualified || false,
      },
      teamName: item.teams?.team_name || item.team_id,
    }));
  } catch (e) {
    console.error('Fetch admin sessions error', e);
    return [];
  }
}

/**
 * Subscribe to Realtime Session Updates for Admin Leaderboard
 */
export function subscribeAdminRealtime(onUpdate: () => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('admin_leaderboard_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sessions' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
