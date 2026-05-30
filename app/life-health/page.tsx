import Link from "next/link";
import MarketingPageShell, {
  marketingMetadata,
} from "@/components/landing/MarketingPageShell";

export const metadata = marketingMetadata(
  "Maryland Life & Health Insurance Exam Prep",
  "Study for the Maryland Life, Accident, Health & Sickness Producer exam with blueprint-aligned practice and Prometric-style questions."
);

export default function LifeHealthPage() {
  return (
    <MarketingPageShell>
      <h1 className="text-3xl font-bold text-md-black">
        Maryland Life &amp; Health Insurance Exam Prep
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">
        Maryland Insurance Exam helps Life, Accident, Health &amp; Sickness
        Producer candidates practice with Prometric-style scenarios, subdomain
        performance tracking, and AI quizzes tied to the Maryland licensing
        blueprint.
      </p>
      <ul className="mt-6 list-inside list-disc space-y-2 text-stone-700">
        <li>Life insurance, annuities, and policy provisions</li>
        <li>Accident, health, disability, and long-term care</li>
        <li>Maryland insurance regulation and federal rules</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/sample" className="btn-primary px-6 py-3">
          Take a Sample Exam
        </Link>
        <Link href="/" className="btn-secondary px-6 py-3">
          Back to home
        </Link>
      </div>
    </MarketingPageShell>
  );
}
