export type QuestionLike = {
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
};

export type QualityCheckResult = {
  pass: boolean;
  score: number;
  failures: string[];
};

const EXAM_STEM_RE =
  /\b(best|most appropriate|most likely|primarily|least likely|not\s+(?:an\s+)?(?:example|true)|except|unless)\b/i;

const DEFINITION_STEM_RE =
  /^what is (?:the )?(?:definition|meaning)/i;

const TRIVIAL_STEM_RE = /^which of the following (?:is|are) (?:true|correct)\b/i;

const BAD_CHOICE_RE = /\b(all of the above|none of the above)\b/i;

export function normalizeDifficultyLabel(label: string | undefined): string {
  if (!label) return "";
  const d = label.trim().toLowerCase();
  if (d === "moderate") return "medium";
  return d;
}

/** Rule-based Prometric quality gate (no API cost). */
export function evaluateQuestionQuality(q: QuestionLike): QualityCheckResult {
  const failures: string[] = [];
  const stem = (q.question ?? "").trim();
  const choices = (q.choices ?? []).map((c) => String(c).trim());
  const explanation = String(q.explanation ?? "").trim();
  const difficulty = normalizeDifficultyLabel(q.difficulty);

  if (difficulty !== "prometric") {
    failures.push("difficulty_not_prometric");
  }
  if (stem.length < 50) failures.push("stem_too_short");
  if (stem.length > 1200) failures.push("stem_too_long");
  if (!stem.includes("?") && !EXAM_STEM_RE.test(stem)) {
    failures.push("missing_scenario_or_exam_wording");
  }
  if (DEFINITION_STEM_RE.test(stem) || TRIVIAL_STEM_RE.test(stem)) {
    failures.push("recall_style_stem");
  }
  if (choices.length !== 4) failures.push("choices_count_not_four");
  if (new Set(choices).size !== 4) failures.push("duplicate_choices");
  if (choices.some((c) => c.length < 8)) failures.push("choice_too_short");
  if (choices.some((c) => BAD_CHOICE_RE.test(c))) failures.push("weak_choice_pattern");
  if (!choices.includes(q.correctAnswer?.trim() ?? "")) {
    failures.push("correct_answer_not_in_choices");
  }
  if (explanation.length < 40) failures.push("explanation_too_short");

  const pass = failures.length === 0;
  const score = pass ? 100 : Math.max(0, 100 - failures.length * 12);

  return { pass, score, failures };
}

export function parseGeneratedQuestions(content: string) {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonStr) as { questions?: unknown[] };
  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid response shape: missing questions array");
  }

  const valid: QuestionLike[] = [];
  for (const item of parsed.questions) {
    if (!item || typeof item !== "object") continue;
    const q = item as Record<string, unknown>;
    if (typeof q.question !== "string" || !q.question.trim()) continue;
    if (
      !Array.isArray(q.choices) ||
      q.choices.length !== 4 ||
      !q.choices.every((c) => typeof c === "string" && c.trim())
    ) {
      continue;
    }
    if (
      typeof q.correctAnswer !== "string" ||
      !(q.choices as string[]).includes(q.correctAnswer)
    ) {
      continue;
    }
    if (typeof q.explanation !== "string" || !q.explanation.trim()) continue;
    valid.push({
      question: q.question.trim(),
      choices: (q.choices as string[]).map((c) => c.trim()),
      correctAnswer: q.correctAnswer.trim(),
      explanation: q.explanation.trim(),
      difficulty: "prometric",
    });
  }

  return valid;
}
