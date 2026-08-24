import React, { useEffect } from 'react';
import { ShieldOff, XOctagon, Ban } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SecurityLockoutScreenProps {
  teamName: string;
  teamId: string;
  finalScore: number;
  solvedCount: number;
  totalQuestions: number;
}

export const SecurityLockoutScreen: React.FC<SecurityLockoutScreenProps> = ({
  teamName,
  teamId,
  finalScore,
  solvedCount,
  totalQuestions,
}) => {
  useEffect(() => {
    // Play triple alarm for dramatic disqualification
    soundEngine.playAlarm();
    const t1 = setTimeout(() => soundEngine.playAlarm(), 250);
    const t2 = setTimeout(() => soundEngine.playAlarm(), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-[#080008] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Animated red pulse background */}
      <div className="absolute inset-0 bg-gradient-radial from-red-950/30 via-transparent to-transparent animate-pulse" />
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Glitch line decorations */}
      <div className="absolute top-[20%] left-0 w-full h-[2px] bg-red-500/40 animate-pulse" />
      <div className="absolute top-[80%] left-0 w-full h-[1px] bg-red-500/30" />

      <div className="max-w-xl w-full border-2 border-red-600 bg-[#0a0008]/95 p-6 md:p-10 text-center relative shadow-[0_0_100px_rgba(255,0,0,0.3),inset_0_0_60px_rgba(255,0,0,0.05)]">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-600" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-600" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-600" />

        <div className="relative w-24 h-24 max-w-[96px] max-h-[96px] mx-auto mb-5 rounded-full border-2 border-red-600 bg-red-950/60 shadow-[0_0_40px_rgba(255,0,0,0.6)] overflow-hidden flex items-center justify-center select-none">
          <img
            alt="Doctor Doom"
            draggable={false}
            className="w-full h-full object-cover opacity-85 grayscale contrast-125 mix-blend-lighten select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUC6Umd71asYUmYyCSJa2zotKoUCTB-7cufQN23Z7AIb7bRQqj2b4mhaF2g_k86hfz-uNVNGjK0jID2gNMDyvGC6MjwEIBFEeb7hTBefjnl-gYfzC6sA8Ha940b-XSeHAgSj6lCuPUF7oKJgmkuugUEJWILJf1B0naQi6dl-NvAoEpfLNDm80zBbEpjh2vtoUVGCYO-XcA6p5cUoSkd8BGRJThaZZeWUkvrwAB2afgRKr0VWyqvpXu-ECDrkyJaA8dQ"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-red-500 uppercase tracking-tighter mb-1" style={{ textShadow: '0 0 30px rgba(255,0,85,0.8), 0 0 60px rgba(255,0,85,0.3)' }}>
          SESSION TERMINATED
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs text-red-300 mb-6 tracking-widest">
          <Ban className="w-3.5 h-3.5" />
          <span>ANTI-CHEAT PROTOCOL ENFORCED</span>
          <Ban className="w-3.5 h-3.5" />
        </div>

        {/* Reason */}
        <div className="p-4 bg-red-950/30 border border-red-600/50 text-sm text-red-200 leading-relaxed mb-6 text-left">
          <div className="flex items-start gap-2 mb-2">
            <XOctagon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong className="text-red-400">VIOLATION:</strong> Multiple unauthorized tab switches detected. Your responses have been <strong className="text-white">automatically submitted</strong> and your session has been <strong className="text-red-400">permanently locked</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldOff className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span>You <strong>cannot continue</strong> this assessment. Your final score at the moment of violation has been recorded to the Live Leaderboard.</span>
          </div>
        </div>

        {/* Final Score Card */}
        <div className="space-y-3 mb-6">
          <div className="p-4 bg-[#181015] border border-red-800/50">
            <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">TEAM</div>
            <div className="text-lg font-bold text-white">{teamName}</div>
            <div className="text-xs text-red-400">[{teamId}]</div>
          </div>

          <div className="p-4 bg-[#181015] border border-red-600/40">
            <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">FINAL LOCKED SCORE</div>
            <div className="text-3xl font-black text-red-500" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
              {finalScore} PTS
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#181015] border border-red-800/30">
              <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">QUESTIONS ANSWERED</div>
              <div className="text-lg font-bold text-white">{solvedCount} / {totalQuestions}</div>
            </div>
            <div className="p-3 bg-[#181015] border border-red-800/30">
              <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">TERMINATION REASON</div>
              <div className="text-sm font-bold text-red-400">TAB SWITCH ×2</div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-3 bg-[#181015] border border-red-500/20 text-xs text-red-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>STATUS: <strong className="text-red-500">PERMANENTLY LOCKED</strong> — SCORE SUBMITTED TO COMMAND HUD</span>
        </div>
      </div>
    </div>
  );
};
