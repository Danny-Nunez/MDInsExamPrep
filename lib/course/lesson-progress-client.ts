"use client";

import {
  COURSE_LESSON_WATCHED_EVENT,
  getWatchedLessonIds,
  markLessonWatched,
  STORAGE_KEY,
} from "@/lib/course/lesson-progress";

function applyWatchedLessonIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(COURSE_LESSON_WATCHED_EVENT));
}

export async function fetchAccountCourseProgress(): Promise<string[] | null> {
  const res = await fetch("/api/account/course-progress", {
    credentials: "include",
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as { watchedLessonIds?: string[] };
  return data.watchedLessonIds ?? [];
}

export async function persistLessonWatchedToAccount(
  lessonId: string
): Promise<void> {
  await fetch("/api/account/course-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ lessonId }),
  });
}

export async function markLessonWatchedWithSync(lessonId: string): Promise<void> {
  markLessonWatched(lessonId);
  try {
    await persistLessonWatchedToAccount(lessonId);
  } catch {
    // Offline or logged out — local progress still saved
  }
}

/** Merge local progress into the signed-in account and refresh localStorage. */
export async function syncCourseProgressToAccount(): Promise<string[]> {
  const local = getWatchedLessonIds();
  const res = await fetch("/api/account/course-progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ lessonIds: local }),
  });

  if (!res.ok) return local;

  const data = (await res.json()) as { watchedLessonIds?: string[] };
  const merged = data.watchedLessonIds ?? local;
  applyWatchedLessonIds(merged);
  return merged;
}

/** Load account progress, merge with local, and sync any local-only completions up. */
export async function hydrateCourseProgressFromAccount(): Promise<string[]> {
  const local = getWatchedLessonIds();
  const account = await fetchAccountCourseProgress();
  if (!account) return local;

  const merged = [...new Set([...account, ...local])];
  applyWatchedLessonIds(merged);

  const hasLocalOnly = local.some((id) => !account.includes(id));
  if (hasLocalOnly) {
    return syncCourseProgressToAccount();
  }

  return merged;
}
