"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import { useWatchedLessonIds } from "@/hooks/useLessonProgress";

const courseReturn = encodeURIComponent(COURSE_BASE_PATH);

type CourseProgressBannerProps = {
  trackableLessonCount: number;
};

export default function CourseProgressBanner({
  trackableLessonCount,
}: CourseProgressBannerProps) {
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();
  const watchedIds = useWatchedLessonIds();
  const watchedCount = watchedIds.size;
  const percent =
    trackableLessonCount > 0
      ? Math.round((watchedCount / trackableLessonCount) * 100)
      : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return null;

  if (!user) {
    return (
      <div className="mb-8 rounded-xl border border-md-red/20 bg-md-red-light px-5 py-4 sm:px-6">
        <p className="font-semibold text-md-black">
          Save your course progress — free account, no subscription
        </p>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">
          Create a free account to track completed lessons across devices.
          Subscription is only required for practice exams and the full app —
          not for the free course.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/register?next=${courseReturn}`}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Create free account
          </Link>
          <Link
            href={`/login?next=${courseReturn}`}
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-green-200 bg-green-50/80 px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-green-50 text-xs font-bold text-green-700"
            aria-hidden
          >
            ✓
          </span>
          <div>
            <p className="font-semibold text-md-black">
              Progress saved to your account
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Signed in as {user.email}. Your completed lessons sync automatically
              — no subscription needed for course progress.
            </p>
          </div>
        </div>
        {watchedCount > 0 && (
          <p className="text-sm font-semibold text-green-800">
            {watchedCount} lesson{watchedCount === 1 ? "" : "s"} · {percent}%
          </p>
        )}
      </div>
    </div>
  );
}
