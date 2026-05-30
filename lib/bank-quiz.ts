import type { BankQuizQuestion } from "@/types/question-bank";
import type { QuizQuestion } from "@/types/quiz";
import { MARYLAND_EXAM } from "@/types/quiz";

function mapDifficulty(d: string): QuizQuestion["difficulty"] {
  const lower = d.toLowerCase();
  if (lower === "easy") return "easy";
  if (lower === "hard") return "hard";
  if (lower === "prometric") return "prometric";
  return "medium";
}

export function bankQuestionToQuiz(q: BankQuizQuestion): QuizQuestion {
  return {
    id: q.id,
    state: MARYLAND_EXAM.state,
    examType: MARYLAND_EXAM.examType,
    domain: q.domain,
    subdomain: q.subdomain,
    difficulty: mapDifficulty(q.difficulty),
    question: q.question,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    sourceType: "curated",
  };
}

export async function recordBankProgress(
  conceptId: string,
  isCorrect: boolean
) {
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ conceptId, isCorrect }),
  });
}
