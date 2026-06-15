import { getRecentLearningContext } from "@/lib/db/exams";
import type { ExamAttempt, ExamImageAnalysis } from "@/types/quiz";

export function buildHistoryContext(data: {
  recentAttempts: Pick<
    ExamAttempt,
    "date" | "percentage" | "domainScores" | "answers"
  >[];
  recentImageAnalyses: Pick<
    ExamImageAnalysis,
    "createdAt" | "weakAreas" | "summary"
  >[];
}): string {
  const missedByDomain = new Map<string, number>();

  for (const attempt of data.recentAttempts) {
    for (const ans of attempt.answers) {
      if (!ans.isCorrect) {
        missedByDomain.set(
          ans.domain,
          (missedByDomain.get(ans.domain) ?? 0) + 1
        );
      }
    }
  }

  const repeatedMissDomains = [...missedByDomain.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain, misses]) => `${domain} (${misses} misses)`);

  const attemptSummaries = data.recentAttempts.map((a, i) => {
    const weakest = [...a.domainScores]
      .sort((x, y) => x.percentage - y.percentage)
      .slice(0, 3)
      .map((d) => `${d.domain} ${d.percentage}%`)
      .join(", ");
    return `Attempt ${i + 1}: score ${a.percentage}%, weakest: ${weakest || "n/a"}`;
  });

  const imageInferred = data.recentImageAnalyses
    .flatMap((a) =>
      a.weakAreas.map(
        (w) => `${w.domain} (${Math.round(w.confidence * 100)}%)`
      )
    )
    .slice(0, 8);

  const parts = [
    attemptSummaries.length > 0
      ? `Recent attempts: ${attemptSummaries.join(" | ")}`
      : "",
    repeatedMissDomains.length > 0
      ? `Repeated misses by domain: ${repeatedMissDomains.join(", ")}`
      : "",
    imageInferred.length > 0
      ? `Uploaded exam-image inferred weaknesses: ${imageInferred.join(", ")}`
      : "",
  ].filter(Boolean);

  return parts.join("\n");
}

export async function getPersonalizedLearningContext(
  userId: string
): Promise<string> {
  try {
    const data = await getRecentLearningContext(userId);
    return buildHistoryContext(data);
  } catch {
    return "";
  }
}
