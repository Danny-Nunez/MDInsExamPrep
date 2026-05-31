/** ESM copy for CLI scripts — keep in sync with lib/question-quality-checklist.ts */

const EXAM_STEM_RE =
  /\b(best|most appropriate|most likely|primarily|least likely|not\s+(?:an\s+)?(?:example|true)|except|unless)\b/i;

const DEFINITION_STEM_RE =
  /^what is (?:the )?(?:definition|meaning)/i;

const TRIVIAL_STEM_RE = /^which of the following (?:is|are) (?:true|correct)\b/i;

const BAD_CHOICE_RE = /\b(all of the above|none of the above)\b/i;
const LETTER_ONLY_CHOICE = /^[a-d]$/i;

function isPlaceholderLetterChoices(choices) {
  return (
    choices.length === 4 &&
    choices.every((c) => LETTER_ONLY_CHOICE.test(c.trim()))
  );
}

function normalizeChoicesField(raw) {
  if (Array.isArray(raw)) {
    const choices = raw.map((c) => String(c).trim()).filter(Boolean);
    return choices.length === 4 ? choices : null;
  }
  if (raw && typeof raw === "object") {
    const choices = ["a", "b", "c", "d"].map((k) => {
      const v = raw[k] ?? raw[k.toUpperCase()];
      return typeof v === "string" ? v.trim() : "";
    });
    if (choices.every((c) => c.length > 0)) return choices;
  }
  return null;
}

function resolveCorrectAnswer(correctAnswer, choices) {
  const trimmed = correctAnswer.trim();
  if (choices.includes(trimmed)) return trimmed;
  if (LETTER_ONLY_CHOICE.test(trimmed)) {
    const idx = trimmed.toLowerCase().charCodeAt(0) - 97;
    if (idx >= 0 && idx < choices.length) return choices[idx];
  }
  return null;
}

function normalizeGeneratedQuestion(item) {
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

export function normalizeDifficultyLabel(label) {
  if (!label) return "";
  const d = String(label).trim().toLowerCase();
  if (d === "moderate") return "medium";
  return d;
}

export function evaluateQuestionQuality(q) {
  const failures = [];
  const stem = (q.question ?? "").trim();
  const choices = (q.choices ?? []).map((c) => String(c).trim());
  const explanation = String(q.explanation ?? "").trim();
  const difficulty = normalizeDifficultyLabel(q.difficulty);

  if (difficulty !== "prometric") failures.push("difficulty_not_prometric");
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
  if (isPlaceholderLetterChoices(choices)) {
    failures.push("choices_placeholder_letters");
  }
  if (choices.some((c) => c.length < 8)) failures.push("choice_too_short");
  if (choices.some((c) => BAD_CHOICE_RE.test(c))) failures.push("weak_choice_pattern");
  if (!choices.includes((q.correctAnswer ?? "").trim())) {
    failures.push("correct_answer_not_in_choices");
  }
  if (explanation.length < 40) failures.push("explanation_too_short");

  const pass = failures.length === 0;
  const score = pass ? 100 : Math.max(0, 100 - failures.length * 12);
  return { pass, score, failures };
}

export function parseGeneratedQuestions(content) {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonStr);
  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid response shape: missing questions array");
  }

  const valid = [];
  for (const item of parsed.questions) {
    if (!item || typeof item !== "object") continue;
    const normalized = normalizeGeneratedQuestion(item);
    if (normalized) valid.push(normalized);
  }
  return valid;
}
