import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import LandingHeroMockup from "@/components/landing/LandingHeroMockup";

const bullets = [
  "Exam readiness score at a glance",
  "Weak areas by Maryland licensing domain",
  "Recent practice and AI quiz history",
  "Recommendations tied to your actual gaps",
];

export default function LandingDashboardSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-stone-200 bg-stone-50 py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 min-w-0 w-full max-w-full overflow-hidden lg:order-1">
          <LandingHeroMockup />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-bold uppercase tracking-wide text-md-red">
            Your dashboard
          </p>
          <h2 className="mt-2 text-3xl font-bold text-md-black sm:text-4xl">
            Know Exactly Where You Stand
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Every practice exam, AI quiz, and uploaded score report feeds one
            performance view—so you always know what to study next.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-stone-700"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-md-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/sample" className="link-accent text-base font-semibold">
              Try the free sample →
            </Link>
            <Link href="/pricing" className="text-base font-semibold text-stone-600 hover:text-md-red">
              See pricing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
