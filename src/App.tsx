import { useState, useEffect } from 'react';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import type { Question, TeamSession, UserAnswerState } from './types/game';
import { getLocalSession, getCustomQuestions } from './utils/storage';
import { syncSessionState } from './utils/syncService';
import { HeaderHUD } from './components/HeaderHUD';
import { TeamLoginModal } from './components/TeamLoginModal';
import { DoombotBattleCanvas } from './components/DoombotBattleCanvas';
import { QuestionCard } from './components/QuestionCard';
import { QuestionNavigator } from './components/QuestionNavigator';
import { HintModal } from './components/HintModal';
import { MissionCompleteScreen } from './components/MissionCompleteScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { soundEngine } from './utils/soundEngine';
import './styles/hud.css';

export function App() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    return getCustomQuestions() || DEFAULT_QUESTIONS;
  });

  const [session, setSession] = useState<TeamSession | null>(() => getLocalSession());
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [lastBlastTrigger, setLastBlastTrigger] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(1800); // 30 mins = 1800s
  const [showAdmin, setShowAdmin] = useState(false);

  // Synchronize 30-minute timer based on session start_time
  useEffect(() => {
    if (!session || session.isCompleted) return;

    const calculateTime = () => {
      const startTime = new Date(session.startTime).getTime();
      const elapsedMs = Date.now() - startTime;
      const totalSessionMs = 30 * 60 * 1000; // 30 minutes
      const rem = Math.max(0, Math.floor((totalSessionMs - elapsedMs) / 1000));
      setRemainingSeconds(rem);

      if (rem === 0 && !session.isCompleted) {
        // Auto-complete session on timer expiration
        const updated: TeamSession = { ...session, isCompleted: true };
        setSession(updated);
        syncSessionState(updated);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const handleSessionStarted = (newSession: TeamSession) => {
    setSession(newSession);
    setCurrentIdx(newSession.currentQuestionIdx || 0);
  };

  const handleAnswerSubmit = (selectedOption: string) => {
    if (!session) return;

    const q = questions[currentIdx];
    const isCorrect = selectedOption === q.correctAnswer;
    const isHintUsed = session.hintsUsed?.includes(q.id) || false;
    
    // Score logic: Base difficulty points minus 50 pts if hint taken
    const basePts = q.points;
    const earned = isCorrect ? Math.max(0, basePts - (isHintUsed ? 50 : 0)) : 0;

    const newAnswer: UserAnswerState = {
      questionId: q.id,
      selectedOption,
      isCorrect,
      pointsEarned: earned,
      hintUsed: isHintUsed,
      answeredAt: new Date().toISOString(),
    };

    const updatedAnswers = { ...session.answers, [q.id]: newAnswer };
    const newScore = Object.values(updatedAnswers).reduce((acc, curr) => acc + curr.pointsEarned, 0);
    const isAllCompleted = Object.keys(updatedAnswers).length >= questions.length;

    if (isCorrect) {
      soundEngine.playLaserBlast();
      setLastBlastTrigger(Date.now());
    } else {
      soundEngine.playAlarm();
    }

    const updatedSession: TeamSession = {
      ...session,
      score: newScore,
      answers: updatedAnswers,
      currentQuestionIdx: Math.min(questions.length - 1, currentIdx + 1),
      isCompleted: isAllCompleted,
    };

    setSession(updatedSession);
    syncSessionState(updatedSession);

    if (!isAllCompleted && currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleConfirmHintReveal = () => {
    if (!session) return;
    const q = questions[currentIdx];
    const hints = Array.from(new Set([...(session.hintsUsed || []), q.id]));

    const updated: TeamSession = {
      ...session,
      hintsUsed: hints,
    };

    setSession(updated);
    syncSessionState(updated);
    setIsHintModalOpen(false);
  };

  if (showAdmin) {
    return (
      <AdminDashboard
        questions={questions}
        onUpdateQuestions={(updated: Question[]) => setQuestions(updated)}
        onBackToApp={() => setShowAdmin(false)}
      />
    );
  }

  if (!session) {
    return <TeamLoginModal onSessionStarted={handleSessionStarted} />;
  }

  const currentQ = questions[currentIdx] || questions[0];
  const existingAnswer = session.answers[currentQ?.id];
  const solvedCount = Object.keys(session.answers || {}).length;

  return (
    <div className="min-h-screen bg-[#050811] bg-cyber-grid text-slate-100 scanlines flex flex-col font-mono">
      <HeaderHUD
        teamName={session.teamName}
        score={session.score}
        remainingSeconds={remainingSeconds}
        solvedCount={solvedCount}
        totalQuestions={questions.length}
        onAdminClick={() => setShowAdmin(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {session.isCompleted || remainingSeconds === 0 ? (
          <MissionCompleteScreen
            teamName={session.teamName}
            teamId={session.teamId}
            score={session.score}
            solvedCount={solvedCount}
            totalQuestions={questions.length}
            hintsUsedCount={session.hintsUsed?.length || 0}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Radar HUD & Matrix Navigator */}
            <div className="lg:col-span-1 space-y-6">
              <DoombotBattleCanvas
                currentQuestion={currentQ}
                solvedCount={solvedCount}
                totalQuestions={questions.length}
                lastBlastTrigger={lastBlastTrigger}
              />

              <QuestionNavigator
                questions={questions}
                currentIdx={currentIdx}
                answers={session.answers}
                onSelectQuestion={(idx: number) => setCurrentIdx(idx)}
              />
            </div>

            {/* Right Question Card */}
            <div className="lg:col-span-2">
              <QuestionCard
                question={currentQ}
                questionIndex={currentIdx}
                totalQuestions={questions.length}
                existingAnswer={existingAnswer}
                onAnswerSubmit={handleAnswerSubmit}
                onOpenHintModal={() => setIsHintModalOpen(true)}
                onNextQuestion={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                onPrevQuestion={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              />
            </div>

          </div>
        )}
      </main>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        hintText={currentQ?.hint || ''}
        isAlreadyRevealed={session.hintsUsed?.includes(currentQ?.id) || false}
        onConfirmReveal={handleConfirmHintReveal}
        onClose={() => setIsHintModalOpen(false)}
      />

      {/* Footer copyright bar */}
      <footer className="w-full py-3 border-t border-slate-800 bg-[#070b16] text-center text-[11px] text-slate-500 font-mono">
        WEB OF DOOM // DOCTOR DOOM TECHNOVATION ROUND 01 // VERCEL READY
      </footer>
    </div>
  );
}

export default App;
