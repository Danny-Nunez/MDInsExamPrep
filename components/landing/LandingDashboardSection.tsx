import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import LandingMacbookDashboard from "@/components/landing/LandingMacbookDashboard";

const bullets = [
  "Readiness score",
  "Weak topics",
  "Study plan",
  "Uploaded reports",
];

export default function LandingDashboardSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-stone-200 bg-gradient-to-b from-white to-stone-50 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:py-28 lg:pt-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,20rem)_minmax(0,1.2fr)] xl:gap-10 2xl:grid-cols-[minmax(0,21rem)_minmax(0,1.3fr)]">
          <div className="min-w-0 lg:max-w-[19rem] xl:max-w-[20rem]">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-md-red">
              Your dashboard
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-md-black sm:text-4xl lg:text-[2.15rem] xl:text-4xl">
              Know Exactly Where You Stand
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600 lg:mt-5">
              See your readiness, weak topics, study plan, and uploaded reports
              in one place.
            </p>
            <ul className="mt-6 space-y-3 lg:mt-7 lg:space-y-2.5">
              {bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-stone-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-md-gold" />
                  <span className="text-base leading-snug lg:text-[0.95rem] xl:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-9 lg:gap-x-7">
              <Link
                href="/sample"
                className="link-accent text-base font-semibold"
              >
                Try the free sample →
              </Link>
              <Link
                href="/pricing"
                className="text-base font-semibold text-stone-600 transition-colors hover:text-md-red"
              >
                See pricing →
              </Link>
            </div>
          </div>

          <div className="min-w-0 w-full lg:-mr-2 xl:-mr-4">
            <LandingMacbookDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
