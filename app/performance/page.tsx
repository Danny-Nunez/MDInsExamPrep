"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import DomainProgress from "@/components/DomainProgress";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryPerformance, getExamAttempts } from "@/lib/storage";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance, ExamAttempt } from "@/types/quiz";

function buildEmptyPerformance(): CategoryPerformance[] {
  return DOMAINS.map((domain) => ({
    domain,
    correct: 0,
    total: 0,
    percentage: 0,
  }));
}

export default function PerformancePage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    Promise.all([getExamAttempts(isLoggedIn), getCategoryPerformance(isLoggedIn)])
      .then(([examData, perfData]) => {
        setAttempts(examData);
        setPerformance(perfData.length > 0 ? perfData : buildEmptyPerformance());
      })
      .finally(() => setMounted(true));
  }, [isLoggedIn, authLoading]);

  const averageScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.round(
      attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
    );
  }, [attempts]);

  const bestScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => a.percentage));
  }, [attempts]);

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading performance...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="link-accent text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Performance</h1>
          <p className="mt-1 text-slate-600">
            Track your trend over time and use domain analytics to target your
            next study block.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Exams Completed</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {attempts.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Average Score</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {averageScore}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Best Score</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{bestScore}%</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">
              Category Performance
            </h2>
            <DomainProgress items={performance} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-900">Recent Trend</h2>
            {attempts.length === 0 ? (
              <p className="text-sm text-slate-500">
                No attempts yet. Start a practice exam to build your trend.
              </p>
            ) : (
              <div className="space-y-3">
                {attempts.slice(0, 8).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="text-sm text-slate-600">
                      {new Date(attempt.date).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {attempt.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/results" className="link-accent mt-4 inline-block text-sm">
              View full exam history →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
