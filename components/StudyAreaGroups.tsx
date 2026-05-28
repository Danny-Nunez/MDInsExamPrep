import { getScoreColor } from "@/lib/domains";
import type { CategoryPerformance } from "@/types/quiz";

type StudyAreaGroupsProps = {
  groups: { domain: string; subdomains: CategoryPerformance[] }[];
};

export default function StudyAreaGroups({ groups }: StudyAreaGroupsProps) {
  return (
    <div className="space-y-8">
      {groups.map(({ domain, subdomains }) => (
        <section key={domain}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-md-red">
            {domain}
          </h3>
          <div className="space-y-2">
            {subdomains.map((item) => (
              <div
                key={`${item.domain}-${item.subdomain}`}
                className="flex items-center gap-3"
              >
                <span className="w-44 shrink-0 text-sm text-slate-800 sm:w-56">
                  {item.subdomain}
                </span>
                <div className="flex flex-1 items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${getScoreColor(item.percentage)}`}
                      style={{
                        width: `${item.total > 0 ? item.percentage : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-medium text-slate-700">
                    {item.total > 0 ? `${item.percentage}%` : "—"}
                  </span>
                  <span className="hidden w-14 shrink-0 text-right text-xs text-slate-400 sm:inline">
                    {item.total > 0
                      ? `${item.correct} / ${item.total}`
                      : "0 / 0"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
