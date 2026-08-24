import React from 'react';
import type { Question } from '../types/game';
import { Cyber3DCore } from './Cyber3DCore';

interface DoombotBattleCanvasProps {
  currentQuestion?: Question;
  solvedCount: number;
  totalQuestions: number;
  lastBlastTrigger: number;
}

export const DoombotBattleCanvas: React.FC<DoombotBattleCanvasProps> = ({
  solvedCount,
  totalQuestions,
  lastBlastTrigger,
}) => {
  return (
    <div className="w-full glass-card p-4 rounded-sm border border-[#00eefc]/30 flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Corner Brackets */}
      <div className="corner-bracket cb-tl" />
      <div className="corner-bracket cb-tr" />
      <div className="corner-bracket cb-bl" />
      <div className="corner-bracket cb-br" />

      <div className="w-full flex items-center justify-between text-xs text-[#00eefc] mb-3 border-b border-[#00eefc]/20 pb-2">
        <span className="font-bold tracking-wider font-mono">TACTICAL 3D CORE HUD</span>
        <span className="text-[#00ff66] font-mono font-bold">
          CLEARED: {solvedCount}/{totalQuestions}
        </span>
      </div>

      <Cyber3DCore
        solvedCount={solvedCount}
        totalQuestions={totalQuestions}
        lastBlastTrigger={lastBlastTrigger}
      />
    </div>
  );
};

