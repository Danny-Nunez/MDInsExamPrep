import { HARDEST_MARYLAND_TOPICS } from "@/lib/hardest-exam-topics";
import ExamOutlineWeightsTable from "@/components/landing/ExamOutlineWeightsTable";
import StudyWeakAreasCard from "@/components/landing/StudyWeakAreasCard";

export default function HardestTopicsBreakdown() {
  return (
    <div className="space-y-8">
      <ExamOutlineWeightsTable />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950 sm:px-6">
        <p className="font-semibold">How this list was built</p>
        <p className="mt-1 leading-relaxed">
          Topics below reflect Prometric&apos;s published Life &amp; Health combo outline
          weights (exam code <strong>2030</strong>), plus patterns commonly cited by
          licensing prep providers and student forums. Your exam may emphasize different
          subtopics—use practice scores to prioritize what is hardest for you.
        </p>
      </div>

      <ol className="space-y-4">
        {HARDEST_MARYLAND_TOPICS.map((topic) => (
          <li
            key={topic.rank}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-md-red text-sm font-bold text-white">
                {topic.rank}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-md-black">{topic.title}</h3>
                {topic.examWeight && (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-md-red">
                    {topic.examWeight}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-700">
              <span className="font-semibold text-md-black">Why it&apos;s tough: </span>
              {topic.whyHard}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              <span className="font-semibold text-md-black">Study approach: </span>
              {topic.studyTip}
            </p>
            {topic.subdomains && topic.subdomains.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {topic.subdomains.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      <StudyWeakAreasCard />
    </div>
  );
}
