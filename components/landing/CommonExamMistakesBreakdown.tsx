import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { COMMON_MARYLAND_EXAM_MISTAKES } from "@/lib/common-exam-mistakes";
import StudyWeakAreasCard from "@/components/landing/StudyWeakAreasCard";

export default function CommonExamMistakesBreakdown() {
  return (
    <div className="mt-8 space-y-10">
      {COMMON_MARYLAND_EXAM_MISTAKES.map((group) => (
        <section key={group.category}>
          <h2 className="text-xl font-bold text-md-black sm:text-2xl">
            {group.category}
          </h2>
          <p className="mt-2 text-stone-600">{group.description}</p>
          <ul className="mt-5 space-y-4">
            {group.mistakes.map((mistake) => (
              <li
                key={mistake.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-3">
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-md-black">
                      {mistake.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-700">
                      <span className="font-medium text-red-800/90">
                        What goes wrong:{" "}
                      </span>
                      {mistake.whatGoesWrong}
                    </p>
                    <p className="mt-2 text-sm text-stone-700">
                      <span className="font-medium text-green-800">
                        How to avoid:{" "}
                      </span>
                      {mistake.howToAvoid}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm sm:px-6">
        <p className="font-semibold text-md-black">Related exam guide pages</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <li>
            <Link
              href="/hardest-maryland-insurance-exam-topics"
              className="text-md-red hover:underline"
            >
              Hardest topics
            </Link>
          </li>
          <li>
            <Link
              href="/what-to-bring-to-the-maryland-insurance-exam"
              className="text-md-red hover:underline"
            >
              What to bring
            </Link>
          </li>
          <li>
            <Link
              href="/maryland-insurance-exam-format-passing-score"
              className="text-md-red hover:underline"
            >
              Format &amp; passing score
            </Link>
          </li>
          <li>
            <Link
              href="/how-to-pass-the-maryland-insurance-exam"
              className="text-md-red hover:underline"
            >
              How to pass
            </Link>
          </li>
        </ul>
      </div>

      <StudyWeakAreasCard />
    </div>
  );
}
