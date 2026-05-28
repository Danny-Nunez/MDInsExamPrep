import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE, LOGO_PATH } from "@/lib/branding";

type MarylandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showAppName?: boolean;
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
  className = "",
}: MarylandLogoProps) {
  const { width, height, imgClass, appText } = sizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={LOGO_PATH}
        alt="Maryland state seal"
        width={width}
        height={height}
        className={`shrink-0 object-contain ${imgClass}`}
        priority={size === "lg"}
      />
      {showAppName && (
        <div className="min-w-0">
          <p className={`font-bold leading-tight text-md-black ${appText}`}>
            {APP_NAME}
          </p>
          <p className="text-xs text-stone-500">{APP_TAGLINE}</p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
