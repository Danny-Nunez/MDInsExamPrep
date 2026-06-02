import Link from "next/link";
import type { ExamAttempt } from "@/types/quiz";

type DashboardRecentActivityProps = {
  attempts: ExamAttempt[];
  limit?: number;
};

export default function DashboardRecentActivity({
  attempts,
  limit = 4,
}: DashboardRecentActivityProps) {
  const recent = attempts.slice(0, limit);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-slate-900">Recent Activity</h2>
        <Link href="/results" className="link-accent text-sm">
          View all →
        </Link>
      </div>
      <div className="flex-1 p-4 sm:p-5">
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            No practice sessions yet. Start on the Practice Exams tab.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((attempt, i) => {
              const date = new Date(attempt.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              const scoreColor =
                attempt.percentage >= 75
                  ? "text-green-600"
                  : attempt.percentage >= 60
                    ? "text-amber-600"
                    : "text-red-600";
              return (
                <li
                  key={attempt.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      Practice Exam #{attempts.length - i}
                    </p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold tabular-nums ${scoreColor}`}
                  >
                    {attempt.percentage}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
