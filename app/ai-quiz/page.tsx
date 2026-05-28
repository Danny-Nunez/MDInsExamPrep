"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import AIQuizGenerator from "@/components/AIQuizGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryPerformance } from "@/lib/storage";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance } from "@/types/quiz";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    getCategoryPerformance(isLoggedIn)
      .then((perf) =>
        setPerformance(perf.length > 0 ? perf : buildEmptyPerformance())
      )
      .finally(() => setMounted(true));
  }, [isLoggedIn, authLoading]);

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
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="link-accent text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            AI Quiz Generator
          </h1>
          <p className="mt-1 text-slate-600">
            Build custom quizzes from your weak domains so each practice set is
            focused on what will raise your score fastest.
          </p>
        </div>
        <AIQuizGenerator weakAreas={performance} />
      </div>
    </DashboardLayout>
  );
}
