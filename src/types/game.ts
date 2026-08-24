export type QuestionType = 'mcq' | 'output' | 'debugging';
export type QuestionTopic = 'Arrays' | 'Strings' | 'Stacks/Queues' | 'Recursion' | 'Time Complexity' | 'Basic Trees' | 'Trees & Graphs' | 'DP & Greedy';
export type DifficultyTier = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  topic: QuestionTopic;
  type: QuestionType;
  difficulty: DifficultyTier;
  question: string;
  codeSnippet?: string;
  options?: string[]; // For MCQs or multiple options
  correctAnswer: string; // Correct option text or exact string output
  explanation?: string;
  hint: string;
  points: number; // e.g. Easy: 100, Medium: 200, Hard: 300
}

export interface UserAnswerState {
  questionId: string;
  selectedOption?: string;
  userCodeOutput?: string;
  isCorrect: boolean;
  pointsEarned: number;
  hintUsed: boolean;
  answeredAt: string; // ISO Timestamp
}

export interface TeamSession {
  id?: string;
  teamId: string;
  teamName: string;
  deviceToken: string;
  startTime: string; // ISO Timestamp
  endTime?: string;
  score: number;
  currentQuestionIdx: number;
  answers: Record<string, UserAnswerState>; // Stored as JSONB in Supabase
  hintsUsed: string[]; // List of question IDs where hint was revealed
  isCompleted: boolean;
  lastActiveAt: string;
  tabSwitchCount: number; // Anti-cheat: tracks tab switch violations (0, 1, 2)
  isDisqualified: boolean; // Anti-cheat: true if auto-submitted due to 2nd tab switch
}

export interface DoombotTarget {
  id: string;
  name: string;
  type: QuestionType;
  maxHp: number;
  currentHp: number;
  isDestroyed: boolean;
}
