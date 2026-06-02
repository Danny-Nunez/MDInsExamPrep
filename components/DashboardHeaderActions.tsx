import Link from "next/link";
import { Bell } from "lucide-react";
import { formatDisplayName } from "@/lib/format-display-name";

type DashboardHeaderActionsProps = {
  userName?: string | null;
  userEmail?: string | null;
  variant?: "mobile" | "desktop";
  streak?: number;
  showStreak?: boolean;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardHeaderActions({
  userName,
  userEmail,
  variant = "desktop",
  streak = 0,
  showStreak = false,
}: DashboardHeaderActionsProps) {
  const displayName = formatDisplayName(userName, userEmail);
  const isMobile = variant === "mobile";

  return (
    <div className="flex shrink-0 items-center gap-2">
      {!isMobile && showStreak && streak > 0 && (
        <div
          className="text-center"
          aria-label={`${streak} day practice streak`}
        >
          <div className="flex items-center gap-0.5 leading-none">
            <span className="text-2xl" aria-hidden>
              🔥
            </span>
            <span className="text-2xl font-bold text-md-red">{streak}</span>
          </div>
          <p className="text-xs text-slate-500">Day Streak</p>
        </div>
      )}
      <button
        type="button"
        className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" aria-hidden />
      </button>
      {!isMobile &&
        (displayName ? (
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-stone-100"
            aria-label="Account"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-md-black text-xs font-semibold text-md-gold">
              {getInitials(displayName)}
            </div>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-900 min-[480px]:inline">
              {displayName}
            </span>
          </Link>
        ) : (
          <Link
            href="/account"
            className="text-sm font-medium text-stone-600 hover:text-md-red"
          >
            Account
          </Link>
        ))}
    </div>
  );
}
