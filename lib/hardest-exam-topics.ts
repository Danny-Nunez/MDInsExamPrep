/**
 * Challenging Maryland Life & Health exam topics.
 * Weights from Prometric content outline (Life & Health combo, exam 2030) per
 * industry prep materials mirroring the state outline—not a guarantee of your exam mix.
 */
export type HardTopic = {
  rank: number;
  title: string;
  examWeight?: string;
  whyHard: string;
  studyTip: string;
  subdomains?: string[];
};

export const HARDEST_MARYLAND_TOPICS: HardTopic[] = [
  {
    rank: 1,
    title: "Maryland insurance regulation & producer conduct",
    examWeight: "~30% of Life & Health combo",
    whyHard:
      "The largest section on the combined exam. Candidates underestimate state law—twisting, rebating, replacement, advertising, and MIA authority—because national prep books skim Maryland rules.",
    studyTip:
      "Drill Maryland-specific scenarios separately from general insurance law. Flashcards on unfair trade practices and licensing duties pay off here.",
    subdomains: [
      "Producer licensing",
      "Unfair trade practices",
      "Twisting and rebating",
      "Replacement rules",
    ],
  },
  {
    rank: 2,
    title: "Life policy provisions, options & riders",
    examWeight: "~8% of combo (~10 questions)",
    whyHard:
      "Similar-sounding provisions (free look, grace period, incontestability, suicide clause) and riders that change death benefits trip people up on BEST/EXCEPT wording.",
    studyTip:
      "Build a one-page chart comparing standard provisions and when each applies. Practice EXCEPT questions slowly.",
    subdomains: ["Policy provisions", "Policy riders and options", "Beneficiaries"],
  },
  {
    rank: 3,
    title: "Annuities & settlement options",
    examWeight: "~5% of combo",
    whyHard:
      "Fixed vs indexed vs variable features, surrender charges, annuitization choices, and senior suitability rules blend product knowledge with regulation.",
    studyTip:
      "Learn the decision flow: accumulation phase → surrender → annuitization. Pair with Maryland senior-protection concepts if tested in your outline.",
    subdomains: ["Annuities", "Cash value"],
  },
  {
    rank: 4,
    title: "Federal tax treatment (life, annuities & health)",
    examWeight: "~6% combined (life + health tax sections)",
    whyHard:
      "Modified endowment contracts (MECs), 1035 exchanges, IRA/qualified plan basics, and tax treatment of health premiums confuse test-takers who skip tax chapters.",
    studyTip:
      "Memorize triggers and outcomes, not tax forms: when is a withdrawal taxable? when is a 1035 exchange allowed?",
    subdomains: ["Tax treatment"],
  },
  {
    rank: 5,
    title: "Medical plans & managed care",
    examWeight: "~8% of combo (~10 questions)",
    whyHard:
      "HMO gatekeepers vs PPO networks, deductibles, coinsurance, stop-loss, and prior authorization are easy to mix up under time pressure.",
    studyTip:
      "Draw a simple grid: plan type → who chooses providers → referral rules → typical cost-sharing.",
    subdomains: ["HMO and PPO plans", "Medical expense plans"],
  },
  {
    rank: 6,
    title: "Medicare, Medicaid & senior health products",
    examWeight: "~5–9% (senior/Medicare sections)",
    whyHard:
      "Parts A–D, Medigap vs Medicare Advantage, enrollment periods, and what Medicaid covers vs Medicare appear in scenario questions with close distractors.",
    studyTip:
      "Study one timeline for Medicare enrollment and a second chart for who pays first (Medicare vs Medigap vs Medicaid).",
    subdomains: ["Medicare", "Medicaid", "Long-term care"],
  },
  {
    rank: 7,
    title: "Disability income & ERISA/group health",
    examWeight: "~7% combined (disability + group)",
    whyHard:
      "Own-occupation vs any-occupation, elimination periods, and group certificate vs policy holder rights (COBRA, HIPAA portability) cross multiple chapters.",
    studyTip:
      "Separate individual DI from group health: different documents, different regulators, different continuation rules.",
    subdomains: ["Disability income", "Group health insurance", "COBRA", "HIPAA"],
  },
  {
    rank: 8,
    title: "Qualified plans & retirement basics",
    examWeight: "~2% of combo",
    whyHard:
      "Lower question count but high miss rate—candidates rarely work with 401(k)/IRA rules daily, so ERISA fiduciary basics feel abstract.",
    studyTip:
      "Focus on producer-facing rules: who can contribute, tax-deferred growth, and penalties for early withdrawal—not full plan administration.",
    subdomains: ["Tax treatment"],
  },
  {
    rank: 9,
    title: "Underwriting, replacement & insurable interest",
    examWeight: "Spread across regulation & basics",
    whyHard:
      "Maryland replacement notice rules plus federal insurable interest standards show up in ethics-style scenarios with multiple plausible answers.",
    studyTip:
      "When you see a replacement question, list: notice timing → comparison → who signs → producer duties.",
    subdomains: [
      "Replacement rules",
      "Insurable interest",
      "Underwriting",
    ],
  },
  {
    rank: 10,
    title: "Life insurance types & determining needs",
    examWeight: "~14% combined (basics + policy types)",
    whyHard:
      "Term vs whole vs universal vs variable comparisons and needs-analysis methods (human life value, capitalization) produce long stems with four close products.",
    studyTip:
      "Master one-line definitions first, then practice which product fits a given client fact pattern.",
    subdomains: ["Types of policies", "Premiums"],
  },
];
