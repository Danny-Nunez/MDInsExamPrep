"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  HOW_IT_WORKS_VIDEO_TITLE,
  HOW_TO_VIDEO_SRC,
} from "@/lib/how-it-works-video";

type HowItWorksVideoModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function HowItWorksVideoModal({
  open,
  onClose,
}: HowItWorksVideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      videoRef.current?.play().catch(() => {});
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 z-[200] m-0 w-[min(calc(100vw-2rem),56rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-stone-200 bg-white p-0 shadow-xl backdrop:bg-black/50"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-labelledby="how-it-works-video-title"
    >
      <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-4 py-3 sm:px-5">
        <h2
          id="how-it-works-video-title"
          className="text-base font-bold text-md-black sm:text-lg"
        >
          {HOW_IT_WORKS_VIDEO_TITLE}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
          aria-label="Close video"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div
        className="p-3 sm:p-4"
        onContextMenu={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-lg bg-black"
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          disableRemotePlayback
          playsInline
          preload="none"
          src={HOW_TO_VIDEO_SRC}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </dialog>
  );
}
