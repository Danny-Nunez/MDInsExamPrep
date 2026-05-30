/** Shared instructions for exam-realistic item writing (Prometric / PSI style). */
export const PROMETRIC_STYLE_RULES = `
Prometric-style exam rules (Maryland Life & Health Producer):
- Scenario-based stems: named people, employers, policy details, dollar amounts, dates (avoid "What is the definition of…?")
- At least 70% of items must use BEST, MOST appropriate, MOST likely, or PRIMARILY in the stem
- Four closely plausible distractors; one clearly best answer under Maryland law and exam conventions
- Test application and judgment, not recall of a single fact
- Maryland Insurance Administration rules when the topic is state-specific
- Do NOT copy real exam questions or third-party prep materials
`.trim();

export function difficultyWritingGuide(blueprintDifficulty: string): string {
  const d = blueprintDifficulty.trim().toLowerCase();
  if (d === "prometric") {
    return `Difficulty target: PROMETRIC / actual exam level — maximum rigor. Multi-step reasoning, exceptions, and near-miss distractors.`;
  }
  if (d === "hard") {
    return `Difficulty target: HARD — exam-level; use nested scenarios and exception cases.`;
  }
  if (d === "moderate" || d === "medium") {
    return `Difficulty target: MODERATE — still scenario-based, but one clear decision point (not definition recall).`;
  }
  return `Difficulty target: FOUNDATIONAL — short scenario, one concept, but still four plausible choices (not trivia).`;
}
