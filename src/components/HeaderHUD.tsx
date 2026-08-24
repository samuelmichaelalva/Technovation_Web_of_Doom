import React, { useEffect } from 'react';
import { Clock, Award, Lock, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HeaderHUDProps {
  teamName?: string;
  score: number;
  remainingSeconds: number;
  solvedCount: number;
  totalQuestions: number;
  onAdminClick: () => void;
  tabSwitchCount?: number;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  teamName,
  score,
  remainingSeconds,
  solvedCount,
  totalQuestions,
  onAdminClick,
  tabSwitchCount = 0,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundEngine.getMutedState());
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isLowTime = remainingSeconds <= 300 && remainingSeconds > 0;

  useEffect(() => {
    if (isLowTime && remainingSeconds % 30 === 0) {
      soundEngine.playAlarm();
    }
  }, [remainingSeconds, isLowTime]);

  const handleAudioToggle = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  const percentageSolved = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  const doomGridControl = 100 - percentageSolved;

  return (
    <header className="w-full bg-[#0a101e]/95 border-b border-[#00eefc]/30 px-3 md:px-6 py-2.5 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Brand Logo & Team Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#00ff66] bg-[#0a0e17] shadow-[0_0_10px_rgba(0,255,102,0.5)] overflow-hidden flex items-center justify-center select-none flex-shrink-0">
            <img
              alt="Doctor Doom"
              draggable={false}
              className="w-full h-full object-cover opacity-90 mix-blend-lighten select-none pointer-events-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUC6Umd71asYUmYyCSJa2zotKoUCTB-7cufQN23Z7AIb7bRQqj2b4mhaF2g_k86hfz-uNVNGjK0jID2gNMDyvGC6MjwEIBFEeb7hTBefjnl-gYfzC6sA8Ha940b-XSeHAgSj6lCuPUF7oKJgmkuugUEJWILJf1B0naQi6dl-NvAoEpfLNDm80zBbEpjh2vtoUVGCYO-XcA6p5cUoSkd8BGRJThaZZeWUkvrwAB2afgRKr0VWyqvpXu-ECDrkyJaA8dQ"
            />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tighter text-[#00ff66] neon-text-green uppercase font-mono leading-none">
              WEB OF DOOM
            </h1>
            <div className="text-[9px] md:text-[10px] text-[#00eefc] tracking-widest uppercase mt-0.5">
              ROUND 01 // DOOMBOT DEFENSE
            </div>
          </div>
        </div>

        {/* Center/Right HUD Badges */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
          {/* Timer Badge */}
          <div
            className={`px-2 md:px-3 py-1 rounded-sm border flex items-center gap-1.5 font-mono text-xs ${
              isLowTime
                ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                : 'bg-[#181b25] border-[#00eefc]/40 text-[#00eefc]'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'animate-bounce text-red-400' : 'text-[#00eefc]'}`} />
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase text-slate-400 hidden xs:inline">TIME:</span>
              <span className="font-bold text-xs md:text-sm">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Anti-Cheat Shield Status Badge */}
          <div
            className={`px-2 md:px-3 py-1 rounded-sm border flex items-center gap-1.5 font-mono text-xs ${
              tabSwitchCount > 0
                ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                : 'bg-[#181b25] border-[#00ff66]/40 text-[#00ff66]'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${tabSwitchCount > 0 ? 'text-red-400' : 'text-[#00ff66]'}`} />
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase text-slate-400 hidden xs:inline">SHIELD:</span>
              <span className="font-bold text-xs md:text-sm">{tabSwitchCount}/5</span>
            </div>
          </div>

          {/* Doom Threat Gauge (hidden on mobile) */}
          <div className="hidden lg:flex flex-col w-36 px-3 py-1 rounded-sm border border-[#3b4b3a] bg-[#181b25] font-mono">
            <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
              <span>DOOM CONTROL</span>
              <span className={doomGridControl > 50 ? 'text-red-400 font-bold' : 'text-[#00ff66] font-bold'}>{doomGridControl}%</span>
            </div>
            <div className="w-full bg-[#0a0e17] h-1.5 rounded-none overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-500 ${
                  doomGridControl > 50 ? 'bg-red-500' : 'bg-[#00ff66]'
                }`}
                style={{ width: `${doomGridControl}%` }}
              />
            </div>
          </div>

          {/* Team Name Badge (desktop/tablet) */}
          {teamName && (
            <div className="hidden sm:flex px-2 py-1 rounded-sm bg-[#181b25] border border-[#00ff66]/40 text-[#00ff66] font-mono text-xs items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
              <span className="font-bold max-w-[100px] truncate">{teamName}</span>
            </div>
          )}

          {/* Score Badge */}
          <div className="px-2 md:px-3 py-1 rounded-sm bg-[#181b25] border border-[#ffda70]/50 text-[#ffda70] font-mono text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,218,112,0.2)]">
            <Award className="w-3.5 h-3.5 text-[#ffda70]" />
            <span className="font-bold text-xs md:text-sm">{score} PTS</span>
          </div>

          {/* Controls */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onAdminClick();
            }}
            className="p-1.5 rounded-sm border border-[#00eefc]/40 bg-[#181b25] text-slate-400 hover:text-[#00eefc] hover:border-[#00eefc] transition-colors"
            title="Admin Command Portal"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleAudioToggle}
            className="p-1.5 rounded-sm border border-[#00eefc]/40 bg-[#181b25] text-[#00eefc] hover:border-[#00eefc] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00eefc]" />}
          </button>
        </div>

      </div>
    </header>
  );
};
