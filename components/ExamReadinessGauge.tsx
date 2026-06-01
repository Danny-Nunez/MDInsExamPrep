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
  const r =
    size === "default" ? 60 : 50;
  const stroke =
    size === "default" ? 12 : 9;
  const cy = size === "default" ? 80 : 74;
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
      viewBox={size === "default" ? "0 0 200 88" : "0 0 200 80"}
      className={`mx-auto block h-auto w-full max-w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8102e" />
          <stop offset="50%" stopColor="#ffd200" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path
        d={track}
        fill="none"
        stroke="#e7e5e4"
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
        r={size === "compact" ? 5 : 6}
        fill="white"
        stroke="#1a1a1a"
        strokeWidth={2}
      />
    </svg>
  );
}
