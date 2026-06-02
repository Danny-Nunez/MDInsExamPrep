"use client";

import { useEffect, useState } from "react";
import DashboardHeaderActions from "@/components/DashboardHeaderActions";
import { formatDisplayName } from "@/lib/format-display-name";
import { resolveDashboardGreeting } from "@/lib/practice-streak";

type DashboardWelcomeHeaderProps = {
  userName?: string | null;
  userEmail?: string | null;
  userId?: string | null;
  streak: number;
  showStreak: boolean;
};

export default function DashboardWelcomeHeader({
  userName,
  userEmail,
  userId = null,
  streak,
  showStreak,
}: DashboardWelcomeHeaderProps) {
  const [isFirstVisit, setIsFirstVisit] = useState(() =>
    resolveDashboardGreeting(userId)
  );

  useEffect(() => {
    setIsFirstVisit(resolveDashboardGreeting(userId));
  }, [userId]);

  const displayName = formatDisplayName(userName, userEmail);
  const title = displayName
    ? isFirstVisit
      ? `Welcome, ${displayName}! 👋`
      : `Welcome back, ${displayName}! 👋`
    : isFirstVisit
      ? "Welcome! 👋"
      : "Welcome back! 👋";

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4 sm:mb-8">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Here&apos;s your exam readiness snapshot
        </p>
      </div>
      <div className="hidden lg:flex">
        <DashboardHeaderActions
          variant="desktop"
          userName={userName}
          userEmail={userEmail}
          streak={streak}
          showStreak={showStreak}
        />
      </div>
    </header>
  );
}
