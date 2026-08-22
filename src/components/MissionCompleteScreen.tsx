import React, { useEffect } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface MissionCompleteScreenProps {
  teamName: string;
  teamId: string;
  score: number;
  solvedCount: number;
  totalQuestions: number;
  hintsUsedCount: number;
}

export const MissionCompleteScreen: React.FC<MissionCompleteScreenProps> = ({
  teamName,
  teamId,
  score,
  solvedCount,
  totalQuestions,
  hintsUsedCount,
}) => {
  useEffect(() => {
    soundEngine.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff66', '#00eefc', '#ffda70'],
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-mono">
      <div className="max-w-xl w-full glass-card p-6 md:p-10 border border-[#00ff66]/50 shadow-[0_0_50px_rgba(0,255,102,0.2)] text-center relative overflow-hidden">
        {/* Corner Brackets */}
        <div className="corner-bracket cb-tl" />
        <div className="corner-bracket cb-tr" />
        <div className="corner-bracket cb-bl" />
        <div className="corner-bracket cb-br" />

        <div className="inline-flex p-4 rounded-full border-2 border-[#00ff66] bg-[#0a0e17] text-[#00ff66] mb-4 shadow-[0_0_20px_rgba(0,255,102,0.6)] animate-pulse">
          <ShieldCheck className="w-12 h-12 text-[#00ff66]" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#00ff66] neon-text-green uppercase font-mono mb-2">
          MISSION COMPLETE
        </h2>
        <p className="text-xs text-[#00eefc] font-mono tracking-widest mb-8">
          // INTELLIGENCE DATA TRANSMITTED TO COMMAND HUD
        </p>

        {/* Stats Grid */}
        <div className="space-y-3 mb-6 text-center font-mono">
          <div className="p-4 bg-[#181b25] border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">TEAM NAME</div>
            <div className="text-xl font-bold text-white">{teamName}</div>
            <div className="text-xs text-[#00ff66]">[{teamId}]</div>
          </div>

          <div className="p-4 bg-[#181b25] border border-[#ffda70]/40">
            <div className="text-[10px] text-[#ffda70] uppercase tracking-widest mb-1">FINAL SCORE</div>
            <div className="text-3xl font-black text-[#ffda70] neon-text-gold">{score} PTS</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[#181b25] border border-[#00ff66]/30">
              <div className="text-[10px] text-[#00ff66] uppercase tracking-widest mb-1">SECTORS CLEARED</div>
              <div className="text-xl font-bold text-white">
                {solvedCount} / {totalQuestions}
              </div>
            </div>

            <div className="p-4 bg-[#181b25] border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">HINTS TAKEN</div>
              <div className="text-xl font-bold text-red-400">{hintsUsedCount}</div>
            </div>
          </div>
        </div>

        {/* Confidential Standings Alert Box */}
        <div className="p-4 bg-[#181b25] border border-[#00eefc]/30 text-xs text-[#00eefc] text-left mb-6 font-mono leading-relaxed">
          <span className="font-bold text-[#00eefc]">STANDINGS CLASSIFIED:</span> Your final score has been logged. Event organizers will announce the <strong>Top 4 Qualifying Teams</strong> for Round 02: RECLAIM THE CITY at the end of Round 1.
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] font-mono uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#00ff66]" />
          <span>AWAIT COMMAND DISCLOSURE...</span>
        </div>
      </div>
    </div>
  );
};
