"use client";

import { useEffect, useMemo, useState } from "react";
import AIQuizGenerator from "@/components/AIQuizGenerator";
import ExamReadinessCard from "@/components/ExamReadinessCard";
import PracticeAiRecommendation from "@/components/practice/PracticeAiRecommendation";
import PracticeContinueCard, {
  PracticeContinueEmpty,
} from "@/components/practice/PracticeContinueCard";
import PracticeModeCards from "@/components/practice/PracticeModeCards";
import PracticeRecentScores from "@/components/practice/PracticeRecentScores";
import PracticeWeakAreasCard from "@/components/practice/PracticeWeakAreasCard";
import { useAuth } from "@/contexts/AuthContext";
import { getWeakestAreas } from "@/lib/domains";
import {
  getExamReadiness,
  readinessTrendText,
} from "@/lib/dashboard-stats";
import {
  getActiveQuiz,
  getActiveQuizId,
  getCategoryPerformance,
  getExamAttempts,
} from "@/lib/storage";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance, ExamAttempt, ExamImageAnalysis } from "@/types/quiz";

function buildEmptyPerformance(): CategoryPerformance[] {
  return DOMAINS.map((domain) => ({
    domain,
    correct: 0,
    total: 0,
    percentage: 0,
  }));
}

type PracticeHubProps = {
  selectedDomain?: string;
  selectedDifficulty?: string;
  weakOnly?: boolean;
};

export default function PracticeHub({
  selectedDomain = "",
  selectedDifficulty = "",
  weakOnly = false,
}: PracticeHubProps) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
  const [inferredDomains, setInferredDomains] = useState<string[]>([]);
  const [activeQuizCount, setActiveQuizCount] = useState(0);
  const [activeQuizId, setActiveQuizIdState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const filters = {
    domain: selectedDomain,
    difficulty: selectedDifficulty,
    weakOnly,
  };

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      const [examData, perfData] = await Promise.all([
        getExamAttempts(isLoggedIn),
        getCategoryPerformance(isLoggedIn),
      ]);
      setAttempts(examData);
      setPerformance(perfData.length > 0 ? perfData : buildEmptyPerformance());

      const activeQuiz = getActiveQuiz();
      setActiveQuizCount(activeQuiz?.length ?? 0);
      setActiveQuizIdState(getActiveQuizId());

      if (isLoggedIn) {
        try {
          const res = await fetch("/api/exam-image-analyses", {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            const analyses = (data.analyses as ExamImageAnalysis[]) ?? [];
            setInferredDomains(
              Array.from(
                new Set(
                  analyses
                    .flatMap((a) => a.weakAreas)
                    .sort((a, b) => b.confidence - a.confidence)
                    .map((w) => w.domain)
                )
              ).slice(0, 6)
            );
          }
        } catch {
          // optional
        }
      }
      setMounted(true);
    }

    void load();
  }, [isLoggedIn, authLoading]);

  const readiness = getExamReadiness(attempts);
  const readinessTrend = readinessTrendText(attempts, readiness);
  const weakest = getWeakestAreas(performance);
  const topWeak = weakest.find((a) => a.total > 0 && a.percentage < 75) ?? null;

  const resumeHref = useMemo(() => {
    if (activeQuizId) return "/practice?mode=ai";
    return "/practice?session=study";
  }, [activeQuizId]);

  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Loading practice center…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Practice Center
        </h1>
        <p className="mt-1 text-slate-600">
          Choose how you&apos;d like to prepare for the Maryland Life &amp;
          Health Insurance Exam.
        </p>
      </div>

      <PracticeModeCards filters={filters} />

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        {activeQuizCount > 0 ? (
          <PracticeContinueCard
            questionCount={activeQuizCount}
            resumeHref={resumeHref}
            label={
              activeQuizId ? "Focused Practice" : `Practice Exam (${activeQuizCount} Q)`
            }
          />
        ) : (
          <PracticeContinueEmpty />
        )}

        <ExamReadinessCard
          compact
          className="w-full"
          {...(readiness.unlocked
            ? { unlocked: true as const, percentage: readiness.percentage }
            : {
                unlocked: false as const,
                previewPercentage: readiness.previewPercentage,
              })}
          trendText={readinessTrend.text}
          trendPositive={readinessTrend.positive}
          action={{ href: "/study-areas", label: "View Study Plan →" }}
        />

        <PracticeWeakAreasCard areas={weakest} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <PracticeRecentScores attempts={attempts} />
        <PracticeAiRecommendation topWeakArea={topWeak} />
      </div>

      <div id="focused-practice" className="mt-8 scroll-mt-6">
        <AIQuizGenerator
          weakAreas={performance}
          suggestedDomains={inferredDomains}
        />
      </div>
    </div>
  );
}
