import Link from "next/link";
import MarketingPageShell, {
  marketingMetadata,
} from "@/components/landing/MarketingPageShell";
import { COURSE_BASE_PATH } from "@/lib/course";
import {
  FREE_SAMPLE_QUESTION_COUNT,
  SIGN_UP_CTA,
  SUBSCRIPTION_PRICE_AMOUNT,
  SUBSCRIPTION_PRICE_LABEL,
} from "@/lib/subscription";

const courseRegisterNext = encodeURIComponent(COURSE_BASE_PATH);

export const metadata = marketingMetadata(
  "Pricing",
  `Free sample and Maryland insurance course with saved progress on a free account. ${SUBSCRIPTION_PRICE_LABEL} for unlimited practice exams and AI study tools.`
);

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <h1 className="text-3xl font-bold text-md-black">Pricing</h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">
        Start free with a sample or the full course curriculum. Create a free
        account to save course progress — subscription is only for practice exams
        and the full study app.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Free sample
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-700">
            <li>{FREE_SAMPLE_QUESTION_COUNT} Prometric-style questions</li>
            <li>Study mode with instant feedback</li>
            <li>Topic strengths & weaknesses breakdown</li>
            <li>No credit card · No account</li>
          </ul>
          <Link href="/sample" className="btn-secondary mt-6 inline-block px-6 py-3">
            Take free sample
          </Link>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-md-gold/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
            Free course
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">$0</p>
          <p className="text-xs text-stone-500">Free account · No subscription</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-700">
            <li>15-module Maryland Life & Health curriculum</li>
            <li>Video lessons with transcripts</li>
            <li>Save course progress across devices</li>
            <li>Track completed lessons with a free account</li>
          </ul>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={COURSE_BASE_PATH}
              className="btn-secondary inline-block px-6 py-3 text-center"
            >
              Browse free course
            </Link>
            <Link
              href={`/register?next=${courseRegisterNext}`}
              className="text-center text-sm font-semibold text-md-red hover:underline"
            >
              Create free account to save progress
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-md-red/30 bg-md-red-light/30 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
            Full access
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">
            {SUBSCRIPTION_PRICE_AMOUNT}
          </p>
          <p className="text-xs text-stone-500">Billed monthly · Cancel anytime</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-700">
            <li>Unlimited practice & timed exams</li>
            <li>Maryland blueprint performance tracking</li>
            <li>AI quizzes on weak subdomains</li>
            <li>Everything in the free course, plus full app</li>
          </ul>
          <Link
            href="/register?next=/subscribe"
            className="btn-primary btn-shimmer mt-6 inline-block px-6 py-3"
          >
            {SIGN_UP_CTA}
          </Link>
        </div>
      </div>
      <p className="mt-6 text-sm text-stone-500">
        <Link href="/" className="text-md-red hover:underline">
          ← Back to home
        </Link>
      </p>
    </MarketingPageShell>
  );
}
