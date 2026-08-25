import React, { useState, useEffect } from 'react';
import { LiveLeaderboard } from './LiveLeaderboard';
import { QuestionEditor } from './QuestionEditor';
import type { Question, TeamSession } from '../../types/game';
import { fetchAdminSessions, subscribeAdminRealtime } from '../../utils/syncService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { saveCustomQuestions, getAdminAuthState, setAdminAuthState } from '../../utils/storage';
import { Lock, Shield, ArrowLeft, Database, Key, LogOut } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface AdminDashboardProps {
  questions: Question[];
  onUpdateQuestions: (updated: Question[]) => void;
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  onUpdateQuestions,
  onBackToApp,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAdminAuthState());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'editor'>('leaderboard');
  const [sessions, setSessions] = useState<{ session: TeamSession; teamName: string }[]>([]);

  const expectedPin = import.meta.env.VITE_ADMIN_PIN || '2026';

  const loadData = async () => {
    const data = await fetchAdminSessions();
    setSessions(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const unsubscribe = subscribeAdminRealtime(() => {
        loadData();
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === expectedPin) {
      soundEngine.playSuccess();
      setIsAuthenticated(true);
      setAdminAuthState(true);
      setPinError('');
    } else {
      soundEngine.playAlarm();
      setPinError('INVALID COMMAND PIN ACCESS DENIED.');
    }
  };

  const handleExitAdmin = () => {
    soundEngine.playClick();
    setIsAuthenticated(false);
    setAdminAuthState(false);
    onBackToApp();
  };



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050811] bg-cyber-grid flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full glass-card p-6 md:p-8 border border-[#00eefc]/40 text-center relative">
          <div className="corner-bracket cb-tl" />
          <div className="corner-bracket cb-tr" />
          <div className="corner-bracket cb-bl" />
          <div className="corner-bracket cb-br" />

          <div className="inline-flex p-3 bg-[#181b25] border border-[#00eefc]/50 text-[#00eefc] mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest neon-text-cyan mb-1">
            COMMAND PORTAL ACCESS
          </h2>
          <p className="text-xs text-slate-400 mb-6">ENTER MASTER ADMIN ACCESS PIN</p>

          {pinError && (
            <div className="mb-4 p-2.5 bg-red-950/80 border border-red-500 text-red-300 text-xs font-bold animate-bounce">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="ENTER PIN (Default: 2026)"
                className="w-full pl-10 pr-4 py-3 bg-[#1c1f29] border-0 border-b border-[#00eefc]/50 text-white placeholder-slate-500 font-mono tracking-widest text-center focus:outline-none input-glow"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00ff66] text-[#003911] font-bold uppercase tracking-wider text-xs btn-flicker shadow-[0_0_20px_rgba(0,255,102,0.4)]"
            >
              UNLOCK DASHBOARD
            </button>
          </form>

          <button
            onClick={onBackToApp}
            className="mt-6 text-xs text-slate-500 hover:text-[#00eefc] flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO GAME PLAYER</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] bg-cyber-grid text-slate-100 p-4 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="glass-card p-4 md:p-6 border border-[#00eefc]/30 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="corner-bracket cb-tl" />
          <div className="corner-bracket cb-tr" />
          <div className="corner-bracket cb-bl" />
          <div className="corner-bracket cb-br" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#181b25] border border-[#00eefc]/50 text-[#00eefc]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#00eefc] neon-text-cyan uppercase tracking-tighter">
                WEB OF DOOM // COMMAND HUD
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Database className="w-3.5 h-3.5 text-[#00ff66]" />
                <span className="px-2 py-0.5 bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-[10px] font-bold">
                  ● SUPABASE REALTIME: {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL MODE'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('leaderboard');
              }}
              className={`px-4 py-2 border text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-[#181b25] border-[#00eefc] text-[#00eefc] shadow-[0_0_12px_rgba(0,238,252,0.3)]'
                  : 'bg-[#181b25] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              LIVE LEADERBOARD
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('editor');
              }}
              className={`px-4 py-2 border text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#181b25] border-[#00eefc] text-[#00eefc] shadow-[0_0_12px_rgba(0,238,252,0.3)]'
                  : 'bg-[#181b25] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              QUESTION BANK EDITOR
            </button>

            <button
              onClick={handleExitAdmin}
              className="px-3.5 py-2 border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span>EXIT ADMIN</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'leaderboard' ? (
          <LiveLeaderboard sessions={sessions} onRefresh={loadData} />
        ) : (
          <QuestionEditor
            questions={questions}
            onSaveQuestions={(updated) => {
              saveCustomQuestions(updated);
              onUpdateQuestions(updated);
            }}
          />
        )}

      </div>
    </div>
  );
};
