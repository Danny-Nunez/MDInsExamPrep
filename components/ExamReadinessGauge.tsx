type ExamReadinessGaugeProps = {
  percentage: number;
  className?: string;
  size?: "default" | "compact" | "mockup";
};

/** Continuous upward semicircle: red → gold → green */
export default function ExamReadinessGauge({
  percentage,
  className = "",
  size = "default",
}: ExamReadinessGaugeProps) {
  const value = Math.min(100, Math.max(0, percentage));
  const cx = 100;
  const isLarge = size === "default";
  const r = isLarge ? 60 : 58;
  const stroke = isLarge ? 12 : 13;
  const cy = isLarge ? 80 : 78;
  const gradientId = `exam-readiness-gauge-${size}`;

  const polar = (pct: number) => {
    const angle = Math.PI - (pct / 100) * Math.PI;
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle),
    };
  };

  const start = polar(0);
  const end = polar(100);
  const track = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  const marker = polar(value);

  return (
    <svg
      viewBox={isLarge ? "0 0 200 88" : "0 0 200 86"}
      className={`mx-auto block h-full w-full max-w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8102e" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path
        d={track}
        fill="none"
        stroke="#ececec"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d={track}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <circle
        cx={marker.x}
        cy={marker.y}
        r={isLarge ? 6 : 5.5}
        fill="white"
        stroke="#1a1a1a"
        strokeWidth={2}
      />
    </svg>
  );
}
