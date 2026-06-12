"use client";

import { useEffect } from "react";
import { isLessonWatched } from "@/lib/course/lesson-progress";
import { markLessonWatchedWithSync } from "@/lib/course/lesson-progress-client";

type ColossyanEmbedProps = {
  src: string;
  title: string;
  lessonId: string;
  estimatedMinutes?: number;
};

export default function ColossyanEmbed({
  src,
  title,
  lessonId,
  estimatedMinutes = 8,
}: ColossyanEmbedProps) {
  useEffect(() => {
    if (isLessonWatched(lessonId)) return;

    const watchMs = Math.max(estimatedMinutes * 60 * 1000 * 0.85, 90_000);
    const timer = window.setTimeout(() => {
      void markLessonWatchedWithSync(lessonId);
    }, watchMs);

    return () => window.clearTimeout(timer);
  }, [lessonId, estimatedMinutes]);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-black shadow-sm">
      <div className="relative aspect-video">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
