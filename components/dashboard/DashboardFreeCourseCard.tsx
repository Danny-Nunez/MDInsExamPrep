"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { DASHBOARD_COURSE_BASE_PATH } from "@/lib/course/constants";
import { useWatchedLessonIds } from "@/hooks/useLessonProgress";

type CourseStats = {
  modules: number;
  lessons: number;
  quizzes: number;
};

export default function DashboardFreeCourseCard() {
  const watchedIds = useWatchedLessonIds();
  const watchedCount = watchedIds.size;
  const [stats, setStats] = useState<CourseStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/course/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CourseStats | null) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLessons = stats?.lessons ?? 0;
  const percent =
    totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;

  return (
    <div className="mb-6 rounded-xl border border-md-gold/40 bg-gradient-to-br from-md-gold-light via-white to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <GraduationCap
              className="h-5 w-5 shrink-0 text-md-red"
              aria-hidden
            />
            <h2 className="font-semibold text-md-black">
              Free Maryland Insurance Course
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {stats
              ? `${stats.modules} modules · ${stats.lessons}+ video lessons — included with your account, no extra subscription.`
              : "Video lessons and knowledge checks — included with your account, no extra subscription."}
          </p>

          {totalLessons > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-stone-700">Course progress</span>
                <span className="text-stone-500">
                  {watchedCount} of {totalLessons} lessons · {percent}%
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200"
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
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:min-w-[11rem]">
          <Link
            href={DASHBOARD_COURSE_BASE_PATH}
            className="btn-primary px-5 py-2.5 text-center text-sm"
          >
            {watchedCount > 0 ? "Continue course" : "Open free course"}
          </Link>
          {watchedCount === 0 && (
            <Link
              href={`${DASHBOARD_COURSE_BASE_PATH}/annuities/qualified-vs-nonqualified-annuities`}
              className="btn-secondary px-5 py-2.5 text-center text-sm"
            >
              Start Module 4
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
