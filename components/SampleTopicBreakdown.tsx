import DomainProgress from "@/components/DomainProgress";
import { getStatusLabel } from "@/lib/domains";
import { WEAK_THRESHOLD } from "@/types/quiz";
import type { DomainScore } from "@/types/quiz";

type SampleTopicBreakdownProps = {
  domainScores: DomainScore[];
};

function topicLabel(score: DomainScore): string {
  return score.subdomain ?? score.domain;
}

export default function SampleTopicBreakdown({
  domainScores,
}: SampleTopicBreakdownProps) {
  const topics = [...domainScores]
    .filter((score) => score.total > 0)
    .sort((a, b) => b.percentage - a.percentage);

  const strengths = topics.filter((t) => t.percentage >= WEAK_THRESHOLD);
  const weaknesses = topics.filter((t) => t.percentage < WEAK_THRESHOLD);

  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-md-black">Performance by topic</h2>
        <p className="mt-1 text-sm text-stone-600">
          How you did on each Maryland exam topic covered in this assessment.
        </p>
        <div className="mt-4">
          <DomainProgress
            items={topics.map((score) => ({
              domain: topicLabel(score),
              correct: score.correct,
              total: score.total,
              percentage: score.percentage,
            }))}
          />
        </div>
      </div>

      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.length > 0 && (
            <div className="rounded-xl border border-green-200 bg-green-50/60 p-5">
              <h3 className="font-semibold text-green-900">Strengths</h3>
              <p className="mt-1 text-sm text-green-800/80">
                Topics where you scored {WEAK_THRESHOLD}% or higher.
              </p>
              <ul className="mt-3 space-y-2">
                {strengths.map((score) => {
                  const label = topicLabel(score);
                  const status = getStatusLabel(score.percentage);
                  return (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="font-medium text-green-950">{label}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        {score.percentage}% · {score.correct}/{score.total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
              <h3 className="font-semibold text-amber-950">Focus areas</h3>
              <p className="mt-1 text-sm text-amber-900/80">
                Topics to review before test day — sign up for unlimited practice
                and AI quizzes on these areas.
              </p>
              <ul className="mt-3 space-y-2">
                {weaknesses.map((score) => {
                  const label = topicLabel(score);
                  const status = getStatusLabel(score.percentage);
                  return (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="font-medium text-amber-950">{label}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        {score.percentage}% · {score.correct}/{score.total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
