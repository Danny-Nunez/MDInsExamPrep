"use client";

import { useEffect, useRef } from "react";
import { markLessonWatchedWithSync } from "@/lib/course/lesson-progress-client";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  lessonId: string;
};

type YTPlayer = {
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiReadyPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const waitForYt = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(waitForYt);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return apiReadyPromise;
}

export default function YouTubeEmbed({
  videoId,
  title,
  lessonId,
}: YouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          cc_load_policy: 1,
          cc_lang_pref: "en",
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              void markLessonWatchedWithSync(lessonId);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, lessonId]);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-black shadow-sm">
      <div className="relative aspect-video">
        <div
          ref={containerRef}
          className="absolute inset-0 h-full w-full"
          title={title}
        />
      </div>
    </div>
  );
}
