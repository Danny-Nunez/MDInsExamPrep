/** Normalize blueprint labels (Easy, Moderate, Prometric) to bank filters. */
export function normalizeBlueprintDifficulty(label: string): string {
  const d = label.trim().toLowerCase();
  if (d === "moderate") return "medium";
  return d;
}

export const EXAM_LIKE_DIFFICULTY_LABELS = [
  "prometric",
  "Prometric",
  "hard",
  "Hard",
] as const;
