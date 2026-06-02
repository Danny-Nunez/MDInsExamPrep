import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";

export default function StudyWeakAreasCard() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-md-black">
        Practice your hardest topics in the app
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Maryland Insurance Exam tracks performance by blueprint subdomain and can
        generate AI quizzes focused on topics you miss most.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/study-areas"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-md-black hover:bg-stone-50"
        >
          <BarChart3 className="h-4 w-4 text-md-red" />
          View study areas
        </Link>
        <Link
          href="/practice#focused-practice"
          className="btn-primary inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm"
        >
          <Sparkles className="h-4 w-4" />
          AI quiz on weak areas
        </Link>
      </div>
    </div>
  );
}
