import { PASS_THRESHOLD } from "@/types/quiz";
import type { CategoryPerformance, ExamAttempt } from "@/types/quiz";

/** Minimum completed quizzes before exam readiness is calculated */
export const READINESS_MIN_QUIZZES = 3;

export type ExamReadinessResult =
  | { unlocked: true; percentage: number }
  | {
      unlocked: false;
      quizzesCompleted: number;
      quizzesRequired: number;
      /** Running average shown on the grade meter before unlock */
      previewPercentage: number;
    };

export function getReadinessLabel(percentage: number): string {
  if (percentage >= PASS_THRESHOLD) return "Good";
  if (percentage >= 60) return "Fair";
  return "Needs work";
}

export function computeCorrectAnswerRate(
  performance: CategoryPerformance[]
): number {
  const correct = performance.reduce((sum, row) => sum + row.correct, 0);
  const total = performance.reduce((sum, row) => sum + row.total, 0);
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function computeAverageScore(attempts: ExamAttempt[]): number {
  if (attempts.length === 0) return 0;
  const sum = attempts.reduce((acc, attempt) => acc + attempt.percentage, 0);
  return Math.round(sum / attempts.length);
}

export function getExamReadiness(attempts: ExamAttempt[]): ExamReadinessResult {
  const previewPercentage = computeAverageScore(attempts);
  if (attempts.length < READINESS_MIN_QUIZZES) {
    return {
      unlocked: false,
      quizzesCompleted: attempts.length,
      quizzesRequired: READINESS_MIN_QUIZZES,
      previewPercentage,
    };
  }
  return {
    unlocked: true,
    percentage: previewPercentage,
  };
}

function parseAttemptDate(date: string): Date {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function attemptsBetween(
  attempts: ExamAttempt[],
  start: Date,
  end: Date
): ExamAttempt[] {
  return attempts.filter((attempt) => {
    const d = parseAttemptDate(attempt.date);
    return d >= start && d <= end;
  });
}

function formatTrendDelta(delta: number, suffix: string): string {
  if (delta > 0) return `+${delta}${suffix}`;
  if (delta < 0) return `${delta}${suffix}`;
  return `0${suffix}`;
}

/** Compare metric for the last 7 days vs the prior 7 days */
export function weekOverWeekTrend(
  attempts: ExamAttempt[],
  getValue: (subset: ExamAttempt[]) => number | null
): { delta: number; label: string } | null {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recent = attemptsBetween(attempts, weekAgo, now);
  const prior = attemptsBetween(attempts, twoWeeksAgo, weekAgo);

  const recentVal = getValue(recent);
  const priorVal = getValue(prior);

  if (recentVal === null || priorVal === null) return null;

  return {
    delta: recentVal - priorVal,
    label: "from last week",
  };
}

export function readinessTrendText(
  attempts: ExamAttempt[],
  readiness: ExamReadinessResult
): { text: string; positive: boolean } {
  if (!readiness.unlocked) {
    if (attempts.length >= 2) {
      const delta = attempts[0].percentage - attempts[1].percentage;
      return {
        text: `${formatTrendDelta(delta, "%")} from last exam`,
        positive: delta >= 0,
      };
    }
    if (attempts.length === 1) {
      return { text: "Score preview", positive: true };
    }
    return { text: "Take a quiz to preview", positive: true };
  }

  const weekly = weekOverWeekTrend(attempts, (subset) =>
    subset.length >= READINESS_MIN_QUIZZES
      ? computeAverageScore(subset)
      : null
  );
  if (weekly) {
    return {
      text: `${formatTrendDelta(weekly.delta, "%")} ${weekly.label}`,
      positive: weekly.delta >= 0,
    };
  }

  const previous = attempts[1];
  const latest = attempts[0];
  if (latest && previous) {
    const delta = latest.percentage - previous.percentage;
    return {
      text: `${formatTrendDelta(delta, "%")} from last exam`,
      positive: delta >= 0,
    };
  }

  return {
    text: `${readiness.percentage}% exam readiness`,
    positive: readiness.percentage >= PASS_THRESHOLD,
  };
}

export function correctRateTrendText(
  attempts: ExamAttempt[],
  performance: CategoryPerformance[]
): { text: string; positive: boolean } | null {
  const weekly = weekOverWeekTrend(attempts, (subset) =>
    subset.length > 0 ? computeAverageScore(subset) : null
  );
  if (weekly) {
    return {
      text: formatTrendDelta(weekly.delta, "%"),
      positive: weekly.delta >= 0,
    };
  }

  if (attempts.length >= 2) {
    const delta = attempts[0].percentage - attempts[1].percentage;
    return {
      text: formatTrendDelta(delta, "%"),
      positive: delta >= 0,
    };
  }

  const total = performance.reduce((sum, row) => sum + row.total, 0);
  if (total === 0) return null;

  return { text: "Across all topics", positive: true };
}

export function quizzesTakenCardContent(
  attempts: ExamAttempt[],
  readiness: ExamReadinessResult
): {
  value: string;
  subtitle?: string;
  trend?: string | null;
  trendPositive?: boolean;
} {
  if (!readiness.unlocked) {
    const remaining =
      readiness.quizzesRequired - readiness.quizzesCompleted;
    return {
      value: String(readiness.quizzesCompleted),
      subtitle: `${readiness.quizzesCompleted}/${readiness.quizzesRequired} quizzes to unlock readiness`,
      trend:
        remaining <= 0
          ? null
          : remaining === 1
            ? "1 more quiz to unlock"
            : `${remaining} more quizzes to unlock`,
      trendPositive: true,
    };
  }

  const trend = quizzesTakenTrendText(attempts);
  return {
    value: String(attempts.length),
    trend: trend?.text ?? null,
    trendPositive: trend?.positive ?? true,
  };
}

export function quizzesTakenTrendText(
  attempts: ExamAttempt[]
): { text: string; positive: boolean } | null {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recentCount = attemptsBetween(attempts, weekAgo, now).length;
  const priorCount = attemptsBetween(attempts, twoWeeksAgo, weekAgo).length;

  if (recentCount > 0 || priorCount > 0) {
    const delta = recentCount - priorCount;
    return {
      text: formatTrendDelta(delta, ""),
      positive: delta >= 0,
    };
  }

  if (attempts.length > 0) {
    return { text: "Keep practicing", positive: true };
  }

  return null;
}

export function averageScoreTrendText(
  attempts: ExamAttempt[]
): { text: string; positive: boolean } | null {
  const weekly = weekOverWeekTrend(attempts, (subset) =>
    subset.length > 0 ? computeAverageScore(subset) : null
  );
  if (weekly) {
    return {
      text: formatTrendDelta(weekly.delta, "%"),
      positive: weekly.delta >= 0,
    };
  }

  if (attempts.length >= 2) {
    const delta = attempts[0].percentage - attempts[1].percentage;
    return {
      text: formatTrendDelta(delta, "%"),
      positive: delta >= 0,
    };
  }

  return null;
}
