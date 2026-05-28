import type {
  DomainScore,
  ExamAnswer,
  ExamAttempt,
  QuizQuestion,
} from "@/types/quiz";

export function calculateDomainScores(
  answers: ExamAnswer[]
): DomainScore[] {
  const map = new Map<
    string,
    { correct: number; total: number; subdomain?: string }
  >();

  for (const answer of answers) {
    const key = answer.subdomain
      ? `${answer.domain}::${answer.subdomain}`
      : answer.domain;
    const entry = map.get(key) ?? {
      correct: 0,
      total: 0,
      subdomain: answer.subdomain,
    };
    map.set(key, {
      subdomain: answer.subdomain,
      correct: entry.correct + (answer.isCorrect ? 1 : 0),
      total: entry.total + 1,
    });
  }

  return Array.from(map.entries()).map(([key, { correct, total, subdomain }]) => {
    const domain = key.includes("::") ? key.split("::")[0]! : key;
    return {
      domain,
      subdomain,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });
}

export function buildExamAttempt(
  questions: QuizQuestion[],
  selectedAnswers: Record<string, string>,
  meta?: Pick<ExamAttempt, "mode" | "timeSpentSeconds">
): ExamAttempt {
  const answers: ExamAnswer[] = questions.map((q) => {
    const selectedAnswer = selectedAnswers[q.id] ?? "";
    const isCorrect = selectedAnswer === q.correctAnswer;
    return {
      questionId: q.id,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      domain: q.domain,
      subdomain: q.subdomain,
    };
  });

  const score = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return {
    id: `exam-${Date.now()}`,
    date: new Date().toISOString(),
    score,
    totalQuestions,
    percentage,
    answers,
    domainScores: calculateDomainScores(answers),
    ...meta,
  };
}
