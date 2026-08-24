import React, { useEffect } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface TabViolationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const TabViolationModal: React.FC<TabViolationModalProps> = ({ isOpen, onDismiss }) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playAlarm();
      // Play a second alarm slightly delayed for dramatic effect
      const t = setTimeout(() => soundEngine.playAlarm(), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md font-mono animate-pulse">
      {/* Glitch scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-60" />

      <div className="max-w-lg w-full mx-4 border-2 border-red-500 bg-[#0a0209] p-6 md:p-8 text-center relative shadow-[0_0_80px_rgba(255,0,85,0.5),inset_0_0_40px_rgba(255,0,0,0.1)]">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-500" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-500" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-500" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-500" />

        <div className="relative w-20 h-20 max-w-[80px] max-h-[80px] mx-auto mb-4 rounded-full border-2 border-red-500 bg-red-950/50 shadow-[0_0_30px_rgba(255,0,0,0.6)] overflow-hidden flex items-center justify-center select-none animate-pulse">
          <img
            alt="Doctor Doom"
            draggable={false}
            className="w-full h-full object-cover opacity-90 mix-blend-lighten select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUC6Umd71asYUmYyCSJa2zotKoUCTB-7cufQN23Z7AIb7bRQqj2b4mhaF2g_k86hfz-uNVNGjK0jID2gNMDyvGC6MjwEIBFEeb7hTBefjnl-gYfzC6sA8Ha940b-XSeHAgSj6lCuPUF7oKJgmkuugUEJWILJf1B0naQi6dl-NvAoEpfLNDm80zBbEpjh2vtoUVGCYO-XcA6p5cUoSkd8BGRJThaZZeWUkvrwAB2afgRKr0VWyqvpXu-ECDrkyJaA8dQ"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-tighter mb-2" style={{ textShadow: '0 0 20px rgba(255,0,85,0.8), 0 0 40px rgba(255,0,85,0.4)' }}>
          ⚠ SECURITY BREACH DETECTED
        </h2>

        <div className="flex items-center justify-center gap-2 text-xs text-red-300 mb-6 tracking-widest">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>UNSANCTIONED TAB SWITCH RECORDED</span>
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>

        {/* Warning Message */}
        <div className="p-4 bg-red-950/40 border border-red-500/50 text-left text-sm text-red-200 leading-relaxed mb-6 space-y-2">
          <p className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>Your <strong className="text-white">question order has been reshuffled</strong> as a security countermeasure.</span>
          </p>
          <p className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>You are allowed a maximum of <strong className="text-yellow-300">5 tab switches</strong>. Reaching 5 violations will <strong className="text-red-400">auto-submit your responses and lock you out permanently</strong>.</span>
          </p>
        </div>

        {/* Anti-Cheat Status */}
        <div className="p-3 bg-[#181b25] border border-red-500/30 text-xs text-red-300 mb-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>ANTI-CHEAT PROTOCOL: <strong className="text-red-400">RESHUFFLE & SIREN ENGAGED</strong></span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider text-sm transition-colors shadow-[0_0_20px_rgba(255,0,0,0.4)]"
        >
          ACKNOWLEDGE — RETURN TO MISSION
        </button>
      </div>
    </div>
  );
};
