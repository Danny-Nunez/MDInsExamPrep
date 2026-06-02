import Link from "next/link";
import type { CategoryPerformance } from "@/types/quiz";

type DashboardUpcomingStudyProps = {
  items: CategoryPerformance[];
};

export default function DashboardUpcomingStudy({
  items,
}: DashboardUpcomingStudyProps) {
  const tasks = items.slice(0, 3);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-slate-900">Upcoming Study</h2>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">
            Complete a quiz to get personalized study tasks.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((item) => (
              <li
                key={item.subdomain ?? item.domain}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 truncate font-medium text-slate-800">
                  {item.subdomain ?? item.domain}
                </span>
                <span className="shrink-0 text-slate-500">15 min</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/study-areas"
          className="btn-primary mt-4 block w-full py-2.5 text-center text-sm"
        >
          Start Today&apos;s Plan
        </Link>
      </div>
    </div>
  );
}
