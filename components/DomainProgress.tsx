import { getScoreColor } from "@/lib/domains";
import type { CategoryPerformance } from "@/types/quiz";

type DomainProgressProps = {
  items: CategoryPerformance[];
  compact?: boolean;
};

export default function DomainProgress({
  items,
  compact = false,
}: DomainProgressProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.domain} className="flex items-center gap-3">
          {!compact && (
            <span className="w-44 shrink-0 text-sm text-slate-800 sm:w-52">
              {item.domain}
            </span>
          )}
          {compact && (
            <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
              {item.domain}
            </span>
          )}
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
            {!compact && (
              <span className="hidden w-14 shrink-0 text-right text-xs text-slate-400 sm:inline">
                {item.total > 0 ? `${item.correct} / ${item.total}` : "0 / 0"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
