"use client";

import { useState } from "react";
import ColossyanEmbed from "@/components/course/ColossyanEmbed";
import CourseKnowledgeCheck from "@/components/course/CourseKnowledgeCheck";
import YouTubeEmbed from "@/components/course/YouTubeEmbed";
import type { CourseKnowledgeCheck as CourseKnowledgeCheckData } from "@/lib/course/types";

type LessonTab = "video" | "transcript" | "knowledge-check";

type CourseLessonMediaProps = {
  lessonId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  youtubeId?: string;
  transcript?: string;
  knowledgeCheck?: CourseKnowledgeCheckData;
  estimatedMinutes?: number;
};

export default function CourseLessonMedia({
  lessonId,
  title,
  description,
  videoUrl,
  youtubeId,
  transcript,
  knowledgeCheck,
  estimatedMinutes,
}: CourseLessonMediaProps) {
  const [tab, setTab] = useState<LessonTab>("video");
  const hasTranscript = Boolean(transcript?.trim());
  const hasKnowledgeCheck = Boolean(knowledgeCheck?.questions.length);
  const showTabs = hasTranscript || hasKnowledgeCheck;

  const videoPlayer = youtubeId ? (
    <YouTubeEmbed videoId={youtubeId} title={title} lessonId={lessonId} />
  ) : videoUrl ? (
    <ColossyanEmbed
      src={videoUrl}
      title={title}
      lessonId={lessonId}
      estimatedMinutes={estimatedMinutes}
    />
  ) : null;

  if (!videoPlayer) return null;

  const descriptionBlock = description ? (
    <p className="mt-4 max-w-4xl text-base leading-relaxed text-stone-600 sm:text-lg">
      {description}
    </p>
  ) : null;

  const knowledgeCheckLabel =
    knowledgeCheck?.title ?? "Knowledge Check";

  if (!showTabs) {
    return (
      <div className="mt-8">
        {videoPlayer}
        {descriptionBlock}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div
        className="flex gap-1 rounded-lg border border-stone-200 bg-stone-100 p-1"
        role="tablist"
        aria-label="Lesson content"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "video"}
          onClick={() => setTab("video")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
            tab === "video"
              ? "bg-white text-md-black shadow-sm"
              : "text-stone-600 hover:text-md-black"
          }`}
        >
          Video
        </button>
        {hasTranscript && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === "transcript"}
            onClick={() => setTab("transcript")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              tab === "transcript"
                ? "bg-white text-md-black shadow-sm"
                : "text-stone-600 hover:text-md-black"
            }`}
          >
            Transcript
          </button>
        )}
        {hasKnowledgeCheck && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === "knowledge-check"}
            onClick={() => setTab("knowledge-check")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:gap-2 sm:px-4 ${
              tab === "knowledge-check"
                ? "bg-md-gold text-md-black shadow-sm ring-1 ring-md-gold-dark/30"
                : "border border-md-gold/50 bg-md-gold-light text-md-black hover:bg-md-gold/40"
            }`}
          >
            <span>{knowledgeCheckLabel}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${
                tab === "knowledge-check"
                  ? "bg-md-black/10 text-md-black"
                  : "bg-md-red text-white"
              }`}
            >
              {knowledgeCheck!.questions.length} Q
            </span>
          </button>
        )}
      </div>

      <div className="mt-4" role="tabpanel">
        {tab === "video" && (
          <>
            {videoPlayer}
            {descriptionBlock}
          </>
        )}

        {tab === "transcript" && hasTranscript && (
          <div className="max-h-[32rem] overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Transcript
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-700 sm:text-base">
              {transcript!
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
            </div>
          </div>
        )}

        {tab === "knowledge-check" && hasKnowledgeCheck && (
          <div className="max-h-[min(70vh,40rem)] overflow-y-auto rounded-xl border border-md-gold/40 bg-white p-5 shadow-sm sm:p-6">
            <CourseKnowledgeCheck
              knowledgeCheck={knowledgeCheck!}
              variant="embedded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
