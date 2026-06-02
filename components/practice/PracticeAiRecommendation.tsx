import Link from "next/link";
import { Lightbulb } from "lucide-react";
import type { CategoryPerformance } from "@/types/quiz";

type PracticeAiRecommendationProps = {
  topWeakArea: CategoryPerformance | null;
};

export default function PracticeAiRecommendation({
  topWeakArea,
}: PracticeAiRecommendationProps) {
  if (!topWeakArea) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            AI Study Recommendation
          </h2>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-stone-600">
          Complete a few practice sessions and we&apos;ll recommend where to
          focus next.
        </p>
      </div>
    );
  }

  const topic = topWeakArea.subdomain ?? topWeakArea.domain;
  const params = new URLSearchParams({
    session: "study",
    count: "20",
    weakOnly: "1",
  });
  if (topWeakArea.domain) params.set("domain", topWeakArea.domain);

  return (
    <div className="flex h-full flex-col rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          AI Study Recommendation
        </h2>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-stone-600">
        <span className="font-semibold text-slate-900">Focus on {topic}.</span>{" "}
        You&apos;re scoring consistently lower on {topic} questions. We
        recommend studying this topic to improve your score.
      </p>
      <Link
        href={`/practice?${params.toString()}`}
        className="mt-4 block w-full rounded-lg bg-amber-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-600"
      >
        Start {topic.split(" ")[0]} Quiz →
      </Link>
    </div>
  );
}
