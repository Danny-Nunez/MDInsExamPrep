import { pickExamQuestions } from "@/lib/questionBank";
import { FREE_SAMPLE_QUESTION_COUNT } from "@/lib/subscription";
import type { QuizQuestion } from "@/types/quiz";

export const PROMETRIC_EXAM_LENGTH = 60;
export const DEFAULT_PRACTICE_LENGTH = 20;

import type { Difficulty } from "@/types/quiz";

const EXAM_LIKE_DIFFICULTIES: Difficulty[] = ["hard", "prometric"];

/** Free public sample — exam-like difficulty only */
export function getSampleExamQuestions(): QuizQuestion[] {
  return pickExamQuestions(FREE_SAMPLE_QUESTION_COUNT, {
    difficulties: EXAM_LIKE_DIFFICULTIES,
  });
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
    difficulties: EXAM_LIKE_DIFFICULTIES,
  });
}

export function getPrometricExamQuestions(
  count = PROMETRIC_EXAM_LENGTH
): QuizQuestion[] {
  return pickExamQuestions(count, {
    difficulties: ["medium", "hard", "prometric"],
  });
}
