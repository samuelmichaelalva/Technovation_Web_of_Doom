import React, { useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
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

        {/* Warning Icon */}
        <div className="inline-flex p-4 rounded-full border-2 border-red-500 bg-red-950/50 text-red-400 mb-4 shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-bounce">
          <ShieldAlert className="w-12 h-12" />
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
            <span>This is your <strong className="text-yellow-300">FIRST and FINAL WARNING</strong>. A second tab switch will <strong className="text-red-400">auto-submit your responses and terminate your session permanently</strong>.</span>
          </p>
        </div>

        {/* Anti-Cheat Status */}
        <div className="p-3 bg-[#181b25] border border-red-500/30 text-xs text-red-300 mb-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>ANTI-CHEAT STATUS: <strong className="text-red-400">WARNING 1 / 2</strong></span>
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
