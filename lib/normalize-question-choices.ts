import type { QuestionLike } from "@/lib/question-quality-checklist";

const LETTER_ONLY_CHOICE = /^[a-d]$/i;

/** Model copied the JSON template ["a","b","c","d"] instead of real answer text. */
export function isPlaceholderLetterChoices(choices: string[]): boolean {
  return (
    choices.length === 4 &&
    choices.every((c) => LETTER_ONLY_CHOICE.test(c.trim()))
  );
}

export function normalizeChoicesField(raw: unknown): string[] | null {
  if (Array.isArray(raw)) {
    const choices = raw.map((c) => String(c).trim()).filter(Boolean);
    return choices.length === 4 ? choices : null;
  }
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const choices = ["a", "b", "c", "d"].map((k) => {
      const v = o[k] ?? o[k.toUpperCase()];
      return typeof v === "string" ? v.trim() : "";
    });
    if (choices.every((c) => c.length > 0)) return choices;
  }
  return null;
}

function resolveCorrectAnswer(
  correctAnswer: string,
  choices: string[]
): string | null {
  const trimmed = correctAnswer.trim();
  if (choices.includes(trimmed)) return trimmed;
  if (LETTER_ONLY_CHOICE.test(trimmed)) {
    const idx = trimmed.toLowerCase().charCodeAt(0) - 97;
    if (idx >= 0 && idx < choices.length) return choices[idx];
  }
  return null;
}

/** Normalize one generated question; returns null if unusable (e.g. letter placeholders). */
export function normalizeGeneratedQuestion(
  item: Record<string, unknown>
): QuestionLike | null {
  if (typeof item.question !== "string" || !item.question.trim()) return null;

  const choices = normalizeChoicesField(item.choices);
  if (!choices || isPlaceholderLetterChoices(choices)) return null;

  if (typeof item.correctAnswer !== "string") return null;
  const correctAnswer = resolveCorrectAnswer(item.correctAnswer, choices);
  if (!correctAnswer) return null;

  if (typeof item.explanation !== "string" || !item.explanation.trim()) {
    return null;
  }

  return {
    question: item.question.trim(),
    choices,
    correctAnswer,
    explanation: item.explanation.trim(),
    difficulty: "prometric",
  };
}
