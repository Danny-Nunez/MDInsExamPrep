import Image from "next/image";
import Link from "next/link";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_TAGLINE_SHORT,
  LOGO_ALT,
  LOGO_PATH,
} from "@/lib/branding";

type MarylandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showAppName?: boolean;
  /** Show tagline under the app name (off by default in nav) */
  showTagline?: boolean;
  tagline?: "short" | "full";
  /** Uppercase wordmark for marketing nav (matches landing mockup) */
  wordmark?: boolean;
  /** Gold MARYLAND + white INSURANCE EXAM on dark nav */
  darkNav?: boolean;
  className?: string;
};

const sizes = {
  sm: { width: 48, height: 48, imgClass: "h-9 w-9", appText: "text-base" },
  md: { width: 56, height: 56, imgClass: "h-11 w-11", appText: "text-lg" },
  lg: { width: 72, height: 72, imgClass: "h-14 w-14", appText: "text-xl" },
};

export default function MarylandLogo({
  href,
  size = "md",
  showAppName = true,
  showTagline = false,
  tagline = "short",
  wordmark = false,
  darkNav = false,
  className = "",
}: MarylandLogoProps) {
  const { width, height, imgClass, appText } = sizes[size];
  const taglineText = tagline === "full" ? APP_TAGLINE : APP_TAGLINE_SHORT;

  const content = (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <Image
        src={LOGO_PATH}
        alt={LOGO_ALT}
        width={width}
        height={height}
        className={`shrink-0 object-contain ${imgClass}`}
        priority={size === "lg"}
      />
      {showAppName && (
        <div
          className={`min-w-0 ${showTagline ? "max-w-[10rem] sm:max-w-[12rem]" : ""}`}
        >
          {wordmark && darkNav ? (
            <div className="inline-grid grid-cols-1 leading-tight">
              <span className="landing-wordmark-stretch text-md-gold">
                MARYLAND
              </span>
              <span className="text-[11px] font-bold uppercase text-white sm:text-xs">
                INSURANCE EXAM
              </span>
            </div>
          ) : wordmark && !darkNav ? (
            <p
              className={`font-bold leading-tight text-neutral-900 ${showTagline ? "truncate" : ""} text-[11px] uppercase tracking-[0.12em] sm:text-xs`}
            >
              {APP_NAME.replace(/ Exam$/, " EXAM")}
            </p>
          ) : (
            <p
              className={`font-bold leading-tight text-neutral-900 ${showTagline ? "truncate" : ""} ${appText}`}
            >
              {APP_NAME}
            </p>
          )}
          {showTagline && !darkNav && (
            <p className="truncate text-xs text-stone-500">{taglineText}</p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="min-w-0 shrink">
        {content}
      </Link>
    );
  }

  return content;
}
