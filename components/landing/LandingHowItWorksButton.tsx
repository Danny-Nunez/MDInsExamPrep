"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import HowItWorksVideoModal from "@/components/landing/HowItWorksVideoModal";

export default function LandingHowItWorksButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-md-black px-4 py-3 text-sm sm:gap-2.5 sm:px-6 sm:py-3.5 sm:text-base"
        aria-label="See how it works"
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-md-black sm:h-7 sm:w-7"
          aria-hidden
        >
          <Play className="h-2.5 w-2.5 fill-md-black text-md-black sm:h-3 sm:w-3" />
        </span>
        <span className="sm:hidden">See How</span>
        <span className="hidden sm:inline">See How It Works</span>
      </button>

      <HowItWorksVideoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
