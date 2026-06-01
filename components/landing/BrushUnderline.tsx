const GRADIENT_ID = "you-need-underline-gradient";

/** Convex arch under text: center rises, ends dip down; red center fades to white. */
export default function BrushUnderline() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-1/2 h-4 w-[110%] -translate-x-1/2 sm:h-5"
      viewBox="0 0 140 20"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient
          id={GRADIENT_ID}
          x1="0"
          y1="0"
          x2="140"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="16%" stopColor="#c8102e" />
          <stop offset="84%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        d="M2 15 Q70 5 138 15"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
