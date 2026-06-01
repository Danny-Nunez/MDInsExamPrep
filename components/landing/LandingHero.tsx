import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";

type LandingHeroProps = {
  sampleHref: string;
};

const trustItems = [
  "No Credit Card Required",
  "Instant Results",
  "Trusted by Future Agents",
];

export default function LandingHero({ sampleHref }: LandingHeroProps) {
  return (
    <section className="overflow-x-clip border-b border-stone-200 bg-white lg:overflow-x-visible">
      <div className="landing-shell relative grid items-stretch gap-8 overflow-visible lg:grid-cols-[minmax(0,1.15fr)_1fr] lg:gap-10 xl:gap-14">
        <div className="relative z-10 flex min-w-0 flex-col justify-center py-10 sm:py-12 lg:py-14 xl:py-16">
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
              <Link
                href="/#how-it-works"
                className="btn-secondary inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-md-black px-4 py-3 text-sm sm:gap-2.5 sm:px-6 sm:py-3.5 sm:text-base"
                aria-label="See how it works"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-md-black sm:h-7 sm:w-7"
                  aria-hidden
                >
                  <Play className="h-2.5 w-2.5 fill-md-black text-md-black sm:h-3 sm:w-3" />
                </span>
                <span className="sm:hidden">See How</span>
                <span className="hidden sm:inline">See How It Works</span>
              </Link>
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

        <div className="landing-hero-media relative hidden min-h-0 w-full lg:block lg:-ml-10 lg:h-full lg:w-[calc(100%+2.5rem)] lg:self-stretch xl:-ml-14 xl:w-[calc(100%+3.5rem)]">
          <Image
            src="/hero.png"
            alt="Maryland State House with Maryland flag-inspired design"
            width={1402}
            height={1122}
            priority
            className="h-full w-auto max-w-none"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </div>
    </section>
  );
}
