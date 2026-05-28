import { mergeCategoryPerformance } from "@/lib/domains";
import {
  fetchCategoryPerformance,
  fetchExamAttempts,
  saveExamToServer,
} from "@/lib/api-client";
import type {
  CategoryPerformance,
  ExamAttempt,
  QuizQuestion,
} from "@/types/quiz";

const ATTEMPTS_KEY = "examPrep_attempts";
const CATEGORY_KEY = "examPrep_categoryPerformance";
const ACTIVE_QUIZ_KEY = "examPrep_activeQuiz";
const QUIZ_ID_KEY = "examPrep_activeQuizId";

export function getExamAttemptsLocal(): ExamAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExamAttempt[];
  } catch {
    return [];
  }
}

function saveExamAttemptLocal(attempt: ExamAttempt): void {
  const attempts = getExamAttemptsLocal();
  attempts.unshift(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));

  const existing = getCategoryPerformanceLocal();
  const merged = mergeCategoryPerformance(
    existing,
    attempt.domainScores.map((d) => ({
      domain: d.domain,
      subdomain: d.subdomain,
      correct: d.correct,
      total: d.total,
    }))
  );
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(merged));
}

export function getCategoryPerformanceLocal(): CategoryPerformance[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CategoryPerformance[];
  } catch {
    return [];
  }
}

export async function getExamAttempts(
  isLoggedIn: boolean
): Promise<ExamAttempt[]> {
  if (isLoggedIn) {
    try {
      return await fetchExamAttempts();
    } catch {
      return getExamAttemptsLocal();
    }
  }
  return getExamAttemptsLocal();
}

export async function getCategoryPerformance(
  isLoggedIn: boolean
): Promise<CategoryPerformance[]> {
  if (isLoggedIn) {
    try {
      return await fetchCategoryPerformance();
    } catch {
      return getCategoryPerformanceLocal();
    }
  }
  return getCategoryPerformanceLocal();
}

export async function saveExamAttempt(
  attempt: ExamAttempt,
  isLoggedIn: boolean,
  options?: {
    source?: "seed" | "ai";
    quizId?: string;
    questions?: QuizQuestion[];
  }
): Promise<void> {
  if (isLoggedIn) {
    const saved = await saveExamToServer(attempt, options);
    if (saved) return;
  }
  saveExamAttemptLocal(attempt);
}

export function setActiveQuiz(questions: QuizQuestion[], quizId?: string): void {
  localStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(questions));
  if (quizId) {
    localStorage.setItem(QUIZ_ID_KEY, quizId);
  } else {
    localStorage.removeItem(QUIZ_ID_KEY);
  }
}

export function getActiveQuiz(): QuizQuestion[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_QUIZ_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizQuestion[];
  } catch {
    return null;
  }
}

export function getActiveQuizId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(QUIZ_ID_KEY);
}

export function clearActiveQuiz(): void {
  localStorage.removeItem(ACTIVE_QUIZ_KEY);
  localStorage.removeItem(QUIZ_ID_KEY);
}

export function getWeakAreaCount(performance: CategoryPerformance[]): number {
  return performance.filter((p) => p.total > 0 && p.percentage < 75).length;
}
