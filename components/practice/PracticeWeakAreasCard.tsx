import Link from "next/link";
import type { CategoryPerformance } from "@/types/quiz";

type PracticeWeakAreasCardProps = {
  areas: CategoryPerformance[];
};

export default function PracticeWeakAreasCard({
  areas,
}: PracticeWeakAreasCardProps) {
  const weak = areas
    .filter((a) => a.total > 0 && a.percentage < 75)
    .slice(0, 3);

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Weak Areas
      </h2>
      {weak.length === 0 ? (
        <p className="mt-3 flex-1 text-sm text-stone-600">
          Complete a practice exam to identify weak areas.
        </p>
      ) : (
        <ul className="mt-3 flex-1 space-y-3">
          {weak.map((area) => {
            const color =
              area.percentage < 55
                ? "bg-red-500"
                : area.percentage < 70
                  ? "bg-amber-500"
                  : "bg-green-500";
            const label = area.subdomain ?? area.domain;
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm text-stone-700">
                  {label}
                </span>
                <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-stone-600">
                  {area.percentage}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/practice#focused-practice"
        className="mt-4 block w-full rounded-lg bg-green-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-green-700"
      >
        Generate Quiz
      </Link>
    </div>
  );
}
