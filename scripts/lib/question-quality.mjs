/** ESM copy for CLI scripts — keep in sync with lib/question-quality-checklist.ts */

const EXAM_STEM_RE =
  /\b(best|most appropriate|most likely|primarily|least likely|not\s+(?:an\s+)?(?:example|true)|except|unless)\b/i;

const DEFINITION_STEM_RE =
  /^what is (?:the )?(?:definition|meaning)/i;

const TRIVIAL_STEM_RE = /^which of the following (?:is|are) (?:true|correct)\b/i;

const BAD_CHOICE_RE = /\b(all of the above|none of the above)\b/i;

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
    if (typeof item.question !== "string" || !item.question.trim()) continue;
    if (
      !Array.isArray(item.choices) ||
      item.choices.length !== 4 ||
      !item.choices.every((c) => typeof c === "string" && c.trim())
    ) {
      continue;
    }
    if (
      typeof item.correctAnswer !== "string" ||
      !item.choices.includes(item.correctAnswer)
    ) {
      continue;
    }
    if (typeof item.explanation !== "string" || !item.explanation.trim()) {
      continue;
    }
    valid.push({
      question: item.question.trim(),
      choices: item.choices.map((c) => c.trim()),
      correctAnswer: item.correctAnswer.trim(),
      explanation: item.explanation.trim(),
      difficulty: "prometric",
    });
  }
  return valid;
}
