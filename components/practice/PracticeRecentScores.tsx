import Link from "next/link";
import type { ExamAttempt } from "@/types/quiz";

function attemptTypeLabel(attempt: ExamAttempt): string {
  if (attempt.mode === "exam") {
    return attempt.totalQuestions >= 50 ? "Full Exam" : "Simulation";
  }
  if (attempt.totalQuestions <= 10) return "Quick Quiz";
  return "Study Mode";
}

function scoreColor(pct: number): string {
  if (pct >= 75) return "text-green-600";
  if (pct >= 60) return "text-amber-600";
  return "text-red-600";
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type PracticeRecentScoresProps = {
  attempts: ExamAttempt[];
};

export default function PracticeRecentScores({
  attempts,
}: PracticeRecentScoresProps) {
  const recent = attempts.slice(0, 4);

  return (
    <div className="min-w-0 rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Recent Scores
      </h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-stone-600">
          Your recent practice scores will appear here.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-stone-500">
                <th className="pb-2 pr-3 font-medium">Test</th>
                <th className="pb-2 pr-3 font-medium">Type</th>
                <th className="pb-2 pr-3 font-medium">Score</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((attempt, index) => (
                <tr
                  key={attempt.id}
                  className="border-b border-stone-50 last:border-0"
                >
                  <td className="py-2.5 pr-3 font-medium text-stone-800">
                    Practice Exam #{attempts.length - index}
                  </td>
                  <td className="py-2.5 pr-3 text-stone-600">
                    {attemptTypeLabel(attempt)}
                  </td>
                  <td
                    className={`py-2.5 pr-3 font-bold tabular-nums ${scoreColor(attempt.percentage)}`}
                  >
                    {attempt.percentage}%
                  </td>
                  <td className="py-2.5 text-stone-500">
                    {formatDate(attempt.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link
        href="/results"
        className="mt-3 inline-block text-sm font-medium text-md-red hover:underline"
      >
        View all results →
      </Link>
    </div>
  );
}
