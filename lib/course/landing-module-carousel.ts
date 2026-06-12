import { COURSE_BASE_PATH } from "@/lib/course/constants";

/** Client-safe carousel data — do not import maryland-course here. */
export type LandingModuleCarouselItem = {
  moduleNumber: number;
  title: string;
  description: string;
  lessonCount: number;
  imageSrc: string;
  href: string;
};

export const LANDING_MODULE_CAROUSEL_ITEMS: LandingModuleCarouselItem[] = [
  {
    moduleNumber: 1,
    title: "Insurance Fundamentals",
    description:
      "Master the building blocks of insurance — risk management, perils and hazards, insurable interest, contract principles, and the law of large numbers.",
    lessonCount: 6,
    imageSrc: "/module1.png",
    href: `${COURSE_BASE_PATH}/insurance-fundamentals`,
  },
  {
    moduleNumber: 2,
    title: "Life Insurance Basics",
    description:
      "Understand term, whole, universal, and variable life products, plus premiums and cash value — core life insurance knowledge for the Maryland exam.",
    lessonCount: 7,
    imageSrc: "/module2.png",
    href: `${COURSE_BASE_PATH}/life-insurance-basics`,
  },
  {
    moduleNumber: 3,
    title: "Life Insurance Policies",
    description:
      "Learn policy ownership, beneficiaries, key provisions, settlement and nonforfeiture options, riders, and policy loans.",
    lessonCount: 7,
    imageSrc: "/module3.png",
    href: `${COURSE_BASE_PATH}/life-insurance-policies`,
  },
  {
    moduleNumber: 4,
    title: "Annuities",
    description:
      "Learn annuity fundamentals, qualified vs non-qualified taxation, fixed and variable products, and accumulation vs annuitization — heavily tested on the Maryland exam.",
    lessonCount: 11,
    imageSrc: "/module4.png",
    href: `${COURSE_BASE_PATH}/annuities`,
  },
  {
    moduleNumber: 5,
    title: "Health Insurance Basics",
    description:
      "Cover health insurance fundamentals, medical expense coverage, deductibles, copayments, coinsurance, and out-of-pocket maximums.",
    lessonCount: 7,
    imageSrc: "/module5.png",
    href: `${COURSE_BASE_PATH}/health-insurance-basics`,
  },
  {
    moduleNumber: 6,
    title: "Medical Plans",
    description:
      "Study HMO, PPO, POS, and EPO plans, managed care concepts, and provider networks — a common weak area on score reports.",
    lessonCount: 7,
    imageSrc: "/module6.png",
    href: `${COURSE_BASE_PATH}/medical-plans`,
  },
  {
    moduleNumber: 7,
    title: "Disability Income Insurance",
    description:
      "Understand total, partial, and residual disability, own vs any occupation definitions, and key disability income riders.",
    lessonCount: 7,
    imageSrc: "/module7.png",
    href: `${COURSE_BASE_PATH}/disability-income-insurance`,
  },
  {
    moduleNumber: 8,
    title: "Long-Term Care Insurance",
    description:
      "Learn LTC basics, activities of daily living, home health and facility care, and essential long-term care policy features.",
    lessonCount: 6,
    imageSrc: "/module8.png",
    href: `${COURSE_BASE_PATH}/long-term-care-insurance`,
  },
  {
    moduleNumber: 9,
    title: "Dental Insurance",
    description:
      "Learn dental plan basics, preventive and major services, coverage tiers, and waiting periods tested on the Maryland exam.",
    lessonCount: 5,
    imageSrc: "/module9.png",
    href: `${COURSE_BASE_PATH}/dental-insurance`,
  },
  {
    moduleNumber: 10,
    title: "Group Health Insurance",
    description:
      "Study employer group health plans, COBRA continuation, HIPAA portability, ERISA, and group coverage rules.",
    lessonCount: 6,
    imageSrc: "/module10.png",
    href: `${COURSE_BASE_PATH}/group-health-insurance`,
  },
  {
    moduleNumber: 11,
    title: "Insurance for Senior Citizens & Special Needs",
    description:
      "Cover Medicare Parts A–D, Medigap supplements, Medicaid basics, and senior market products — essential for the Life & Health exam.",
    lessonCount: 8,
    imageSrc: "/module11.png",
    href: `${COURSE_BASE_PATH}/senior-citizens-special-needs`,
  },
  {
    moduleNumber: 12,
    title: "Qualified Plans",
    description:
      "Understand traditional and Roth IRAs, 401(k), SEP and SIMPLE plans, retirement taxation, and early withdrawal penalties.",
    lessonCount: 8,
    imageSrc: "/module12.png",
    href: `${COURSE_BASE_PATH}/qualified-plans`,
  },
  {
    moduleNumber: 13,
    title: "Federal Tax Considerations",
    description:
      "Review taxation of life insurance, annuities, health plans, and retirement accounts — a cross-cutting topic on the Maryland exam.",
    lessonCount: 5,
    imageSrc: "/module13.png",
    href: `${COURSE_BASE_PATH}/federal-tax-considerations`,
  },
  {
    moduleNumber: 14,
    title: "Maryland Insurance Regulations",
    description:
      "Learn Maryland licensing rules, producer duties, ethics, and unfair trade practices including rebating, twisting, and misrepresentation.",
    lessonCount: 9,
    imageSrc: "/module14.png",
    href: `${COURSE_BASE_PATH}/maryland-insurance-regulations`,
  },
  {
    moduleNumber: 15,
    title: "Final Exam Preparation",
    description:
      "Get exam-day ready with Maryland test format, common traps, study strategies, and a practical checklist before you sit for Prometric.",
    lessonCount: 4,
    imageSrc: "/module15.png",
    href: `${COURSE_BASE_PATH}/final-exam-preparation`,
  },
];
