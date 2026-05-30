import Link from "next/link";
import MarketingPageShell, {
  marketingMetadata,
} from "@/components/landing/MarketingPageShell";
import {
  FREE_SAMPLE_QUESTION_COUNT,
  SUBSCRIPTION_PRICE_LABEL,
} from "@/lib/subscription";

export const metadata = marketingMetadata(
  "Pricing",
  `Free ${FREE_SAMPLE_QUESTION_COUNT}-question sample, then ${SUBSCRIPTION_PRICE_LABEL} for full Maryland Life & Health exam prep.`
);

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <h1 className="text-3xl font-bold text-md-black">Pricing</h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">
        Try before you subscribe — then unlock the full prep platform when
        you&apos;re ready.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Free sample
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-700">
            <li>{FREE_SAMPLE_QUESTION_COUNT} Prometric-style questions</li>
            <li>Study mode with instant feedback</li>
            <li>No credit card · No account</li>
          </ul>
          <Link href="/sample" className="btn-secondary mt-6 inline-block px-6 py-3">
            Take free sample
          </Link>
        </div>
        <div className="rounded-xl border border-md-red/30 bg-md-red-light/30 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
            Full access
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">
            {SUBSCRIPTION_PRICE_LABEL}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-stone-700">
            <li>Unlimited practice & timed exams</li>
            <li>Maryland blueprint performance tracking</li>
            <li>AI quizzes on weak subdomains</li>
            <li>Cancel anytime</li>
          </ul>
          <Link href="/subscribe" className="btn-primary mt-6 inline-block px-6 py-3">
            Subscribe
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
