import React from 'react';
import type { Question, UserAnswerState } from '../types/game';
import { soundEngine } from '../utils/soundEngine';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, UserAnswerState>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIdx,
  answers,
  onSelectQuestion,
}) => {
  return (
    <div className="w-full glass-card p-4 rounded-sm border border-[#00eefc]/30 font-mono relative">
      {/* Corner Brackets */}
      <div className="corner-bracket cb-tl" />
      <div className="corner-bracket cb-tr" />
      <div className="corner-bracket cb-bl" />
      <div className="corner-bracket cb-br" />

      <div className="flex items-center justify-between text-xs text-[#00eefc] mb-3 border-b border-[#00eefc]/20 pb-2 font-mono">
        <span className="font-bold tracking-wider">GRID MATRIX NAVIGATION</span>
        <span className="text-slate-400 text-[10px]">{questions.length} SECTORS</span>
      </div>

      {/* Grid Buttons */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 mb-3">
        {questions.map((q, idx) => {
          const answerState = answers[q.id];
          const isCurrent = idx === currentIdx;
          const isAnswered = Boolean(answerState);

          let badgeStyle = 'bg-[#181b25] border-slate-800 text-slate-500 hover:border-[#00eefc]/40';

          if (isCurrent) {
            badgeStyle = 'bg-[#0a0e17] border-[#00eefc] text-[#00eefc] font-black shadow-[0_0_10px_rgba(0,238,252,0.4)]';
          } else if (isAnswered) {
            badgeStyle = 'bg-[#00ff66]/10 border-[#00ff66]/60 text-[#00ff66] font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectQuestion(idx);
              }}
              className={`h-9 rounded-none border flex items-center justify-center text-xs transition-all font-mono ${badgeStyle}`}
            >
              <span>{String(idx + 1).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      <div className="text-center text-[10px] text-slate-600 uppercase font-mono tracking-widest pt-1 border-t border-slate-800/60">
        [ DATA STREAM SECURED ]
      </div>
    </div>
  );
};
