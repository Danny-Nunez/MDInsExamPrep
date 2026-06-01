import { TrendingUp } from "lucide-react";
import ExamReadinessGauge from "@/components/ExamReadinessGauge";
import { getReadinessLabel } from "@/lib/dashboard-stats";

type ExamReadinessCardProps = {
  compact?: boolean;
  /** Wide card for landing page mockup — full gauge, not squeezed in a grid cell */
  mockup?: boolean;
  trendText: string;
  trendPositive?: boolean;
} & (
  | { unlocked: true; percentage: number }
  | {
      unlocked: false;
      previewPercentage: number;
    }
);

type GaugeLayout = {
  gaugeSize: "compact" | "mockup" | "default";
  boxClass: string;
  scoreClass: string;
  percentClass: string;
  labelClass: string;
  trendClass: string;
  iconClass: string;
};

function gaugeLayout(mockup: boolean, isCompact: boolean): GaugeLayout {
  if (mockup) {
    return {
      gaugeSize: "mockup",
      boxClass: "mt-1 h-[100px] w-full max-w-[132px]",
      scoreClass: "top-7 bottom-6",
      percentClass: "text-2xl",
      labelClass: "mt-0.5 text-sm leading-tight",
      trendClass: "h-6 text-[10px] leading-tight",
      iconClass: "h-3 w-3",
    };
  }
  if (isCompact) {
    return {
      gaugeSize: "compact",
      boxClass: "mt-1 h-[100px] w-full max-w-[132px] lg:max-w-[128px]",
      scoreClass: "top-7 bottom-6",
      percentClass: "text-xl lg:text-2xl",
      labelClass: "mt-0.5 text-xs leading-tight lg:text-sm",
      trendClass: "h-6 text-[10px] leading-tight lg:text-xs",
      iconClass: "h-3 w-3",
    };
  }
  return {
    gaugeSize: "default",
    boxClass: "mt-1 h-[108px] w-full max-w-[168px] lg:max-w-[180px]",
    scoreClass: "top-8 bottom-7",
    percentClass: "text-3xl lg:text-4xl",
    labelClass: "mt-1 text-base leading-tight lg:text-lg",
    trendClass: "h-7 text-sm leading-tight",
    iconClass: "h-4 w-4",
  };
}

export default function ExamReadinessCard(props: ExamReadinessCardProps) {
  const { compact = false, mockup = false, trendText, trendPositive = true } =
    props;
  const isCompact = compact && !mockup;
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

  const layout = gaugeLayout(mockup, isCompact);

  return (
    <div
      className={`flex min-w-0 w-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm ${
        mockup
          ? "p-2.5"
          : isCompact
            ? "min-h-[120px] justify-between p-3 sm:p-4"
            : "p-5 sm:p-6"
      }`}
    >
      <p
        className={`font-semibold text-md-black ${
          mockup ? "text-xs" : "text-sm"
        }`}
      >
        Exam Readiness
      </p>

      <div
        className={`relative mx-auto min-w-0 ${layout.boxClass}`}
      >
        <ExamReadinessGauge
          percentage={percentage}
          size={layout.gaugeSize}
          className="absolute inset-x-0 top-0 mx-auto max-h-full w-full"
        />
        <div
          className={`absolute inset-x-0 flex flex-col items-center justify-center px-1 text-center leading-none ${layout.scoreClass}`}
        >
          <p className={`font-bold text-md-black ${layout.percentClass}`}>
            {hasScore ? `${percentage}%` : "—"}
          </p>
          <p className={`font-semibold ${labelColor} ${layout.labelClass}`}>
            {label}
          </p>
        </div>
        <p
          className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 px-1 font-medium ${layout.trendClass} ${
            trendPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {showTrendIcon && (
            <TrendingUp className={`shrink-0 ${layout.iconClass}`} aria-hidden />
          )}
          <span className="line-clamp-2 text-center">{trendText}</span>
        </p>
      </div>
    </div>
  );
}
