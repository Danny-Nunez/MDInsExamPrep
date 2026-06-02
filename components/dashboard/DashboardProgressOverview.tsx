import Link from "next/link";
import { getScoreColor } from "@/lib/domains";
import type { CategoryPerformance, ExamAttempt } from "@/types/quiz";

type DashboardProgressOverviewProps = {
  attempts: ExamAttempt[];
  performance: CategoryPerformance[];
};

function ReadinessSparkline({ attempts }: { attempts: ExamAttempt[] }) {
  const sorted = [...attempts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-6);

  if (sorted.length < 2) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        Complete more quizzes to see readiness trends.
      </p>
    );
  }

  const points = sorted.map((a, i) => {
    const x = (i / (sorted.length - 1)) * 240;
    const y = 64 - (a.percentage / 100) * 50;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 240 64" className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id="readiness-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M${points[0]} L${points.slice(1).join(" L")} L240,64 L0,64 Z`}
        fill="url(#readiness-fill)"
      />
      <polyline
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
    </svg>
  );
}

export default function DashboardProgressOverview({
  attempts,
  performance,
}: DashboardProgressOverviewProps) {
  const topics = performance.filter((p) => p.total > 0).slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-slate-900">Progress Overview</h2>
        <Link href="/performance" className="link-accent text-sm">
          Details →
        </Link>
      </div>
      <div className="flex-1 p-4 sm:p-5">
        <p className="mb-1 text-sm font-medium text-slate-700">
          Readiness Over Time
        </p>
        <ReadinessSparkline attempts={attempts} />
        <p className="mt-4 text-sm font-medium text-slate-700">
          Topic Performance
        </p>
        {topics.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No topic data yet — start practicing.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {topics.map((item) => (
              <li key={item.domain} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                  {item.domain.replace(" Insurance", "")}
                </span>
                <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${getScoreColor(item.percentage)}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
