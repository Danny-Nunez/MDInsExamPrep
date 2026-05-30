import Link from "next/link";
import MarketingPageShell, {
  marketingMetadata,
} from "@/components/landing/MarketingPageShell";
import { FREE_SAMPLE_QUESTION_COUNT } from "@/lib/subscription";

export const metadata = marketingMetadata(
  "Maryland Insurance Practice Test",
  "Take a free 10-question Maryland Life & Health insurance sample with Prometric-style questions and instant study-mode feedback."
);

export default function PracticeTestPage() {
  return (
    <MarketingPageShell>
      <h1 className="text-3xl font-bold text-md-black">
        Maryland Insurance Practice Test
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">
        Start with a free {FREE_SAMPLE_QUESTION_COUNT}-question sample — no
        account required. Study mode gives instant explanations on every item.
        Subscribe for unlimited practice, timed exams, and AI weak-area quizzes.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/sample" className="btn-primary px-6 py-3">
          Take free {FREE_SAMPLE_QUESTION_COUNT}-question sample
        </Link>
        <Link href="/subscribe" className="btn-secondary px-6 py-3">
          View subscription
        </Link>
      </div>
    </MarketingPageShell>
  );
}
