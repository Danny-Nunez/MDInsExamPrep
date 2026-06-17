import type { ReactNode } from "react";
import Link from "next/link";
import {
  Brain,
  Calendar,
  Camera,
  Check,
  Clock,
  Library,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FeatureCloudUploadIcon } from "@/components/landing/FeatureIcons";

type LandingUploadScoreSectionProps = {
  ctaHref: string;
};

const planItems: { icon: LucideIcon; label: string }[] = [
  { icon: Brain, label: "Weaknesses Detected" },
  { icon: Library, label: "Quiz Sets Created" },
  { icon: Calendar, label: "14-Day Plan Generated" },
  { icon: TrendingUp, label: "Progress Tracking Enabled" },
];

const trustItems = [
  "Official Prometric Screenshots Supported",
  "PNG, JPG and PDF Accepted",
  "Results Available in Under 60 Seconds",
];

const glowCardClass =
  "relative z-10 rounded-3xl border border-[rgba(255,215,0,0.08)] bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,215,0,0.06)]";

const studyPlanCardClass =
  "relative z-10 rounded-3xl border border-[rgba(255,215,0,0.14)] bg-gradient-to-br from-[#1e1e1e] to-[#161616] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_60px_rgba(0,0,0,0.5),0_0_50px_rgba(255,215,0,0.1)]";

function StepConnector() {
  return (
    <div
      className="relative flex w-20 shrink-0 items-center sm:w-24"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-md-gold/20" />
      <div className="upload-step-connector-fill relative flex w-full items-center">
        <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-md-gold/55 via-md-gold/90 to-md-gold" />
        <div className="ml-px flex h-0 w-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-md-gold sm:border-y-[6px] sm:border-l-[8px]" />
      </div>
    </div>
  );
}

function UploadStepColumn({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-[7.25rem] flex-col items-center text-center sm:w-32">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-md-gold">
        Step {step}
      </p>
      <div className="mt-3 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full border-2 border-md-gold/35 bg-white/[0.04] shadow-[0_0_24px_rgba(255,210,0,0.1)] sm:mt-3.5 sm:h-20 sm:w-20">
        {children}
      </div>
      <p className="mt-3 min-h-[2.75rem] text-xs font-medium leading-snug text-white/85 sm:mt-3.5 sm:min-h-[3rem] sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function UploadStepFlow() {
  return (
    <div
      className="mx-auto flex items-start justify-center gap-5 sm:gap-7"
      aria-hidden
    >
      <UploadStepColumn step={1} label="Take a picture of your score report">
        <Camera
          className="h-8 w-8 text-white sm:h-9 sm:w-9"
          strokeWidth={1.75}
        />
      </UploadStepColumn>

      <div className="mt-[1.65rem] flex h-[4.5rem] shrink-0 items-center sm:mt-[1.85rem] sm:h-20">
        <StepConnector />
      </div>

      <UploadStepColumn step={2} label="Upload your report">
        <FeatureCloudUploadIcon
          className="h-8 w-8 sm:h-9 sm:w-9"
          arrowColor="#ffffff"
        />
      </UploadStepColumn>
    </div>
  );
}

export default function LandingUploadScoreSection({
  ctaHref,
}: LandingUploadScoreSectionProps) {
  return (
    <section
      id="upload-score-report"
      className="relative overflow-hidden bg-[#111111] py-20 sm:py-24 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -bottom-[250px] -right-[250px] z-0 h-[700px] w-[700px] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,184,0,0.06), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-[250px] z-0 h-[700px] w-[700px] -translate-y-1/2 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(220,20,60,0.04), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="landing-shell relative z-10">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-md-gold">
            Failed your Maryland exam?
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-md-gold/30 bg-md-gold/10 px-3.5 py-1.5 text-xs font-semibold text-md-gold shadow-sm sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            AI Powered Recovery Plan
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-[2.65rem]">
            See{" "}
            <span className="text-md-gold">Exactly</span> What To Study Next
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Upload your Prometric score report and get an AI-powered recovery
            plan based on your weakest Maryland exam categories.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 xl:gap-12">
          <div
            className={`flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 ${glowCardClass}`}
            aria-hidden
          >
            <UploadStepFlow />
          </div>

          <div className={`flex flex-col p-6 sm:p-7 ${studyPlanCardClass}`}>
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div
                  className="absolute inset-0 rounded-xl bg-md-gold/30 blur-lg"
                  aria-hidden
                />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-md-gold/20 bg-md-red/25 shadow-[0_0_20px_rgba(255,210,0,0.15)]">
                  <Sparkles className="h-5 w-5 text-md-gold" aria-hidden />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-md-gold">
                  Step 3
                </p>
                <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  Your Maryland Recovery Blueprint
                </h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3.5">
              {planItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 text-sm text-white/85 sm:text-base"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                      <Icon
                        className="h-4 w-4 text-md-gold"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <ul className="mb-6 flex flex-col items-center gap-2 sm:mb-7 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2">
            {trustItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs text-white/50 sm:text-sm"
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-md-gold"
                  strokeWidth={2.5}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base shadow-[0_0_20px_rgba(220,20,60,0.35)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(220,20,60,0.4)]"
          >
            <Upload className="h-5 w-5" aria-hidden />
            Upload Score Report
          </Link>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-white/45">
            <Clock className="h-3.5 w-3.5 shrink-0 text-md-gold" aria-hidden />
            Typical analysis time: &lt; 60 seconds
          </p>
        </div>
      </div>
    </section>
  );
}
