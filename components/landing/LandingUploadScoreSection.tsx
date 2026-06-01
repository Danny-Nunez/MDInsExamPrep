import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Upload } from "lucide-react";
import { FeatureCloudUploadIcon } from "@/components/landing/FeatureIcons";

type LandingUploadScoreSectionProps = {
  ctaHref: string;
};

const bullets = [
  "Works with official exam result screenshots",
  "Maps weaknesses to Maryland blueprint topics",
  "One-click quizzes from your upload analysis",
];

function UploadStep({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <span className="text-[10px] font-bold uppercase tracking-wide text-md-red">
        Step {step}
      </span>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-md-gold-light/90 sm:h-18 sm:w-18">
        {children}
      </div>
      <p className="text-xs font-semibold leading-snug text-stone-800 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export default function LandingUploadScoreSection({
  ctaHref,
}: LandingUploadScoreSectionProps) {
  return (
    <section
      id="upload-score-report"
      className="border-y border-stone-200/80 bg-md-gold-light py-16 sm:py-20"
    >
      <div className="landing-shell grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20">
        <div className="order-2 flex justify-center lg:order-1 lg:justify-end">
          <div
            className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border-2 border-dashed border-md-red/50 bg-white px-4 py-6 shadow-md sm:max-w-md sm:px-6 sm:py-8"
            aria-hidden
          >
            <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
              <UploadStep step={1} label="Take a picture">
                <Camera
                  className="h-9 w-9 text-md-black sm:h-10 sm:w-10"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </UploadStep>

              <ArrowRight
                className="mt-5 h-5 w-5 shrink-0 text-md-red sm:mt-6 sm:h-6 sm:w-6"
                aria-hidden
              />

              <UploadStep step={2} label="Upload">
                <FeatureCloudUploadIcon className="h-10 w-10 sm:h-11 sm:w-11" />
              </UploadStep>
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center lg:order-2">
          <p className="text-sm font-bold uppercase tracking-wide text-md-red">
            Failed your exam?
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-[1.15] text-md-black sm:text-4xl">
            Upload Your Score Report
            <span className="mt-1 block text-md-red">
              Get a Smarter Study Plan
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-700">
            Snap or upload a photo of your Prometric score report. Our AI reads
            your weak categories and recommends focused quizzes—so you study
            what actually cost you points.
          </p>
          <ul className="mt-6 space-y-2.5">
            {bullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-stone-700 sm:text-base"
              >
                <span
                  className="landing-trust-check mt-0.5 shrink-0"
                  aria-hidden
                >
                  <Check className="h-3 w-3 stroke-[3] text-white" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className="btn-primary mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base"
          >
            <Upload className="h-5 w-5" aria-hidden />
            Upload Score Report
          </Link>
        </div>
      </div>
    </section>
  );
}
