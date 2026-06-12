import type { CourseKnowledgeCheck } from "@/lib/course/types";

export const LESSON_4_2_KNOWLEDGE_CHECK: CourseKnowledgeCheck = {
  title: "Knowledge Check",
  questions: [
    {
      id: "4.2-kc-1",
      question: "A qualified annuity is typically funded with:",
      choices: [
        "After-tax dollars",
        "Pre-tax dollars",
        "Tax-free dollars",
        "Corporate funds",
      ],
      correctAnswer: "Pre-tax dollars",
      explanation:
        "Qualified annuities are funded through qualified retirement plans using pre-tax dollars — for example, a traditional IRA or 401(k). Taxes are generally paid when money is withdrawn.",
    },
    {
      id: "4.2-kc-2",
      question: "What is the primary tax advantage of an annuity?",
      choices: [
        "Tax-free contributions",
        "Tax-free withdrawals",
        "Tax-deferred growth",
        "Tax-free income",
      ],
      correctAnswer: "Tax-deferred growth",
      explanation:
        "Earnings inside an annuity grow without being taxed each year. Taxes are generally postponed until withdrawal — grow now, pay taxes later.",
    },
    {
      id: "4.2-kc-3",
      question: "Which type of annuity is funded with after-tax dollars?",
      choices: ["Qualified", "Traditional IRA", "Nonqualified", "401(k)"],
      correctAnswer: "Nonqualified",
      explanation:
        "Nonqualified annuities use money that has already been taxed. Only the earnings portion is generally taxable when withdrawn.",
    },
  ],
};
