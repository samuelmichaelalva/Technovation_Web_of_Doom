import React from 'react';
import { HelpCircle, AlertTriangle, Check, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HintModalProps {
  isOpen: boolean;
  hintText: string;
  isAlreadyRevealed: boolean;
  onConfirmReveal: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  hintText,
  isAlreadyRevealed,
  onConfirmReveal,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full hud-panel rounded-2xl p-6 border border-amber-500/50 shadow-[0_0_30px_rgba(255,184,0,0.2)] font-mono relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>TACTICAL HINT TRANSMISSION</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAlreadyRevealed ? (
          <div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs mb-4 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-200 uppercase">WARNING: SCORE DEDUCTION</div>
                <div>Revealing this tactical hint will apply a permanent fixed mark deduction of <strong className="text-amber-100 font-bold">-50 PTS</strong>.</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6">
              Do you wish to proceed with intelligence decryption?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 text-xs font-bold hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onConfirmReveal();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase hover:brightness-110 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,184,0,0.4)]"
              >
                <Check className="w-4 h-4" />
                <span>REVEAL HINT (-50 PTS)</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-6 font-mono">
              <div className="text-[10px] text-amber-400/70 uppercase mb-1 font-bold">DECRYPTED HINT:</div>
              <p className="text-slate-200 text-sm font-sans">{hintText}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:border-cyan-400"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
