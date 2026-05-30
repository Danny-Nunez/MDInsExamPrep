/**
 * Prometric Life & Health combo (exam 2030) content outline weights.
 * 130 scored questions, 150 minutes, 70% to pass — per published outline summaries.
 */
export type OutlineSection = {
  section: string;
  questions: number;
  percent: number;
  category: "regulation" | "life" | "health" | "general";
};

export const LIFE_HEALTH_COMBO_OUTLINE: OutlineSection[] = [
  { section: "Insurance Regulation", questions: 39, percent: 30, category: "regulation" },
  { section: "General Insurance", questions: 7, percent: 5, category: "general" },
  { section: "Life Insurance Basics", questions: 12, percent: 9, category: "life" },
  { section: "Life Insurance Policies", questions: 7, percent: 5, category: "life" },
  {
    section: "Life Policy Provisions, Options & Riders",
    questions: 10,
    percent: 8,
    category: "life",
  },
  { section: "Annuities", questions: 6, percent: 5, category: "life" },
  {
    section: "Federal Tax (Life & Annuities)",
    questions: 5,
    percent: 4,
    category: "life",
  },
  { section: "Qualified Plans", questions: 2, percent: 2, category: "life" },
  { section: "Health Insurance Basics", questions: 9, percent: 7, category: "health" },
  {
    section: "Individual Health Policy Provisions",
    questions: 3,
    percent: 2,
    category: "health",
  },
  { section: "Disability Income & Related", questions: 6, percent: 5, category: "health" },
  { section: "Medical Plans", questions: 10, percent: 8, category: "health" },
  { section: "Group Health Insurance", questions: 3, percent: 2, category: "health" },
  { section: "Dental Insurance", questions: 1, percent: 1, category: "health" },
  {
    section: "Senior Citizens & Special Needs",
    questions: 7,
    percent: 5,
    category: "health",
  },
  { section: "Federal Tax (Health)", questions: 3, percent: 2, category: "health" },
];

export const COMBO_EXAM_STATS = {
  code: "2030",
  name: "Life and Accident and Health or Sickness Producer",
  scoredQuestions: 130,
  timeMinutes: 150,
  passingPercent: 70,
  passingCorrect: 91,
};
