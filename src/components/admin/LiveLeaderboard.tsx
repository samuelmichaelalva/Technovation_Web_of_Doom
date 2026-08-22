import React, { useState } from 'react';
import type { TeamSession } from '../../types/game';
import { Trophy, Eye, Download, RefreshCw, X } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface LiveLeaderboardProps {
  sessions: { session: TeamSession; teamName: string }[];
  onRefresh: () => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ sessions, onRefresh }) => {
  const [selectedTeamSession, setSelectedTeamSession] = useState<TeamSession | null>(null);

  // Sort sessions by score descending, then by start time
  const sortedSessions = [...sessions].sort((a, b) => {
    if (b.session.score !== a.session.score) {
      return b.session.score - a.session.score;
    }
    return new Date(a.session.startTime).getTime() - new Date(b.session.startTime).getTime();
  });

  const exportCSV = () => {
    soundEngine.playClick();
    const rows = [
      ['Rank', 'Team ID', 'Team Name', 'Score', 'Completed', 'Hints Used', 'Start Time'],
      ...sortedSessions.map((item, idx) => [
        idx + 1,
        item.session.teamId,
        item.teamName,
        item.session.score,
        item.session.isCompleted ? 'YES' : 'NO',
        item.session.hintsUsed?.length || 0,
        new Date(item.session.startTime).toLocaleTimeString(),
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Web_of_Doom_Round1_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full font-mono">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[#00eefc]">
          <Trophy className="w-5 h-5 text-[#ffda70]" />
          <h3 className="font-bold text-lg md:text-xl text-white font-mono uppercase tracking-tighter">
            REAL-TIME COMMAND LEADERBOARD
          </h3>
          <span className="text-xs px-2 py-0.5 bg-[#181b25] border border-[#00eefc]/40 text-[#00eefc] font-mono">
            ({sortedSessions.length} TEAMS ACTIVE)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRefresh();
            }}
            className="px-3.5 py-2 bg-[#181b25] border border-[#00eefc]/40 text-[#00eefc] text-xs font-bold hover:border-[#00eefc] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REFRESH</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-[#00ff66] text-[#003911] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.4)] btn-flicker uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full overflow-x-auto border border-[#00eefc]/30 bg-[#0a0e17]/90 font-mono">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1c1f29] text-[#00eefc] border-b border-[#00eefc]/20 uppercase font-semibold">
            <tr>
              <th className="py-3.5 px-4">RANK</th>
              <th className="py-3.5 px-4">TEAM NAME & ID</th>
              <th className="py-3.5 px-4 text-center">SCORE</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-4 text-center">QUALIFICATION</th>
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedSessions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                  NO TEAM SESSIONS REGISTERED YET.
                </td>
              </tr>
            ) : (
              sortedSessions.map((item, idx) => {
                const isTop4 = idx < 4;
                const answerCount = Object.keys(item.session.answers || {}).length;

                return (
                  <tr
                    key={item.session.teamId}
                    className={`transition-colors ${
                      isTop4 ? 'bg-[#ffda70]/5 border-l-2 border-l-[#ffda70]' : 'hover:bg-[#181b25]/50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 font-bold">
                      <div className="flex items-center gap-2">
                        {isTop4 ? (
                          <span className="px-2 py-0.5 bg-[#ffda70]/20 border border-[#ffda70] text-[#ffda70] font-black text-xs">
                            #{String(idx + 1).padStart(2, '0')} 🏆
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Team Name */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{item.teamName}</div>
                      <div className="text-[10px] text-[#00eefc]">[{item.session.teamId}]</div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 text-center font-black text-[#ffda70] text-sm neon-text-gold">
                      {item.session.score} PTS
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      {item.session.isCompleted ? (
                        <span className="text-[#00ff66] font-bold text-[11px]">● COMPLETED</span>
                      ) : (
                        <span className="text-[#00eefc] font-bold text-[11px]">
                          ● ACTIVE ({answerCount} SECTORS)
                        </span>
                      )}
                    </td>

                    {/* Qualification */}
                    <td className="py-4 px-4 text-center">
                      {isTop4 ? (
                        <span className="px-2.5 py-1 bg-[#ffda70]/10 border border-[#ffda70] text-[#ffda70] font-extrabold text-[10px] uppercase">
                          QUALIFIED (ROUND 2)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 border border-slate-700 text-slate-500 text-[10px]">
                          STANDBY
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedTeamSession(item.session);
                        }}
                        className="p-1.5 border border-[#00eefc]/40 text-[#00eefc] hover:bg-[#00eefc]/10 transition-colors"
                        title="Inspect JSONB Response State"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* JSONB Inspection Modal */}
      {selectedTeamSession && (
        <div className="fixed inset-0 z-50 bg-[#050811]/90 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="max-w-2xl w-full glass-card p-6 border border-[#00eefc]/40 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="font-bold text-white text-base">TEAM RESPONSE INSPECTOR [JSONB]</h4>
                <div className="text-xs text-[#00eefc]">Team: {selectedTeamSession.teamName} ({selectedTeamSession.teamId})</div>
              </div>
              <button onClick={() => setSelectedTeamSession(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a0e17] p-4 border border-slate-800 text-xs text-[#00ff66]">
              <pre>{JSON.stringify(selectedTeamSession.answers, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
