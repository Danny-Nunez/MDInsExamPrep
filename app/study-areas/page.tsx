"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import DomainProgress from "@/components/DomainProgress";
import StudyAreaGroups from "@/components/StudyAreaGroups";
import { useAuth } from "@/contexts/AuthContext";
import {
  aggregateSubdomainPerformance,
  groupStudyAreasByDomain,
} from "@/lib/studyAreas";
import { getCategoryPerformance, getExamAttempts } from "@/lib/storage";
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

export default function StudyAreasPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [performance, setPerformance] = useState<CategoryPerformance[]>(
    buildEmptyPerformance()
  );
  const [subdomainAreas, setSubdomainAreas] = useState<CategoryPerformance[]>(
    []
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    Promise.all([
      getCategoryPerformance(isLoggedIn),
      getExamAttempts(isLoggedIn),
    ])
      .then(([perf, attempts]) => {
        setPerformance(perf.length > 0 ? perf : buildEmptyPerformance());
        setSubdomainAreas(aggregateSubdomainPerformance(attempts));
      })
      .finally(() => setMounted(true));
  }, [isLoggedIn, authLoading]);

  const groupedAreas = useMemo(
    () => groupStudyAreasByDomain(subdomainAreas),
    [subdomainAreas]
  );

  const weakDomains = useMemo(
    () =>
      [...performance]
        .filter((d) => d.total > 0 && d.percentage < 75)
        .sort((a, b) => a.percentage - b.percentage),
    [performance]
  );

  const weakSubdomains = useMemo(
    () =>
      [...subdomainAreas]
        .filter((d) => d.total > 0 && d.percentage < 75)
        .sort((a, b) => a.percentage - b.percentage),
    [subdomainAreas]
  );

  const strongestSubdomains = useMemo(
    () =>
      [...subdomainAreas]
        .filter((d) => d.total > 0)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5),
    [subdomainAreas]
  );

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading study areas...
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
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Study Areas</h1>
          <p className="mt-1 text-slate-600">
            Topics follow the Maryland exam blueprint. Scores update as you
            answer practice questions tagged by subdomain (e.g. Annuities, COBRA).
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Topic Performance (by subdomain)
              </h2>
              <StudyAreaGroups groups={groupedAreas} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Domain Summary
              </h2>
              <DomainProgress items={performance} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-900">Focus First</h3>
              {weakSubdomains.length === 0 && weakDomains.length === 0 ? (
                <p className="mt-2 text-sm text-amber-800">
                  No weak topics yet. Take a practice exam to build your study
                  list.
                </p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-amber-900">
                  {weakSubdomains.slice(0, 6).map((d) => (
                    <li key={`${d.domain}-${d.subdomain}`}>
                      {d.subdomain} ({d.percentage}%)
                    </li>
                  ))}
                  {weakSubdomains.length === 0 &&
                    weakDomains.slice(0, 4).map((d) => (
                      <li key={d.domain}>
                        {d.domain} ({d.percentage}%)
                      </li>
                    ))}
                </ul>
              )}
              <Link
                href="/practice#focused-practice"
                className="link-accent mt-3 inline-block text-sm"
              >
                Start focused practice →
              </Link>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <h3 className="font-semibold text-green-900">Strengths</h3>
              {strongestSubdomains.length === 0 ? (
                <p className="mt-2 text-sm text-green-800">
                  No scored topics yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-green-900">
                  {strongestSubdomains.map((d) => (
                    <li key={`${d.domain}-${d.subdomain}`}>
                      {d.subdomain} ({d.percentage}%)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
