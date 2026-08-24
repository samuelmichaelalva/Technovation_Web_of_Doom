import React, { useState } from 'react';
import { Volume2, VolumeX, Play, AlertTriangle } from 'lucide-react';
import { initializeTeamSession } from '../utils/syncService';
import type { TeamSession } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface TeamLoginModalProps {
  onSessionStarted: (session: TeamSession) => void;
}

export const TeamLoginModal: React.FC<TeamLoginModalProps> = ({ onSessionStarted }) => {
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMutedState());

  const handleAudioToggle = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId.trim() || !teamName.trim()) {
      setErrorMsg('Please enter both Team ID and Team Name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    soundEngine.playClick();

    const res = await initializeTeamSession(teamId.trim().toUpperCase(), teamName.trim());
    setIsLoading(false);

    if (res.success && res.session) {
      soundEngine.playSuccess();
      onSessionStarted(res.session);
    } else {
      soundEngine.playAlarm();
      setErrorMsg(res.message || 'Failed to initialize session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] bg-cyber-grid flex items-center justify-center p-4 md:p-8 font-mono">
      <main className="w-full max-w-md relative z-20">
        <div className="glass-card rounded-md p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">

          {/* Corner Brackets */}
          <div className="corner-bracket cb-tl" />
          <div className="corner-bracket cb-tr" />
          <div className="corner-bracket cb-bl" />
          <div className="corner-bracket cb-br" />

          {/* Header Section */}
          <header className="relative flex flex-col items-center text-center pb-4 border-b border-[#00eefc]/20">
            <button
              type="button"
              onClick={handleAudioToggle}
              aria-label="Toggle Sound"
              className="absolute top-0 right-0 text-[#00eefc] hover:text-white transition-colors z-20 focus:outline-none"
            >
              {isMuted ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-[#00eefc] animate-pulse" />}
            </button>

            {/* Doctor Doom Avatar Emblem (Fixed 96x96px container) */}
            <div className="mb-4 text-[#00ff66]">
              <div className="relative w-24 h-24 max-w-[96px] max-h-[96px] mx-auto rounded-full border-2 border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.6)] overflow-hidden bg-[#0a0e17] flex items-center justify-center select-none">
                <img
                  alt="Doctor Doom"
                  draggable={false}
                  className="w-full h-full object-cover opacity-90 mix-blend-lighten max-w-full max-h-full select-none pointer-events-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUC6Umd71asYUmYyCSJa2zotKoUCTB-7cufQN23Z7AIb7bRQqj2b4mhaF2g_k86hfz-uNVNGjK0jID2gNMDyvGC6MjwEIBFEeb7hTBefjnl-gYfzC6sA8Ha940b-XSeHAgSj6lCuPUF7oKJgmkuugUEJWILJf1B0naQi6dl-NvAoEpfLNDm80zBbEpjh2vtoUVGCYO-XcA6p5cUoSkd8BGRJThaZZeWUkvrwAB2afgRKr0VWyqvpXu-ECDrkyJaA8dQ"
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black neon-text-green uppercase tracking-tighter mb-2 font-mono">
              WEB OF DOOM
            </h1>
            <h2 className="text-xs font-mono neon-text-cyan tracking-wider">
              // ROUND 01 : DOOMBOT WAVE DEFENSE
            </h2>
          </header>

          {/* Intelligence Briefing */}
          <section className="bg-[#181b25] border border-[#00eefc]/30 p-4 rounded-sm relative font-mono">
            <div className="absolute inset-0 bg-[#00eefc]/5 pointer-events-none" />
            <p className="text-xs text-[#00eefc] leading-relaxed mb-4 relative z-10 font-mono">
              &gt; SYSTEM ALERT: Doctor Doom has deployed Doombots across the digital grid.<br />
              &gt; DIRECTIVE: Solve MCQs, Output Predictions, and Debugging challenges to reclaim city sectors.
            </p>
            <div className="bg-[#f1c100] text-[#3d2f00] text-xs px-3 py-2 rounded-sm inline-flex items-center gap-2 border border-[#ffda70] font-bold relative z-10 w-full justify-center text-center">
              <AlertTriangle className="w-4 h-4 text-[#3d2f00]" />
              <span>STRICT RULE: 1 Device = 1 Team = 1 Active Session</span>
            </div>
          </section>

          {/* Error Notification */}
          {errorMsg && (
            <div className="p-3 rounded-sm bg-red-950/80 border border-red-500 text-red-300 font-mono text-xs flex items-start gap-2 animate-bounce">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">AUTHENTICATION REJECTED</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 font-mono">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#00ff66]/80 font-bold ml-1 tracking-wider" htmlFor="team-id">
                UNIQUE TEAM ID
              </label>
              <input
                id="team-id"
                type="text"
                required
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="TEAM-404"
                className="w-full bg-[#1c1f29]/80 text-[#dfe2f0] text-sm px-4 py-3 border-0 border-b border-[#00eefc]/50 focus:ring-0 input-glow transition-all rounded-t-sm placeholder-[#b9ccb5]/50 font-mono tracking-wider uppercase"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#00ff66]/80 font-bold ml-1 tracking-wider" htmlFor="team-name">
                TEAM NAME
              </label>
              <input
                id="team-name"
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Cyber Doomers"
                className="w-full bg-[#1c1f29]/80 text-[#dfe2f0] text-sm px-4 py-3 border-0 border-b border-[#00eefc]/50 focus:ring-0 input-glow transition-all rounded-t-sm placeholder-[#b9ccb5]/50 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-[#00ff66] text-[#003911] font-bold text-sm py-4 rounded-sm flex items-center justify-center gap-2 btn-flicker uppercase shadow-[0_0_15px_rgba(0,255,102,0.4)] disabled:opacity-50 tracking-wider"
            >
              {isLoading ? (
                <span>INITIALIZING LINK...</span>
              ) : (
                <>
                  <span>INITIATE DOOMBOT DEFENSE</span>
                  <Play className="w-4 h-4 fill-[#003911]" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};
