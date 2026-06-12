export const STORAGE_KEY = "md_course_watched_lessons";

export const COURSE_LESSON_WATCHED_EVENT = "course-lesson-watched";

export function getWatchedLessonIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function isLessonWatched(lessonId: string): boolean {
  return getWatchedLessonIds().includes(lessonId);
}

export function markLessonWatched(lessonId: string): void {
  if (typeof window === "undefined") return;
  const ids = getWatchedLessonIds();
  if (ids.includes(lessonId)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, lessonId]));
  window.dispatchEvent(
    new CustomEvent(COURSE_LESSON_WATCHED_EVENT, { detail: lessonId })
  );
}
