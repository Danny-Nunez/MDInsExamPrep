import { TrendingUp } from "lucide-react";
import ExamReadinessGauge from "@/components/ExamReadinessGauge";
import { getReadinessLabel } from "@/lib/dashboard-stats";

type ExamReadinessCardProps = {
  compact?: boolean;
  trendText: string;
  trendPositive?: boolean;
} & (
  | { unlocked: true; percentage: number }
  | {
      unlocked: false;
      previewPercentage: number;
    }
);

export default function ExamReadinessCard(props: ExamReadinessCardProps) {
  const { compact = false, trendText, trendPositive = true } = props;
  const percentage = props.unlocked
    ? props.percentage
    : props.previewPercentage;
  const hasScore = percentage > 0;

  const showTrendIcon =
    trendPositive &&
    !trendText.includes("Take ") &&
    !trendText.includes("preview");

  const label = hasScore ? getReadinessLabel(percentage) : "—";
  const labelColor =
    percentage >= 75
      ? "text-green-600"
      : percentage >= 60
        ? "text-amber-600"
        : percentage > 0
          ? "text-md-red"
          : "text-stone-500";

  return (
    <div
      className={`flex flex-col rounded-xl border border-stone-200 bg-white shadow-sm ${
        compact ? "min-h-[120px] justify-between p-4" : "p-5 sm:p-6"
      }`}
    >
      <p className="text-sm font-semibold text-md-black">Exam Readiness</p>

      <div
        className={`relative mx-auto w-full ${
          compact ? "mt-1 max-w-[200px]" : "mt-1 max-w-[260px]"
        }`}
      >
        <ExamReadinessGauge
          percentage={percentage}
          size={compact ? "compact" : "default"}
        />
        <div
          className={`absolute inset-x-0 flex flex-col items-center text-center ${
            compact ? "bottom-0" : "bottom-1"
          }`}
        >
          <p
            className={`font-bold leading-none text-md-black ${
              compact ? "text-2xl" : "text-4xl sm:text-5xl"
            }`}
          >
            {hasScore ? `${percentage}%` : "—"}
          </p>
          <p
            className={`font-semibold ${labelColor} ${
              compact ? "mt-0.5 text-sm" : "mt-1 text-lg"
            }`}
          >
            {label}
          </p>
        </div>
      </div>

      <p
        className={`flex items-center justify-center gap-1 font-medium ${
          compact ? "mt-1 text-xs" : "mt-2 text-sm"
        } ${trendPositive ? "text-green-600" : "text-red-600"}`}
      >
        {showTrendIcon && (
          <TrendingUp
            className={compact ? "h-3 w-3" : "h-4 w-4"}
            aria-hidden
          />
        )}
        <span className="line-clamp-2 text-center">{trendText}</span>
      </p>
    </div>
  );
}
