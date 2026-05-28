import type { QuestionExplanationDetail, QuizQuestion } from "@/types/quiz";

export function formatExplanation(
  explanation: QuizQuestion["explanation"]
): string {
  if (typeof explanation === "string") return explanation;
  return explanation.correct;
}

export function getExplanationDetail(
  explanation: QuizQuestion["explanation"]
): QuestionExplanationDetail | null {
  if (typeof explanation === "string") {
    return { correct: explanation };
  }
  return explanation;
}

export function getWrongAnswerNote(
  question: QuizQuestion,
  choice: string
): string | undefined {
  const detail = getExplanationDetail(question.explanation);
  if (!detail?.wrongAnswers) return undefined;
  return detail.wrongAnswers[choice];
}
