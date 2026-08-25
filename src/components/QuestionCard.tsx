import React, { useState, useEffect } from 'react';
import type { Question, UserAnswerState } from '../types/game';
import { Eye, CheckCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  existingAnswer?: UserAnswerState;
  onAnswerSubmit: (selectedOption: string) => void;
  onOpenHintModal: () => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  existingAnswer,
  onAnswerSubmit,
  onOpenHintModal,
  onNextQuestion,
  onPrevQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption || '');
    } else {
      setSelectedOption('');
    }
  }, [question.id, existingAnswer]);

  const handleSelectOption = (option: string) => {
    if (existingAnswer) return;
    soundEngine.playClick();
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    onAnswerSubmit(selectedOption);
  };

  return (
    <div className="w-full glass-card rounded-none p-5 md:p-7 border border-[#00eefc]/30 flex flex-col justify-between font-mono relative overflow-hidden">
      {/* Corner Brackets */}
      <div className="corner-bracket cb-tl" />
      <div className="corner-bracket cb-tr" />
      <div className="corner-bracket cb-bl" />
      <div className="corner-bracket cb-br" />

      <div>
        {/* Badges Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#00eefc]/20 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#181b25] border border-slate-700 text-[#dfe2f0] font-bold text-xs">
              QUESTION {questionIndex + 1} OF {totalQuestions}
            </span>
            <span className="px-3 py-1 bg-[#181b25] border border-[#00eefc]/40 text-[#00eefc] text-xs font-semibold uppercase">
              {question.topic}
            </span>
            <span className="px-3 py-1 bg-[#181b25] border border-[#ffda70]/60 text-[#ffda70] text-xs font-bold uppercase">
              {question.difficulty} - +{question.points} PTS
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHintModal();
            }}
            className={`px-3 py-1.5 border text-xs flex items-center gap-1.5 transition-all font-mono ${
              existingAnswer?.hintUsed
                ? 'bg-[#ffda70]/20 border-[#ffda70] text-[#ffda70]'
                : 'bg-[#181b25] border-slate-700 text-slate-400 hover:text-[#ffda70] hover:border-[#ffda70]/50'
            }`}
          >
            <Eye className="w-4 h-4 text-[#ffda70]" />
            <span>{existingAnswer?.hintUsed ? 'HINT REVEALED' : 'REVEAL HINT (-50 PTS)'}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <h3 className="text-lg md:text-xl font-bold text-[#dfe2f0] mb-5 leading-relaxed tracking-wider font-mono uppercase">
          {question.question}
        </h3>

        {/* Code Snippet */}
        {question.codeSnippet && (
          <div className="mb-6 rounded-none bg-[#0a0e17] border border-[#00eefc]/30 p-4 font-mono overflow-x-auto shadow-inner">
            <pre className="text-xs md:text-sm text-[#00eefc] font-mono leading-relaxed whitespace-pre-wrap">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Choice Options */}
        {question.options && (
          <div className="space-y-3 mb-6 font-mono">
            {question.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === option;
              const isSubmitted = Boolean(existingAnswer);
              const isCorrectOption = option === question.correctAnswer;

              let optionStyle = 'border-slate-800 bg-[#181b25]/80 text-[#dfe2f0] hover:border-[#00eefc]/40';

              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.3)]';
                } else if (isSelected && !existingAnswer?.isCorrect) {
                  optionStyle = 'border-red-500 bg-red-950/40 text-red-300';
                } else {
                  optionStyle = 'border-slate-850 bg-slate-950/40 text-slate-600 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-[#00eefc] bg-[#00eefc]/10 text-[#00eefc] shadow-[0_0_12px_rgba(0,238,252,0.3)]';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 border transition-all flex items-start gap-3 text-xs md:text-sm rounded-none ${optionStyle}`}
                >
                  <span className="text-[#00eefc] font-bold font-mono">[{letter}]</span>
                  <span className="flex-1 font-sans">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation and Transmit Button */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4 font-mono">
        <button
          onClick={() => {
            soundEngine.playClick();
            onPrevQuestion();
          }}
          disabled={questionIndex === 0}
          className="px-4 py-2.5 border border-slate-800 bg-[#181b25] text-slate-400 hover:text-white hover:border-slate-700 text-xs font-bold disabled:opacity-30 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <div className="flex items-center gap-3">
          {!existingAnswer ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-6 py-3 bg-[#00ff66] text-[#003911] font-black text-xs uppercase tracking-wider hover:brightness-110 btn-flicker flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.4)] disabled:opacity-40"
            >
              <span>TRANSMIT ANSWER</span>
              <Zap className="w-4 h-4 fill-[#003911]" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#00ff66] font-bold px-4 py-2 bg-[#00ff66]/10 border border-[#00ff66]/40">
              <CheckCircle className="w-4 h-4 text-[#00ff66]" />
              <span>SECTOR LOCKED</span>
            </div>
          )}

          <button
            onClick={() => {
              soundEngine.playClick();
              onNextQuestion();
            }}
            disabled={questionIndex === totalQuestions - 1}
            className="px-4 py-2.5 border border-[#00eefc]/40 bg-[#181b25] text-[#00eefc] hover:border-[#00eefc] text-xs font-bold disabled:opacity-30 flex items-center gap-1"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
