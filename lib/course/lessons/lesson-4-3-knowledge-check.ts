import type { CourseKnowledgeCheck } from "@/lib/course/types";

export const LESSON_4_3_KNOWLEDGE_CHECK: CourseKnowledgeCheck = {
  title: "Knowledge Check",
  questions: [
    {
      id: "4.3-kc-1",
      question: "What is the primary tax advantage of an annuity?",
      choices: [
        "Tax-free withdrawals",
        "Tax-free contributions",
        "Tax-deferred growth",
        "Tax-free income",
      ],
      correctAnswer: "Tax-deferred growth",
      explanation:
        "Earnings inside an annuity grow without being taxed each year. Tax-deferred means taxes are paid later — not that contributions or withdrawals are tax-free.",
    },
    {
      id: "4.3-kc-2",
      question:
        "In a nonqualified annuity, what portion is generally taxable when withdrawn?",
      choices: [
        "Principal only",
        "Earnings only",
        "Principal and earnings",
        "None",
      ],
      correctAnswer: "Earnings only",
      explanation:
        "Non-qualified annuities use after-tax dollars, so the principal is not taxed again. Only the earnings portion is generally taxable when withdrawn.",
    },
    {
      id: "4.3-kc-3",
      question: "A qualified annuity is typically funded with:",
      choices: [
        "After-tax dollars",
        "Tax-free dollars",
        "Pre-tax dollars",
        "Corporate funds",
      ],
      correctAnswer: "Pre-tax dollars",
      explanation:
        "Qualified annuities are funded through qualified retirement plans with pre-tax dollars. Both contributions and earnings are generally taxable when withdrawn.",
    },
  ],
};
