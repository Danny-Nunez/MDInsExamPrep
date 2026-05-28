export const PASS_THRESHOLD = 75;
export const WEAK_THRESHOLD = 75;

export const MARYLAND_EXAM = {
  state: "Maryland",
  examType: "Life and Health",
} as const;

/** Top-level Maryland Producer exam domains (blueprint) */
export const DOMAINS = [
  "Life Insurance",
  "Health Insurance",
  "Maryland Insurance Regulations",
  "General Insurance Concepts",
] as const;

export type Domain = (typeof DOMAINS)[number];

export type Difficulty = "easy" | "medium" | "hard" | "prometric";

export type QuestionExplanationDetail = {
  correct: string;
  wrongAnswers?: Record<string, string>;
};

export type QuizQuestion = {
  id: string;
  state: string;
  examType: string;
  domain: string;
  subdomain?: string;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string | QuestionExplanationDetail;
  isStateLaw?: boolean;
  sourceType?: "curated" | "ai" | "ai-reviewed" | "seed";
};

export type ExamAnswer = {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  domain: string;
  subdomain?: string;
};

export type DomainScore = {
  domain: string;
  subdomain?: string;
  correct: number;
  total: number;
  percentage: number;
};

export type ExamAttempt = {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: ExamAnswer[];
  domainScores: DomainScore[];
  mode?: "study" | "exam";
  timeSpentSeconds?: number;
};

export type CategoryPerformance = {
  domain: string;
  subdomain?: string;
  correct: number;
  total: number;
  percentage: number;
};

export type ExamImageWeakArea = {
  domain: string;
  confidence: number;
  issue: string;
  recommendation: string;
};

export type ExamImageAnalysis = {
  id: string;
  createdAt: string;
  sourceImageName: string;
  summary: string;
  weakAreas: ExamImageWeakArea[];
};

/** @deprecated Use DOMAINS — kept for migration references */
export const LEGACY_DOMAINS = [
  "Annuities",
  "Medical Plans",
  "Qualified Plans",
  "Health Insurance Basics",
  "General Insurance",
  "Life Insurance Policies",
  "Group Health Insurance",
  "Insurance Regulation",
  "Life Insurance Basics",
] as const;
