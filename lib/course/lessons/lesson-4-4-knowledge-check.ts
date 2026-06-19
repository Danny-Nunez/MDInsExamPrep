import type { CourseKnowledgeCheck } from "@/lib/course/types";

export const LESSON_4_4_KNOWLEDGE_CHECK: CourseKnowledgeCheck = {
  title: "Knowledge Check",
  questions: [
    {
      id: "4.4-kc-1",
      question: "Which annuity guarantees interest?",
      choices: ["Fixed", "Variable", "Indexed", "Separate"],
      correctAnswer: "Fixed",
      explanation:
        "A fixed annuity provides a guaranteed rate of return established by the insurance company. The insurer assumes the investment risk.",
    },
    {
      id: "4.4-kc-2",
      question: "Who assumes investment risk in a variable annuity?",
      choices: [
        "Insurance company",
        "Government",
        "Annuity owner",
        "Beneficiary",
      ],
      correctAnswer: "Annuity owner",
      explanation:
        "Variable annuity returns are not guaranteed and fluctuate with market performance, so the annuity owner — not the insurer — assumes the investment risk.",
    },
    {
      id: "4.4-kc-3",
      question: "Variable annuities are invested through:",
      choices: [
        "Savings accounts",
        "Separate accounts",
        "CDs",
        "Checking accounts",
      ],
      correctAnswer: "Separate accounts",
      explanation:
        "Variable annuities invest in separate accounts similar to mutual funds. These accounts may hold stocks, bonds, or other securities.",
    },
  ],
};
