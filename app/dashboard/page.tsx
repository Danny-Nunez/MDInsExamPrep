"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ExamReadinessCard from "@/components/ExamReadinessCard";
import MetricTrendCard from "@/components/MetricTrendCard";
import DomainProgress from "@/components/DomainProgress";
import RecentExams from "@/components/RecentExams";
import WeakestAreas from "@/components/WeakestAreas";
import AIQuizGenerator from "@/components/AIQuizGenerator";
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
import { APP_TAGLINE } from "@/lib/branding";
import { getWeakestAreas } from "@/lib/domains";
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
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
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
          // no-op; dashboard still works without this data
        }
      }
      setMounted(true);
    }

    load();
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
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Practice Exam Dashboard
            </h1>
            <p className="mt-1 text-slate-600">{APP_TAGLINE}</p>
          </div>
          <p className="text-sm text-slate-500">{today}</p>
        </header>

        {!isLoggedIn && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <Link href="/login" className="link-accent font-semibold">
              Sign in
            </Link>{" "}
            to save exams and progress to your account. Guest data stays in this
            browser only.
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/practice?session=study"
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Study Mode
          </Link>
          <Link
            href="/practice?session=exam"
            className="rounded-lg border border-md-red bg-md-red px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Exam Simulation
          </Link>
          <Link
            href="/practice?session=exam&prometric=1"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Prometric (60 Q)
          </Link>
          <Link
            href="/ai-quiz"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Generate AI Quiz
          </Link>
        </div>

        <div className="mb-6 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 w-full sm:col-span-2 lg:col-span-1">
          <ExamReadinessCard
            compact
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
          <MetricTrendCard
            title="Correct Answer Rate"
            value={`${correctRate}%`}
            trend={correctTrend?.text}
            trendPositive={correctTrend?.positive}
          />
          <MetricTrendCard
            title="Quizzes Taken"
            value={quizzesCard.value}
            subtitle={quizzesCard.subtitle}
            trend={quizzesCard.trend}
            trendPositive={quizzesCard.trendPositive}
          />
          <MetricTrendCard
            title="Avg. Score"
            value={attempts.length > 0 ? `${avgScore}%` : "—"}
            trend={avgTrend?.text}
            trendPositive={avgTrend?.positive}
          />
        </div>

        <div className="mb-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <RecentExams
              attempts={attempts}
              isLoggedIn={isLoggedIn}
              onAnalysesChange={setImageAnalyses}
            />
          </div>
          <div className="min-w-0">
            <WeakestAreas areas={weakest} inferredDomains={inferredDomains} />
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div
            id="categories"
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Category Progress</h2>
            </div>
            <div className="p-5">
              <DomainProgress items={performance} />
            </div>
            <div className="border-t border-slate-100 px-5 py-3">
              <Link href="/performance" className="text-sm font-medium text-md-red">
                View Detailed Performance →
              </Link>
            </div>
          </div>
          <AIQuizGenerator
            weakAreas={performance}
            suggestedDomains={inferredDomains}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Crosshair className="mt-0.5 h-5 w-5 shrink-0 text-md-red" />
              <div>
                <p className="font-semibold text-slate-900">Study Tip</p>
                <p className="mt-1 text-sm text-slate-600">
                  Focus on your weakest areas first. Consistent practice and
                  review are the keys to passing your exam!
                </p>
              </div>
            </div>
            <Link
              href="/practice"
              className="shrink-0 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              View Study Plan
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
