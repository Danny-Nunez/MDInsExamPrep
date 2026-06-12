"use client";

import Link from "next/link";
import { useLessonWatched } from "@/hooks/useLessonProgress";

type CourseLessonRowProps = {
  href: string;
  lessonId: string;
  title: string;
  isQuiz?: boolean;
  hasVideo: boolean;
  variant?: "compact" | "full";
};

function LessonStatusIcon({
  isQuiz,
  hasVideo,
  watched,
}: {
  isQuiz?: boolean;
  hasVideo: boolean;
  watched: boolean;
}) {
  if (isQuiz) {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-300 text-[10px] text-stone-400"
        aria-hidden
      >
        ?
      </span>
    );
  }

  if (!hasVideo) {
    return (
      <span
        className="h-5 w-5 shrink-0 rounded border-2 border-stone-200 bg-stone-50"
        aria-hidden
      />
    );
  }

  if (watched) {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-green-600 bg-green-50 text-green-700"
        aria-label="Watched"
      >
        <span className="text-[10px] font-bold leading-none" aria-hidden>
          ✓
        </span>
      </span>
    );
  }

  return (
    <span
      className="h-5 w-5 shrink-0 rounded border-2 border-stone-300 bg-white"
      aria-label="Not watched yet"
    />
  );
}

function WatchBadge({
  hasVideo,
  watched,
  isQuiz,
}: {
  hasVideo: boolean;
  watched: boolean;
  isQuiz?: boolean;
}) {
  if (!hasVideo) {
    if (isQuiz) {
      return <span className="shrink-0 text-sm text-stone-400">Quiz</span>;
    }
    return <span className="shrink-0 text-sm text-stone-400">Soon</span>;
  }

  if (watched) {
    return (
      <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
        Watched
      </span>
    );
  }

  return (
    <span className="shrink-0 text-sm font-semibold text-md-red">Watch →</span>
  );
}

export default function CourseLessonRow({
  href,
  lessonId,
  title,
  isQuiz,
  hasVideo,
  variant = "compact",
}: CourseLessonRowProps) {
  const watched = useLessonWatched(lessonId);

  if (variant === "full") {
    return (
      <Link
        href={href}
        className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50"
      >
        <LessonStatusIcon
          isQuiz={isQuiz}
          hasVideo={hasVideo}
          watched={watched}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-500">Lesson {lessonId}</p>
          <p className="font-semibold text-md-black">{title}</p>
        </div>
        <WatchBadge hasVideo={hasVideo} watched={watched} isQuiz={isQuiz} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 text-sm text-stone-700 hover:text-md-red"
    >
      <LessonStatusIcon isQuiz={isQuiz} hasVideo={hasVideo} watched={watched} />
      <span className="min-w-0 flex-1">
        <span className="font-medium text-stone-500">{lessonId}</span> {title}
      </span>
      {hasVideo && (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            watched
              ? "bg-green-50 text-green-700"
              : "bg-stone-100 text-stone-600"
          }`}
        >
          {watched ? "Watched" : "Watch"}
        </span>
      )}
    </Link>
  );
}
