import { TrendingUp } from "lucide-react";

type MetricTrendCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string | null;
  trendPositive?: boolean;
  compact?: boolean;
};

export default function MetricTrendCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  compact = false,
}: MetricTrendCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-stone-200 bg-white shadow-sm ${
        compact ? "min-h-0 p-3" : "min-h-[120px] p-5"
      }`}
    >
      <p className={compact ? "text-[10px] leading-tight text-stone-600" : "text-sm text-stone-600"}>
        {title}
      </p>
      <p
        className={`font-bold text-md-black ${
          compact ? "mt-1 text-xl" : "mt-2 text-3xl sm:text-4xl"
        }`}
      >
        {value}
      </p>
      {subtitle ? (
        <p
          className={`font-medium text-stone-600 ${
            compact ? "mt-0.5 text-[10px] leading-snug" : "mt-1 text-xs leading-snug"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {trend ? (
        <p
          className={`flex items-center gap-0.5 font-medium ${
            compact ? "mt-1 text-[10px]" : "mt-3 text-sm"
          } ${trendPositive ? "text-green-600" : "text-red-600"}`}
        >
          {trendPositive &&
            !trend.includes("Across") &&
            !trend.includes("Keep") &&
            !trend.includes("unlock") && (
            <TrendingUp className={compact ? "h-3 w-3" : "h-4 w-4"} aria-hidden />
          )}
          {trend}
        </p>
      ) : (
        <p className={compact ? "mt-1 text-[10px] text-stone-400" : "mt-3 text-sm text-stone-400"}>
          &nbsp;
        </p>
      )}
    </div>
  );
}
