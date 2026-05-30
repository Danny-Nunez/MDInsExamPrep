import Link from "next/link";
import MarketingPageShell, {
  marketingMetadata,
} from "@/components/landing/MarketingPageShell";
import { loginWithRedirect } from "@/lib/routes";

export const metadata = marketingMetadata(
  "Maryland Insurance Exam Questions",
  "Practice Maryland Life & Health licensing exam questions with Prometric-style scenarios, four answer choices, and clear explanations."
);

export default function ExamQuestionsPage() {
  return (
    <MarketingPageShell>
      <h1 className="text-3xl font-bold text-md-black">
        Maryland Insurance Exam Questions
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">
        Build confidence with original practice items—scenario-based when
        possible, four choices, and explanations that teach the licensing
        concepts behind each answer. Questions are organized by Maryland blueprint
        domain and subdomain.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={loginWithRedirect("/quiz")} className="btn-primary px-6 py-3">
          Question bank quiz
        </Link>
        <Link href="/#features" className="btn-secondary px-6 py-3">
          See features
        </Link>
      </div>
    </MarketingPageShell>
  );
}
