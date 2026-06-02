import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { CategoryPerformance } from "@/types/quiz";

type DashboardStudyPlanPreviewProps = {
  weakAreas: CategoryPerformance[];
};

export default function DashboardStudyPlanPreview({
  weakAreas,
}: DashboardStudyPlanPreviewProps) {
  const tasks = weakAreas.slice(0, 4);
  const completed = Math.min(1, tasks.length);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-slate-900">Your 14-Day Study Plan</h2>
      </div>
      <div className="flex-1 p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-slate-600">
          Day {completed + 1} of 14
        </p>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">
            Take a practice exam to generate your study plan.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((area, index) => {
              const done = index < completed;
              const label = area.subdomain ?? area.domain;
              return (
                <li key={label} className="flex items-start gap-2">
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">15 min practice</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <Link
          href="/study-areas"
          className="link-accent mt-4 inline-block text-sm"
        >
          Open full study plan →
        </Link>
      </div>
    </div>
  );
}
