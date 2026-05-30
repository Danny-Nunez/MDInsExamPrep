import {
  COMBO_EXAM_STATS,
  LIFE_HEALTH_COMBO_OUTLINE,
} from "@/lib/exam-outline-weights";

const categoryColors: Record<string, string> = {
  regulation: "bg-md-red",
  life: "bg-amber-500",
  health: "bg-sky-500",
  general: "bg-stone-400",
};

export default function ExamOutlineWeightsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 bg-stone-50 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-md-black">
          Exam 2030 outline weights (Life &amp; Health combo)
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          {COMBO_EXAM_STATS.scoredQuestions} scored questions ·{" "}
          {COMBO_EXAM_STATS.timeMinutes} minutes · {COMBO_EXAM_STATS.passingPercent}%
          to pass (~{COMBO_EXAM_STATS.passingCorrect} correct)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-100 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3 sm:px-6">Section</th>
              <th className="px-4 py-3 text-right">Questions</th>
              <th className="px-4 py-3 text-right sm:px-6">% of exam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {LIFE_HEALTH_COMBO_OUTLINE.map((row) => (
              <tr
                key={row.section}
                className={
                  row.percent >= 8 || row.category === "regulation"
                    ? "bg-md-red-light/30"
                    : ""
                }
              >
                <td className="px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${categoryColors[row.category]}`}
                      aria-hidden
                    />
                    <span
                      className={
                        row.category === "regulation"
                          ? "font-semibold text-md-black"
                          : "text-stone-800"
                      }
                    >
                      {row.section}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-stone-700">
                  {row.questions}
                </td>
                <td className="px-4 py-3 text-right font-medium sm:px-6">
                  {row.percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-stone-100 px-4 py-3 text-xs text-stone-500 sm:px-6">
        Highlighted rows are high-weight or state regulation. Download the current
        outline from Prometric before you study.
      </p>
    </div>
  );
}
