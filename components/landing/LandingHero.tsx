import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import LandingHowItWorksButton from "@/components/landing/LandingHowItWorksButton";
import LandingHeroStatsBar from "@/components/landing/LandingHeroStatsBar";

type LandingHeroProps = {
  sampleHref: string;
};

const trustItems = [
  "No Credit Card Required",
  "Instant Results",
  "Maryland-Specific Curriculum",
];

export default function LandingHero({ sampleHref }: LandingHeroProps) {
  return (
    <section className="relative overflow-x-clip border-b border-stone-200 bg-white pb-8 sm:pb-10 lg:overflow-x-visible lg:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 hidden lg:block">
        <div className="landing-shell relative h-full">
          <div className="landing-hero-media absolute top-0 bottom-0 right-0 -ml-10 w-[calc(50%+2.5rem)] xl:-ml-14 xl:w-[calc(50%+3.5rem)]">
            <Image
              src="/hero.png"
              alt="Maryland State House with Maryland flag-inspired design"
              width={1402}
              height={1122}
              priority
              className="h-full w-auto max-w-none"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <span className="absolute left-[8%] top-[42%] z-10 inline-flex items-center gap-1.5 rounded-full border border-md-gold/20 bg-white px-4 py-2.5 text-sm font-semibold text-md-black shadow-[0_8px_24px_rgba(0,0,0,0.08),0_0_20px_rgba(255,210,0,0.25)] xl:left-[10%] xl:top-[36%]">
              <Check
                className="h-3.5 w-3.5 shrink-0 text-md-gold"
                strokeWidth={2.5}
                aria-hidden
              />
              Maryland Licensed
            </span>
          </div>
        </div>
      </div>

      <div className="landing-shell relative z-10 grid items-stretch gap-8 overflow-visible lg:grid-cols-[minmax(0,1.15fr)_1fr] lg:gap-10 xl:gap-14">
        <div className="relative flex min-w-0 flex-col justify-center py-10 sm:py-12 lg:py-14 xl:py-16">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-md-black sm:text-5xl lg:text-[3.25rem]">
            Pass the Maryland{" "}
            <span className="text-md-red">Life &amp; Health Insurance</span>{" "}
            Exam with Confidence
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            AI-powered practice exams, personalized study plans, and smart
            progress tracking to help you pass faster.
          </p>

          <div className="mt-8">
            <div className="landing-hero-btn-row">
              <Link
                href={sampleHref}
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base"
                aria-label="Start free 10-question exam"
              >
                <span className="sm:hidden">Start Free</span>
                <span className="hidden sm:inline">Start Free 10-Question Exam</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              </Link>
              <LandingHowItWorksButton />
            </div>

            <ul className="landing-hero-trust-row">
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 items-center gap-2 text-xs font-medium text-stone-700 sm:shrink-0 sm:text-sm"
                >
                  <span className="landing-trust-check" aria-hidden>
                    <Check className="h-3 w-3 stroke-[3] text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden min-w-0 lg:block" aria-hidden />
      </div>

      <div className="landing-shell relative z-10 mt-8 sm:mt-10 lg:hidden">
        <LandingHeroStatsBar />
      </div>

      <div className="landing-shell pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden translate-y-1/2 lg:block">
        <div className="pointer-events-auto">
          <LandingHeroStatsBar />
        </div>
      </div>
    </section>
  );
}
