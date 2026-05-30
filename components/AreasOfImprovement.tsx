import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getScoreColor } from "@/lib/domains";
import { WEAK_THRESHOLD } from "@/types/quiz";
import type { CategoryPerformance } from "@/types/quiz";

type AreasOfImprovementProps = {
  subdomainPerformance: CategoryPerformance[];
  domainPerformance: CategoryPerformance[];
  inferredDomains?: string[];
};

export default function AreasOfImprovement({
  subdomainPerformance,
  domainPerformance,
  inferredDomains = [],
}: AreasOfImprovementProps) {
  const weakTopics = [...subdomainPerformance]
    .filter((a) => a.subdomain && a.total > 0 && a.percentage < WEAK_THRESHOLD)
    .sort((a, b) => a.percentage - b.percentage);

  const weakDomains = [...domainPerformance]
    .filter((a) => a.total > 0 && a.percentage < WEAK_THRESHOLD)
    .sort((a, b) => a.percentage - b.percentage);

  const hasPracticeData =
    subdomainPerformance.some((a) => a.total > 0) ||
    domainPerformance.some((a) => a.total > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h2 className="font-semibold text-slate-900">Areas for Improvement</h2>
      </div>

      <div className="p-5">
        {!hasPracticeData && inferredDomains.length === 0 ? (
          <p className="text-sm leading-relaxed text-slate-500">
            Complete a practice exam to see your weakest topics here. The AI
            generator will pre-select those areas for you.
          </p>
        ) : weakTopics.length === 0 && weakDomains.length === 0 ? (
          <p className="text-sm leading-relaxed text-slate-600">
            No topics below {WEAK_THRESHOLD}% yet — strong work. You can still
            pick any topics in the generator to drill further.
          </p>
        ) : (
          <ul className="space-y-3">
            {weakTopics.length > 0
              ? weakTopics.map((item) => (
                  <li key={`${item.domain}-${item.subdomain}`}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-slate-800">
                        {item.subdomain}
                      </span>
                      <span className="shrink-0 font-semibold text-amber-700">
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{item.domain}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${getScoreColor(item.percentage)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.correct} / {item.total} correct
                    </p>
                  </li>
                ))
              : weakDomains.map((item) => (
                  <li key={item.domain}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-slate-800">
                        {item.domain}
                      </span>
                      <span className="shrink-0 font-semibold text-amber-700">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${getScoreColor(item.percentage)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
          </ul>
        )}

        {inferredDomains.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              From uploaded exam results
            </p>
            <div className="flex flex-wrap gap-1.5">
              {inferredDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <Link href="/study-areas" className="link-accent text-sm">
          View all study areas →
        </Link>
      </div>
    </div>
  );
}
