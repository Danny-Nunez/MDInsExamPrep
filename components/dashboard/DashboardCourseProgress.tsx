"use client";

import { useEffect, useState } from "react";
import { useWatchedLessonIds } from "@/hooks/useLessonProgress";

type DashboardCourseProgressProps = {
  trackableLessonCount: number;
};

export default function DashboardCourseProgress({
  trackableLessonCount,
}: DashboardCourseProgressProps) {
  const [mounted, setMounted] = useState(false);
  const watchedIds = useWatchedLessonIds();
  const watchedCount = watchedIds.size;
  const percent =
    trackableLessonCount > 0
      ? Math.round((watchedCount / trackableLessonCount) * 100)
      : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mb-6 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-md-black">Free course progress</p>
          <p className="mt-0.5 text-sm text-stone-600">
            Completed lessons sync to your account automatically.
          </p>
        </div>
        <p className="text-sm font-semibold text-md-red">
          {watchedCount} lesson{watchedCount === 1 ? "" : "s"} · {percent}%
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free course progress"
      >
        <div
          className="h-full rounded-full bg-md-red transition-all duration-300"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
