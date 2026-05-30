/** Static filter options from blueprint v4 (stable across paginated pages). */
export const CONCEPT_FILTER_DOMAINS = [
  "Insurance Regulation",
  "General Insurance",
  "Life Insurance",
  "Annuities",
  "Accident and Health Insurance",
  "Disability Income",
  "Long-Term Care",
  "Medicare and Medicaid",
  "Federal Regulations",
] as const;

export const CONCEPT_FILTER_DIFFICULTIES = [
  "Easy",
  "Moderate",
  "Hard",
  "Prometric",
] as const;

export const CONCEPT_FILTER_EXAM_WEIGHTS = ["High", "Medium"] as const;

export const CONCEPT_FILTER_STATUSES = ["ready_for_generation"] as const;
