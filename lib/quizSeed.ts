import { pickExamQuestions } from "@/lib/questionBank";
import { FREE_SAMPLE_QUESTION_COUNT } from "@/lib/subscription";
import type { QuizQuestion } from "@/types/quiz";

export const PROMETRIC_EXAM_LENGTH = 60;
export const DEFAULT_PRACTICE_LENGTH = 20;

/** Free public sample — fixed count, no login */
export function getSampleExamQuestions(): QuizQuestion[] {
  return pickExamQuestions(FREE_SAMPLE_QUESTION_COUNT);
}

/** Practice exam questions from the local Maryland question bank */
export function getPracticeExamQuestions(
  count = DEFAULT_PRACTICE_LENGTH,
  options?: {
    domains?: string[];
    subdomains?: string[];
    prometricOnly?: boolean;
  }
): QuizQuestion[] {
  return pickExamQuestions(count, {
    domains: options?.domains,
    subdomains: options?.subdomains,
    difficulties: options?.prometricOnly
      ? ["hard", "prometric"]
      : undefined,
  });
}

export function getPrometricExamQuestions(
  count = PROMETRIC_EXAM_LENGTH
): QuizQuestion[] {
  return pickExamQuestions(count, {
    difficulties: ["medium", "hard", "prometric"],
  });
}
