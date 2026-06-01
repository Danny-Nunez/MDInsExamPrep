import {
  BRAIN_BODY_PATH,
  BRAIN_CONNECTOR_PATHS,
} from "@/components/landing/brainSvgPaths";
import {
  TARGET_ARROW_PATH,
  TARGET_RING_PATHS,
} from "@/components/landing/targetSvgPaths";
import {
  UPLOAD_ARROW_PATH,
  UPLOAD_CLOUD_PATH,
} from "@/components/landing/uploadSvgPaths";
import type { ComponentType } from "react";

type IconProps = {
  className?: string;
};

const defaultClass = "h-14 w-14 shrink-0 sm:h-16 sm:w-16";

const svgProps = {
  viewBox: "0 0 48 48",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  shapeRendering: "geometricPrecision" as const,
};

const BLACK = "#1a1a1a";
const RED = "#c8102e";
const GOLD = "#ffd200";

/** Bar with rounded top corners only (flat bottom) */
function barPath(x: number, top: number, w: number, bottom: number) {
  const r = 2;
  return `M${x} ${bottom}V${top + r}Q${x} ${top} ${x + r} ${top}H${x + w - r}Q${x + w} ${top} ${x + w} ${top + r}V${bottom}Z`;
}

/** /public/brain.svg — brain body Maryland red (#c8102e), connectors black */
export function FeatureBrainIcon({ className = defaultClass }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      {BRAIN_CONNECTOR_PATHS.map((d, i) => (
        <path key={i} d={d} fill={BLACK} />
      ))}
      <path d={BRAIN_BODY_PATH} fill={RED} />
    </svg>
  );
}

/** /public/upload.svg — cloud Maryland red, arrow black */
export function FeatureCloudUploadIcon({ className = defaultClass }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <path
        d={UPLOAD_CLOUD_PATH}
        fill={RED}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d={UPLOAD_ARROW_PATH}
        fill={BLACK}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FeatureProgressBarsIcon({ className = defaultClass }: IconProps) {
  const bottom = 40;
  return (
    <svg className={className} aria-hidden {...svgProps}>
      <path d={barPath(8, 30, 8, bottom)} fill={BLACK} />
      <path d={barPath(20, 22, 8, bottom)} fill={RED} />
      <path d={barPath(32, 12, 8, bottom)} fill={GOLD} />
    </svg>
  );
}

/** /public/target.svg — rings Maryland red, arrow black */
export function FeatureTargetIcon({ className = defaultClass }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <path d={TARGET_ARROW_PATH} fill={BLACK} />
      {TARGET_RING_PATHS.map((d, i) => (
        <path key={i} d={d} fill={RED} />
      ))}
    </svg>
  );
}

export function FeatureCalendarIcon({ className = defaultClass }: IconProps) {
  const dots = [
    [18, 28],
    [24, 28],
    [30, 28],
    [18, 33],
    [24, 33],
    [30, 33],
    [18, 38],
    [24, 38],
    [30, 38],
  ];
  return (
    <svg className={className} aria-hidden {...svgProps}>
      <rect
        x="10"
        y="12"
        width="28"
        height="30"
        rx="3"
        fill="white"
        stroke={BLACK}
        strokeWidth="2"
      />
      <path
        d="M10 15a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v5H10V15z"
        fill={RED}
      />
      <path d="M10 20h28" stroke={BLACK} strokeWidth="2" />
      <path
        d="M17 10v4M31 10v4"
        stroke={BLACK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill={BLACK} />
      ))}
    </svg>
  );
}

export type FeatureIconId =
  | "brain"
  | "cloud"
  | "progress"
  | "target"
  | "calendar";

const icons: Record<FeatureIconId, ComponentType<IconProps>> = {
  brain: FeatureBrainIcon,
  cloud: FeatureCloudUploadIcon,
  progress: FeatureProgressBarsIcon,
  target: FeatureTargetIcon,
  calendar: FeatureCalendarIcon,
};

export function FeatureIcon({
  id,
  className,
}: IconProps & { id: FeatureIconId }) {
  const Icon = icons[id];
  return <Icon className={className} />;
}
