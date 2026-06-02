"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DASHBOARD_ROW_CARD_CLASS } from "@/lib/dashboard-ui";

export default function DashboardFocusedPracticeCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`${DASHBOARD_ROW_CARD_CLASS} justify-between p-4 sm:p-5 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 shrink-0 text-md-gold" aria-hidden />
          <h2 className="font-semibold text-slate-900">Focused Practice</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Build a custom set from your weak topics so every session targets
          what raises your score fastest.
        </p>
      </div>
      <Link
        href="/practice#focused-practice"
        className="btn-primary mt-4 block w-full py-2.5 text-center text-sm"
      >
        Generate Quiz
      </Link>
    </div>
  );
}
