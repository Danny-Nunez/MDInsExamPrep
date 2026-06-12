"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { hydrateCourseProgressFromAccount } from "@/lib/course/lesson-progress-client";
import {
  COURSE_LESSON_WATCHED_EVENT,
  getWatchedLessonIds,
} from "@/lib/course/lesson-progress";

export function useWatchedLessonIds(): Set<string> {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const refreshLocal = useCallback(() => {
    setIds(new Set(getWatchedLessonIds()));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const load = async () => {
      if (!user) {
        refreshLocal();
        return;
      }

      const merged = await hydrateCourseProgressFromAccount();
      if (!cancelled) {
        setIds(new Set(merged));
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, refreshLocal]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "md_course_watched_lessons") {
        refreshLocal();
      }
    };

    const onWatched = () => refreshLocal();

    window.addEventListener("storage", onStorage);
    window.addEventListener(COURSE_LESSON_WATCHED_EVENT, onWatched);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(COURSE_LESSON_WATCHED_EVENT, onWatched);
    };
  }, [refreshLocal]);

  return ids;
}

export function useLessonWatched(lessonId: string): boolean {
  const watchedIds = useWatchedLessonIds();
  return watchedIds.has(lessonId);
}
