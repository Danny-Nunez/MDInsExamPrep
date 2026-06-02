"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcomeHeader from "@/components/DashboardWelcomeHeader";
import ExamReadinessCard from "@/components/ExamReadinessCard";
import MetricTrendCard from "@/components/MetricTrendCard";
import WeakestAreas from "@/components/WeakestAreas";
import DashboardFocusedPracticeCard from "@/components/dashboard/DashboardFocusedPracticeCard";
import DashboardProgressOverview from "@/components/dashboard/DashboardProgressOverview";
import DashboardQuickLinks from "@/components/dashboard/DashboardQuickLinks";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";
import DashboardStudyPlanPreview from "@/components/dashboard/DashboardStudyPlanPreview";
import DashboardUpcomingStudy from "@/components/dashboard/DashboardUpcomingStudy";
import DashboardUploadCard from "@/components/dashboard/DashboardUploadCard";
import { DOMAINS } from "@/types/quiz";
import type {
  CategoryPerformance,
  ExamAttempt,
  ExamImageAnalysis,
} from "@/types/quiz";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCategoryPerformance,
  getExamAttempts,
} from "@/lib/storage";
import { getWeakestAreas } from "@/lib/domains";
import {
  computePracticeStreak,
  shouldShowPracticeStreak,
} from "@/lib/practice-streak";
import { aggregateSubdomainPerformance } from "@/lib/studyAreas";
import {
  averageScoreTrendText,
  computeAverageScore,
  computeCorrectAnswerRate,
  correctRateTrendText,
  getExamReadiness,
  quizzesTakenCardContent,
  readinessTrendText,
} from "@/lib/dashboard-stats";

function buildEmptyPerformance(): CategoryPerformance[] {
  return DOMAINS.map((domain) => ({
    domain,
    correct: 0,
    total: 0,
    percentage: 0,
  }));
}

export default function DashboardPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
  const [subdomainPerformance, setSubdomainPerformance] = useState<
    CategoryPerformance[]
  >([]);
  const [imageAnalyses, setImageAnalyses] = useState<ExamImageAnalysis[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      const [examData, perfData] = await Promise.all([
        getExamAttempts(isLoggedIn),
        getCategoryPerformance(isLoggedIn),
      ]);
      setAttempts(examData);
      setPerformance(
        perfData.length > 0 ? perfData : buildEmptyPerformance()
      );
      setSubdomainPerformance(aggregateSubdomainPerformance(examData));

      if (isLoggedIn) {
        try {
          const res = await fetch("/api/exam-image-analyses", {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            setImageAnalyses((data.analyses as ExamImageAnalysis[]) ?? []);
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
  const correctRate = computeCorrectAnswerRate(performance);
  const avgScore = computeAverageScore(attempts);
  const readinessTrend = readinessTrendText(attempts, readiness);
  const correctTrend = correctRateTrendText(attempts, performance);
  const quizzesCard = quizzesTakenCardContent(attempts, readiness);
  const avgTrend = averageScoreTrendText(attempts);
  const weakest = getWeakestAreas(performance);
  const inferredDomains = Array.from(
    new Set(
      imageAnalyses
        .flatMap((a) => a.weakAreas)
        .sort((a, b) => b.confidence - a.confidence)
        .map((w) => w.domain)
    )
  ).slice(0, 6);

  const upcomingStudyItems = useMemo(
    () =>
      [...subdomainPerformance]
        .filter((a) => a.total > 0 && a.percentage < 75)
        .sort((a, b) => a.percentage - b.percentage),
    [subdomainPerformance]
  );

  const studyPlanAreas = useMemo(
    () =>
      upcomingStudyItems.length > 0
        ? upcomingStudyItems
        : [...weakest].filter((a) => a.total > 0),
    [upcomingStudyItems, weakest]
  );

  const practiceStreak = computePracticeStreak(attempts);
  const showStreak = shouldShowPracticeStreak(practiceStreak, isLoggedIn);

  const handleAnalysisComplete = (analysis: ExamImageAnalysis) => {
    setImageAnalyses((prev) => [analysis, ...prev].slice(0, 10));
  };

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto min-w-0 max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
        <DashboardWelcomeHeader
          userName={user?.name}
          userEmail={user?.email}
          userId={user?.userId ?? null}
          streak={practiceStreak}
          showStreak={showStreak}
        />

        {!isLoggedIn && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <Link href="/login" className="link-accent font-semibold">
              Sign in
            </Link>{" "}
            to save exams and progress to your account. Guest data stays in this
            browser only.
          </div>
        )}

        {/* Row 1 — readiness, metrics, focused practice */}
        <div className="mb-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <div className="flex h-full min-w-0 lg:col-span-3">
            <ExamReadinessCard
              compact
              className="w-full"
              {...(readiness.unlocked
                ? {
                    unlocked: true as const,
                    percentage: readiness.percentage,
                  }
                : {
                    unlocked: false as const,
                    previewPercentage: readiness.previewPercentage,
                  })}
              trendText={readinessTrend.text}
              trendPositive={readinessTrend.positive}
            />
          </div>
          <div className="grid min-w-0 auto-rows-fr grid-cols-1 gap-4 min-[420px]:grid-cols-3 lg:col-span-5">
            <MetricTrendCard
              compact
              title="Correct Answer Rate"
              value={`${correctRate}%`}
              trend={correctTrend?.text}
              trendPositive={correctTrend?.positive}
            />
            <MetricTrendCard
              compact
              title="Quizzes Taken"
              value={quizzesCard.value}
              trend={quizzesCard.trend}
              trendPositive={quizzesCard.trendPositive}
            />
            <MetricTrendCard
              compact
              title="Avg. Score"
              value={attempts.length > 0 ? `${avgScore}%` : "—"}
              trend={avgTrend?.text}
              trendPositive={avgTrend?.positive}
            />
          </div>
          <div className="flex h-full min-w-0 lg:col-span-4">
            <DashboardFocusedPracticeCard className="w-full" />
          </div>
        </div>

        {/* Row 2 — weak areas, activity, upcoming study */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <WeakestAreas
            compact
            areas={weakest}
            inferredDomains={inferredDomains}
          />
          <DashboardRecentActivity attempts={attempts} />
          <div className="md:col-span-2 xl:col-span-1">
            <DashboardUpcomingStudy items={upcomingStudyItems} />
          </div>
        </div>

        {/* Row 3 — study plan, progress, upload + links */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <DashboardStudyPlanPreview weakAreas={studyPlanAreas} />
          </div>
          <div className="lg:col-span-5">
            <DashboardProgressOverview
              attempts={attempts}
              performance={performance}
            />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4">
            <DashboardUploadCard onAnalysisComplete={handleAnalysisComplete} />
            <DashboardQuickLinks />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
