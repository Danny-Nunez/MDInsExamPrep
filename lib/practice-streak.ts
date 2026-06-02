import type { ExamAttempt } from "@/types/quiz";

/** Local calendar date key (YYYY-MM-DD) in the user's timezone. */
export function practiceDayKey(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + delta);
  return next;
}

/** Consecutive days with at least one completed quiz, counting through today or yesterday. */
export function computePracticeStreak(attempts: ExamAttempt[]): number {
  if (attempts.length === 0) return 0;

  const days = new Set(
    attempts.map((a) => practiceDayKey(a.date)).filter(Boolean)
  );
  if (days.size === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = practiceDayKey(today.toISOString());

  let cursor =
    days.has(todayKey) ? today : addDays(today, -1);

  if (!days.has(practiceDayKey(cursor.toISOString()))) {
    return 0;
  }

  let streak = 0;
  while (days.has(practiceDayKey(cursor.toISOString()))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function shouldShowPracticeStreak(
  streak: number,
  isLoggedIn: boolean
): boolean {
  return isLoggedIn && streak >= 1;
}

const DASHBOARD_WELCOMED_PREFIX = "md_exam_dashboard_welcomed_";

export function dashboardWelcomedStorageKey(userId: string | null): string {
  return `${DASHBOARD_WELCOMED_PREFIX}${userId ?? "guest"}`;
}

function greetingSessionKey(userId: string | null): string {
  return `${dashboardWelcomedStorageKey(userId)}_greeting`;
}

/**
 * Whether to show "Welcome" vs "Welcome back".
 * Uses sessionStorage so React Strict Mode does not flip the greeting mid-visit.
 */
export function resolveDashboardGreeting(userId: string | null): boolean {
  if (typeof window === "undefined") return false;

  const sessionKey = greetingSessionKey(userId);
  const cached = sessionStorage.getItem(sessionKey);
  if (cached === "first") return true;
  if (cached === "returning") return false;

  const storageKey = dashboardWelcomedStorageKey(userId);
  const isFirst = !localStorage.getItem(storageKey);
  sessionStorage.setItem(sessionKey, isFirst ? "first" : "returning");
  if (isFirst) {
    localStorage.setItem(storageKey, "1");
  }
  return isFirst;
}
