import Link from "next/link";
import DomainProgress from "./DomainProgress";
import type { CategoryPerformance } from "@/types/quiz";

type WeakestAreasProps = {
  areas: CategoryPerformance[];
  inferredDomains?: string[];
};

export default function WeakestAreas({
  areas,
  inferredDomains = [],
}: WeakestAreasProps) {
  const weak = areas.filter((a) => a.total > 0 && a.percentage < 75);
  const planDomains = Array.from(
    new Set([
      ...weak.slice(0, 3).map((d) => d.domain),
      ...inferredDomains.slice(0, 3),
    ])
  ).slice(0, 3);

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Weakest Areas</h2>
      </div>
      <div className="p-5">
        {weak.length === 0 ? (
          <p className="text-sm text-slate-500">
            Complete a practice exam to identify weak areas.
          </p>
        ) : (
          <DomainProgress items={weak} compact />
        )}

        {inferredDomains.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              AI-inferred from uploaded results
            </p>
            <div className="flex flex-wrap gap-1.5">
              {inferredDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}

        {planDomains.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="mb-2 text-sm font-semibold text-slate-900">
              Personalized Study Plan
            </p>
            <ol className="space-y-2 text-xs text-slate-700">
              {planDomains.map((domain, idx) => (
                <li key={domain} className="rounded-md bg-slate-50 px-2 py-1.5">
                  <span className="font-semibold text-slate-900">
                    Step {idx + 1}:
                  </span>{" "}
                  Focus on <span className="font-medium">{domain}</span> with
                  a 20-question AI quiz, then review 5 flashcards in the same
                  domain and retest tomorrow.
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <Link href="/ai-quiz" className="link-accent">
                Start Focused AI Quiz →
              </Link>
              <Link href="/flashcards" className="link-accent">
                Review Flashcards →
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <Link href="/study-areas" className="link-accent text-sm">
          View All Weak Areas →
        </Link>
      </div>
    </div>
  );
}
