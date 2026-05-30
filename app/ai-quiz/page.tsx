"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import AIQuizGenerator from "@/components/AIQuizGenerator";
import AreasOfImprovement from "@/components/AreasOfImprovement";
import { useAuth } from "@/contexts/AuthContext";
import { aggregateSubdomainPerformance } from "@/lib/studyAreas";
import { getCategoryPerformance, getExamAttempts } from "@/lib/storage";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance, ExamImageAnalysis } from "@/types/quiz";

function buildEmptyPerformance(): CategoryPerformance[] {
  return DOMAINS.map((domain) => ({
    domain,
    correct: 0,
    total: 0,
    percentage: 0,
  }));
}

export default function AIQuizPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
  const [subdomainPerformance, setSubdomainPerformance] = useState<
    CategoryPerformance[]
  >([]);
  const [inferredDomains, setInferredDomains] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      const [perf, attempts] = await Promise.all([
        getCategoryPerformance(isLoggedIn),
        getExamAttempts(isLoggedIn),
      ]);
      setPerformance(perf.length > 0 ? perf : buildEmptyPerformance());
      setSubdomainPerformance(aggregateSubdomainPerformance(attempts));

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

    load();
  }, [isLoggedIn, authLoading]);

  const suggestedDomains = useMemo(() => {
    const fromTopics = subdomainPerformance
      .filter((a) => a.total > 0 && a.percentage < 75 && a.domain)
      .map((a) => a.domain);
    return Array.from(new Set([...fromTopics, ...inferredDomains])).slice(0, 6);
  }, [subdomainPerformance, inferredDomains]);

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading AI quiz tools...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="link-accent text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            AI Quiz Generator
          </h1>
          <p className="mt-1 text-slate-600">
            Build custom quizzes from your weak topics so each practice set
            targets what will raise your score fastest.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIQuizGenerator
              weakAreas={performance}
              suggestedDomains={suggestedDomains}
            />
          </div>
          <div>
            <AreasOfImprovement
              subdomainPerformance={subdomainPerformance}
              domainPerformance={performance}
              inferredDomains={inferredDomains}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
