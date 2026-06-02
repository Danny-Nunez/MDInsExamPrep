import { TrendingUp } from "lucide-react";
import { DASHBOARD_METRIC_CARD_CLASS } from "@/lib/dashboard-ui";

type MetricTrendCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string | null;
  trendPositive?: boolean;
  compact?: boolean;
  className?: string;
};

export default function MetricTrendCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  compact = false,
  className = "",
}: MetricTrendCardProps) {
  const footer = trend ?? subtitle ?? null;
  const showTrendIcon =
    trendPositive &&
    footer &&
    trend &&
    !footer.includes("Across") &&
    !footer.includes("Keep") &&
    !footer.includes("unlock");

  if (compact) {
    return (
      <div className={`${DASHBOARD_METRIC_CARD_CLASS} p-3 ${className}`}>
        <p className="shrink-0 text-[10px] leading-tight text-stone-600 sm:text-xs">
          {title}
        </p>
        <div className="flex flex-1 items-center">
          <p className="text-2xl font-bold text-md-black">{value}</p>
        </div>
        <p
          className={`mt-auto flex h-4 shrink-0 items-center gap-0.5 text-[10px] font-medium leading-none lg:text-xs ${
            footer
              ? trend
                ? trendPositive
                  ? "text-green-600"
                  : "text-red-600"
                : "text-stone-600"
              : "text-transparent"
          }`}
        >
          {showTrendIcon && (
            <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
          )}
          <span className="line-clamp-1">{footer ?? "\u00A0"}</span>
        </p>
      </div>
    );
  }

  return (
      <div className={`${DASHBOARD_METRIC_CARD_CLASS} p-5 ${className}`}>
      <p className="shrink-0 text-sm text-stone-600">{title}</p>
      <div className="flex flex-1 items-center">
        <p className="text-3xl font-bold text-md-black sm:text-4xl">{value}</p>
      </div>
      <p
        className={`mt-auto flex h-5 shrink-0 items-center gap-0.5 text-sm font-medium ${
          footer
            ? trend
              ? trendPositive
                ? "text-green-600"
                : "text-red-600"
              : "text-stone-600"
            : "text-transparent"
        }`}
      >
        {showTrendIcon && <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />}
        <span className="line-clamp-1">{footer ?? "\u00A0"}</span>
      </p>
    </div>
  );
}
