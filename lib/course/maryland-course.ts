import { COURSE_BASE_PATH } from "@/lib/course/constants";
import { LESSON_4_1_TRANSCRIPT } from "@/lib/course/lessons/lesson-4-1";
import { LESSON_4_3_KNOWLEDGE_CHECK } from "@/lib/course/lessons/lesson-4-3-knowledge-check";
import {
  LESSON_4_3_DESCRIPTION,
  LESSON_4_3_TRANSCRIPT,
} from "@/lib/course/lessons/lesson-4-3";
import { LESSON_4_2_KNOWLEDGE_CHECK } from "@/lib/course/lessons/lesson-4-2-knowledge-check";
import {
  LESSON_4_2_DESCRIPTION,
  LESSON_4_2_TRANSCRIPT,
} from "@/lib/course/lessons/lesson-4-2";
import { lessonSlug } from "@/lib/course/slug";
import type {
  CourseKnowledgeCheck,
  CourseLesson,
  CourseModule,
  MarylandCourse,
} from "@/lib/course/types";

export { COURSE_BASE_PATH };

type LessonInput = {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  youtubeId?: string;
  transcript?: string;
  knowledgeCheck?: CourseKnowledgeCheck;
  isQuiz?: boolean;
  estimatedMinutes?: number;
};

function buildLessons(moduleId: string, items: LessonInput[]): CourseLesson[] {
  return items.map((item) => ({
    moduleId,
    id: item.id,
    slug: lessonSlug(item.title),
    title: item.title.replace(/^✅\s*/, "").trim(),
    description: item.description,
    videoUrl: item.videoUrl,
    youtubeId: item.youtubeId,
    transcript: item.transcript,
    knowledgeCheck: item.knowledgeCheck,
    isQuiz: item.isQuiz,
    estimatedMinutes: item.estimatedMinutes ?? (item.isQuiz ? 15 : 9),
    difficulty: "beginner" as const,
  }));
}

type ModuleMeta = {
  note?: string;
  description?: string;
};

function module(
  number: number,
  slug: string,
  title: string,
  lessons: LessonInput[],
  meta?: ModuleMeta
): CourseModule {
  const id = String(number);
  return {
    id,
    number,
    slug,
    title,
    description: meta?.description,
    note: meta?.note,
    lessons: buildLessons(id, lessons),
  };
}

export const MARYLAND_COURSE: MarylandCourse = {
  title: "Maryland Life & Health Insurance Exam Prep",
  subtitle: "Free Maryland Insurance Course",
  description:
    "A structured free course for the Maryland Life, Accident, Health & Sickness Producer exam — 15 modules, 100+ lessons, and practice quizzes aligned to the licensing blueprint.",
  basePath: COURSE_BASE_PATH,
  modules: [
    module(
      1,
      "insurance-fundamentals",
      "Insurance Fundamentals",
      [
        { id: "1.1", title: "Risk Management and Purpose of Insurance" },
        { id: "1.2", title: "Perils, Hazards, Exposure, and Loss" },
        { id: "1.3", title: "Insurable Interest and Indemnity" },
        { id: "1.4", title: "Insurance Contracts and Legal Concepts" },
        { id: "1.5", title: "Law of Large Numbers" },
        { id: "1.6", title: "General Insurance Concepts Review" },
        { id: "1.7", title: "Module Quiz", isQuiz: true },
      ],
      {
        description:
          "Master the building blocks of insurance — risk management, perils and hazards, insurable interest, contract principles, and the law of large numbers.",
      }
    ),
    module(
      2,
      "life-insurance-basics",
      "Life Insurance Basics",
      [
        { id: "2.1", title: "What Is Life Insurance?" },
        { id: "2.2", title: "Term Life Insurance" },
        { id: "2.3", title: "Whole Life Insurance" },
        { id: "2.4", title: "Universal Life Insurance" },
        { id: "2.5", title: "Variable Life Insurance" },
        { id: "2.6", title: "Life Insurance Premiums and Cash Value" },
        { id: "2.7", title: "Life Insurance Basics Review" },
        { id: "2.8", title: "Module Quiz", isQuiz: true },
      ],
      {
        description:
          "Understand term, whole, universal, and variable life products, plus premiums and cash value — core life insurance knowledge for the Maryland exam.",
      }
    ),
    module(
      3,
      "life-insurance-policies",
      "Life Insurance Policies",
      [
        { id: "3.1", title: "Policy Ownership" },
        { id: "3.2", title: "Beneficiaries" },
        { id: "3.3", title: "Policy Provisions" },
        { id: "3.4", title: "Settlement Options" },
        { id: "3.5", title: "Nonforfeiture Options" },
        { id: "3.6", title: "Life Insurance Riders" },
        { id: "3.7", title: "Policy Loans" },
        { id: "3.8", title: "Module Quiz", isQuiz: true },
      ],
      {
        description:
          "Learn policy ownership, beneficiaries, key provisions, settlement and nonforfeiture options, riders, and policy loans.",
      }
    ),
    module(4, "annuities", "Annuities", [
      {
        id: "4.1",
        title: "Annuities Fundamentals",
        youtubeId: "XjoeUy7p-7g",
        transcript: LESSON_4_1_TRANSCRIPT,
        estimatedMinutes: 2,
      },
      {
        id: "4.2",
        title: "Qualified vs Nonqualified Annuities",
        youtubeId: "CCx_h28VjgY",
        description: LESSON_4_2_DESCRIPTION,
        transcript: LESSON_4_2_TRANSCRIPT,
        knowledgeCheck: LESSON_4_2_KNOWLEDGE_CHECK,
        estimatedMinutes: 9,
      },
      {
        id: "4.3",
        title: "Annuity Taxation",
        youtubeId: "yuKpPK3wA1w",
        description: LESSON_4_3_DESCRIPTION,
        transcript: LESSON_4_3_TRANSCRIPT,
        knowledgeCheck: LESSON_4_3_KNOWLEDGE_CHECK,
        estimatedMinutes: 4,
      },
      { id: "4.4", title: "Fixed vs Variable Annuities Deep Dive" },
      { id: "4.5", title: "Immediate vs Deferred Annuities Deep Dive" },
      { id: "4.6", title: "Accumulation vs Annuitization" },
      { id: "4.7", title: "Owner vs Annuitant vs Beneficiary" },
      { id: "4.8", title: "Death Benefits" },
      { id: "4.9", title: "Annuity Suitability Rules" },
      { id: "4.10", title: "Annuity Replacements" },
      { id: "4.11", title: "Annuity Review" },
      { id: "4.12", title: "Module Quiz", isQuiz: true },
    ]),
    module(5, "health-insurance-basics", "Health Insurance Basics", [
      { id: "5.1", title: "Health Insurance Fundamentals" },
      { id: "5.2", title: "Medical Expense Insurance" },
      { id: "5.3", title: "Cost Sharing" },
      { id: "5.4", title: "Deductibles" },
      { id: "5.5", title: "Copayments" },
      { id: "5.6", title: "Coinsurance" },
      { id: "5.7", title: "Out-of-Pocket Maximums" },
      { id: "5.8", title: "Module Quiz", isQuiz: true },
    ]),
    module(
      6,
      "medical-plans",
      "Medical Plans",
      [
        { id: "6.1", title: "HMO Plans" },
        { id: "6.2", title: "PPO Plans" },
        { id: "6.3", title: "POS Plans" },
        { id: "6.4", title: "EPO Plans" },
        { id: "6.5", title: "Managed Care Concepts" },
        { id: "6.6", title: "Provider Networks" },
        { id: "6.7", title: "Medical Plans Review" },
        { id: "6.8", title: "Module Quiz", isQuiz: true },
      ],
      "One of the weakest areas on many Maryland exam score reports."
    ),
    module(7, "disability-income-insurance", "Disability Income Insurance", [
      { id: "7.1", title: "Disability Income Basics" },
      { id: "7.2", title: "Total Disability" },
      { id: "7.3", title: "Partial Disability" },
      { id: "7.4", title: "Residual Disability" },
      { id: "7.5", title: "Own Occupation" },
      { id: "7.6", title: "Any Occupation" },
      { id: "7.7", title: "Disability Riders" },
      { id: "7.8", title: "Module Quiz", isQuiz: true },
    ]),
    module(8, "long-term-care-insurance", "Long-Term Care Insurance", [
      { id: "8.1", title: "Long-Term Care Basics" },
      { id: "8.2", title: "Activities of Daily Living" },
      { id: "8.3", title: "Home Health Care" },
      { id: "8.4", title: "Assisted Living" },
      { id: "8.5", title: "Nursing Facilities" },
      { id: "8.6", title: "LTC Policy Features" },
      { id: "8.7", title: "Module Quiz", isQuiz: true },
    ]),
    module(9, "dental-insurance", "Dental Insurance", [
      { id: "9.1", title: "Dental Insurance Basics" },
      { id: "9.2", title: "Preventive Services" },
      { id: "9.3", title: "Basic Services" },
      { id: "9.4", title: "Major Services" },
      { id: "9.5", title: "Waiting Periods" },
      { id: "9.6", title: "Module Quiz", isQuiz: true },
    ]),
    module(10, "group-health-insurance", "Group Health Insurance", [
      { id: "10.1", title: "Group Health Basics" },
      { id: "10.2", title: "Employer Plans" },
      { id: "10.3", title: "COBRA" },
      { id: "10.4", title: "HIPAA" },
      { id: "10.5", title: "ERISA" },
      { id: "10.6", title: "Continuation Coverage" },
      { id: "10.7", title: "Module Quiz", isQuiz: true },
    ]),
    module(
      11,
      "senior-citizens-special-needs",
      "Insurance for Senior Citizens & Special Needs",
      [
        { id: "11.1", title: "Medicare Overview" },
        { id: "11.2", title: "Medicare Part A" },
        { id: "11.3", title: "Medicare Part B" },
        { id: "11.4", title: "Medicare Part C" },
        { id: "11.5", title: "Medicare Part D" },
        { id: "11.6", title: "Medigap Plans" },
        { id: "11.7", title: "Medicaid Basics" },
        { id: "11.8", title: "Senior Products Review" },
        { id: "11.9", title: "Module Quiz", isQuiz: true },
      ]
    ),
    module(
      12,
      "qualified-plans",
      "Qualified Plans",
      [
        { id: "12.1", title: "Qualified Plans Overview" },
        { id: "12.2", title: "Traditional IRA" },
        { id: "12.3", title: "Roth IRA" },
        { id: "12.4", title: "401(k)" },
        { id: "12.5", title: "SEP IRA" },
        { id: "12.6", title: "SIMPLE IRA" },
        { id: "12.7", title: "Retirement Plan Taxation" },
        { id: "12.8", title: "Early Withdrawal Rules" },
        { id: "12.9", title: "Module Quiz", isQuiz: true },
      ],
      "A common low-scoring area on Maryland Life & Health practice reports."
    ),
    module(13, "federal-tax-considerations", "Federal Tax Considerations", [
      { id: "13.1", title: "Life Insurance Taxation" },
      { id: "13.2", title: "Annuity Taxation" },
      { id: "13.3", title: "Health Insurance Taxation" },
      { id: "13.4", title: "Retirement Plan Taxation" },
      { id: "13.5", title: "Tax Review" },
      { id: "13.6", title: "Module Quiz", isQuiz: true },
    ]),
    module(14, "maryland-insurance-regulations", "Maryland Insurance Regulations", [
      { id: "14.1", title: "Maryland Insurance Administration" },
      { id: "14.2", title: "Licensing Requirements" },
      { id: "14.3", title: "Producer Responsibilities" },
      { id: "14.4", title: "Fiduciary Duties" },
      { id: "14.5", title: "Ethics" },
      { id: "14.6", title: "Unfair Trade Practices" },
      { id: "14.7", title: "Rebating" },
      { id: "14.8", title: "Twisting" },
      { id: "14.9", title: "Misrepresentation" },
      { id: "14.10", title: "Module Quiz", isQuiz: true },
    ]),
    module(15, "final-exam-preparation", "Final Exam Preparation", [
      { id: "15.1", title: "How the Maryland Exam Works" },
      { id: "15.2", title: "Common Exam Traps" },
      { id: "15.3", title: "Test Taking Strategies" },
      { id: "15.4", title: "Exam Day Checklist" },
      { id: "15.5", title: "Full Practice Exam #1", isQuiz: true },
      { id: "15.6", title: "Full Practice Exam #2", isQuiz: true },
      { id: "15.7", title: "Full Practice Exam #3", isQuiz: true },
    ]),
  ],
};
