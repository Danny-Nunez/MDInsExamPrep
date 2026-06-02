import Link from "next/link";
import { TrendingUp } from "lucide-react";
import ExamReadinessGauge from "@/components/ExamReadinessGauge";
import { DASHBOARD_METRIC_CARD_CLASS } from "@/lib/dashboard-ui";
import { getReadinessLabel } from "@/lib/dashboard-stats";

type ExamReadinessCardProps = {
  compact?: boolean;
  mockup?: boolean;
  className?: string;
  trendText: string;
  trendPositive?: boolean;
  action?: { href: string; label: string };
} & (
  | { unlocked: true; percentage: number }
  | {
      unlocked: false;
      previewPercentage: number;
    }
);

export default function ExamReadinessCard(props: ExamReadinessCardProps) {
  const {
    compact = false,
    mockup = false,
    className = "",
    trendText,
    trendPositive = true,
    action,
  } = props;
  const isCompact = compact && !mockup;
  const percentage = props.unlocked
    ? props.percentage
    : props.previewPercentage;
  const hasScore = percentage > 0;

  const showTrendIcon =
    trendPositive &&
    !trendText.includes("Take ") &&
    !trendText.includes("preview") &&
    !trendText.includes("Score");

  const label = hasScore ? getReadinessLabel(percentage) : "—";
  const labelColor =
    percentage >= 75
      ? "text-green-600"
      : percentage >= 60
        ? "text-amber-600"
        : percentage > 0
          ? "text-md-red"
          : "text-stone-500";

  if (mockup) {
    return (
      <div
        className={`flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-100 bg-white p-2.5 shadow-sm ${className}`}
      >
        <p className="text-xs font-semibold text-md-black">Exam Readiness</p>
        <div className="relative mx-auto mt-1 w-full max-w-[140px]">
          <ExamReadinessGauge
            percentage={percentage}
            size="compact"
            className="absolute inset-x-0 top-0 h-[68px]"
          />
          <div className="relative h-[108px]">
            <div className="absolute inset-x-0 top-10 bottom-7 flex flex-col items-center justify-center px-1 text-center leading-none">
              <p className="text-2xl font-bold text-md-black">
                {hasScore ? `${percentage}%` : "—"}
              </p>
              <p className={`mt-0.5 text-sm font-semibold leading-tight ${labelColor}`}>
                {label}
              </p>
            </div>
            <p
              className={`absolute inset-x-0 bottom-0 flex h-6 items-center justify-center gap-1 px-1 text-[10px] font-medium leading-tight ${
                trendPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {showTrendIcon && (
                <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
              )}
              <span className="line-clamp-1">{trendText}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompact) {
    const shellClass = action
      ? "flex h-full min-h-[220px] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm p-4"
      : `${DASHBOARD_METRIC_CARD_CLASS} p-3`;

    return (
      <div className={`${shellClass} ${className}`}>
        <p className="shrink-0 text-[10px] font-semibold leading-tight text-md-black sm:text-xs">
          Exam Readiness
        </p>
        <div className="relative mx-auto mt-0.5 w-full flex-1 min-h-0">
          <ExamReadinessGauge
            percentage={percentage}
            size="compact"
            className="absolute inset-x-0 top-0 h-[74px] w-full"
          />
          <div className="absolute inset-x-0 top-10 bottom-0 flex flex-col items-center justify-center px-1 text-center leading-none">
            <p className="text-xl font-bold text-md-black sm:text-2xl">
              {hasScore ? `${percentage}%` : "—"}
            </p>
            <p className={`mt-0.5 text-[11px] font-semibold leading-tight sm:text-xs ${labelColor}`}>
              {label}
            </p>
          </div>
        </div>
        <p
          className={`mt-2 flex shrink-0 items-center justify-center gap-1 text-[10px] font-medium leading-none lg:text-xs ${
            trendPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {showTrendIcon && (
            <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
          )}
          <span className="line-clamp-1">{trendText}</span>
        </p>
        {action && (
          <Link
            href={action.href}
            className="mt-3 block w-full shrink-0 rounded-lg border border-stone-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-stone-50"
          >
            {action.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex min-w-0 w-full flex-col overflow-hidden rounded-xl border border-stone-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <p className="text-sm font-semibold text-md-black">Exam Readiness</p>
      <div className="relative mx-auto mt-1 h-[108px] w-full max-w-[180px]">
        <ExamReadinessGauge
          percentage={percentage}
          size="default"
          className="absolute inset-x-0 top-0 h-[72px]"
        />
        <div className="absolute inset-x-0 top-8 bottom-7 flex flex-col items-center justify-center px-1 text-center leading-none">
          <p className="text-3xl font-bold text-md-black lg:text-4xl">
            {hasScore ? `${percentage}%` : "—"}
          </p>
          <p className={`mt-1 text-base font-semibold leading-tight lg:text-lg ${labelColor}`}>
            {label}
          </p>
        </div>
        <p
          className={`absolute inset-x-0 bottom-0 flex h-7 items-center justify-center gap-1 px-1 text-sm font-medium leading-tight ${
            trendPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {showTrendIcon && (
            <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span className="line-clamp-1">{trendText}</span>
        </p>
      </div>
    </div>
  );
}
