/**
 * Maryland insurance licensing fees (Prometric + MIA).
 * Source: Prometric MD Insurance FAQ (2023) and MIA Producer Initial page.
 * Always verify at checkout — amounts can change.
 */
export const MARYLAND_EXAM_FEE = 62;
export const MIA_INITIAL_LICENSE_FEE = 54;
export const MIA_RENEWAL_FEE_TOTAL = 69; // MIA lists $69 renewal (includes $54 renewal + fees)

export type ExamFeeRow = {
  code: string;
  name: string;
  fee: number;
  /** Highlight for Life & Health producer prep audience */
  highlight?: boolean;
};

/** All Maryland producer exams — $62 each per Prometric */
export const PROMETRIC_EXAM_FEES: ExamFeeRow[] = [
  { code: "2030", name: "Life & Accident and Health or Sickness (combo)", fee: 62, highlight: true },
  { code: "2027", name: "Life Producer", fee: 62, highlight: true },
  { code: "2024", name: "Accident and Health or Sickness Producer", fee: 62, highlight: true },
  { code: "2028", name: "Adviser Life and Accident and Health or Sickness", fee: 62 },
  { code: "2026", name: "Casualty Producer", fee: 62 },
  { code: "2031", name: "Property Producer", fee: 62 },
  { code: "2032", name: "Property and Casualty (combo)", fee: 62 },
  { code: "2029", name: "Personal Lines", fee: 62 },
  { code: "2025", name: "Title Producer", fee: 62 },
  { code: "2023", name: "Public Adjuster", fee: 62 },
  { code: "2033", name: "Adviser Property and Casualty", fee: 62 },
];

export const LICENSING_FEE_ROWS = [
  {
    item: "Prometric exam (per attempt)",
    amount: MARYLAND_EXAM_FEE,
    note: "Non-refundable once paid; retakes require a new $62 registration.",
  },
  {
    item: "MIA initial producer license application",
    amount: MIA_INITIAL_LICENSE_FEE,
    note: "Paid via NIPR when you apply after passing the exam.",
  },
  {
    item: "State pre-licensing course (required)",
    amount: 0,
    note: "Not required since Oct. 1, 2024—optional commercial prep only.",
  },
] as const;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** One exam pass + one license application */
export function minimumLicensingCost(attempts = 1): number {
  return MARYLAND_EXAM_FEE * attempts + MIA_INITIAL_LICENSE_FEE;
}
