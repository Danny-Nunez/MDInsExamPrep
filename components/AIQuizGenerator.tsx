"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MARYLAND_BLUEPRINT } from "@/lib/marylandBlueprint";
import {
  aggregateSubdomainPerformance,
  groupStudyAreasByDomain,
} from "@/lib/studyAreas";
import { getExamAttempts, setActiveQuiz } from "@/lib/storage";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance, QuizQuestion } from "@/types/quiz";

type AIQuizGeneratorProps = {
  weakAreas: CategoryPerformance[];
  suggestedDomains?: string[];
};

const QUESTION_OPTIONS = [10, 15, 20, 25, 50];
const STORAGE_KEY = "examPrep_aiQuizSelections";
const ALL_SUBDOMAIN_NAMES = MARYLAND_BLUEPRINT.map((b) => b.subdomain);

function subdomainsForDomains(domains: string[]): string[] {
  return MARYLAND_BLUEPRINT.filter((b) => domains.includes(b.domain)).map(
    (b) => b.subdomain
  );
}

export default function AIQuizGenerator({
  weakAreas,
  suggestedDomains = [],
}: AIQuizGeneratorProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [subdomainStats, setSubdomainStats] = useState<CategoryPerformance[]>(
    []
  );
  const [selectedSubdomains, setSelectedSubdomains] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedPersisted, setLoadedPersisted] = useState(false);
  const [statsReady, setStatsReady] = useState(false);

  const grouped = useMemo(
    () => groupStudyAreasByDomain(subdomainStats),
    [subdomainStats]
  );

  const statsMap = useMemo(
    () =>
      new Map(
        subdomainStats.map((s) => [
          s.subdomain ?? s.domain,
          s,
        ])
      ),
    [subdomainStats]
  );

  const defaultWeakSubdomains = useMemo(() => {
    const fromSubdomains = subdomainStats
      .filter((a) => a.subdomain && a.total > 0 && a.percentage < 75)
      .map((a) => a.subdomain!);
    if (fromSubdomains.length > 0) return fromSubdomains;

    const weakDomains = weakAreas
      .filter((a) => a.total > 0 && a.percentage < 75)
      .map((a) => a.domain);
    if (weakDomains.length > 0) return subdomainsForDomains(weakDomains);

    if (suggestedDomains.length > 0) {
      return subdomainsForDomains(suggestedDomains);
    }

    return ALL_SUBDOMAIN_NAMES.slice(0, 8);
  }, [subdomainStats, weakAreas, suggestedDomains]);

  useEffect(() => {
    getExamAttempts(isLoggedIn)
      .then((attempts) =>
        setSubdomainStats(aggregateSubdomainPerformance(attempts))
      )
      .finally(() => setStatsReady(true));
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setLoadedPersisted(true);
        return;
      }
      const parsed = JSON.parse(raw) as {
        selectedSubdomains?: string[];
        selectedDomains?: string[];
        questionCount?: number;
      };

      if (Array.isArray(parsed.selectedSubdomains)) {
        const valid = parsed.selectedSubdomains.filter((s) =>
          ALL_SUBDOMAIN_NAMES.includes(s)
        );
        if (valid.length > 0) setSelectedSubdomains(valid);
      } else if (Array.isArray(parsed.selectedDomains)) {
        const migrated = subdomainsForDomains(
          parsed.selectedDomains.filter((d) =>
            DOMAINS.includes(d as (typeof DOMAINS)[number])
          )
        );
        if (migrated.length > 0) setSelectedSubdomains(migrated);
      }

      if (
        typeof parsed.questionCount === "number" &&
        QUESTION_OPTIONS.includes(parsed.questionCount)
      ) {
        setQuestionCount(parsed.questionCount);
      }
    } catch {
      // ignore corrupt local storage values
    } finally {
      setLoadedPersisted(true);
    }
  }, []);

  useEffect(() => {
    if (!loadedPersisted || !statsReady) return;
    if (selectedSubdomains.length === 0) {
      setSelectedSubdomains(defaultWeakSubdomains);
    }
  }, [loadedPersisted, statsReady, defaultWeakSubdomains, selectedSubdomains.length]);

  useEffect(() => {
    if (!loadedPersisted) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedSubdomains, questionCount })
    );
  }, [selectedSubdomains, questionCount, loadedPersisted]);

  const toggleSubdomain = (subdomain: string) => {
    setSelectedSubdomains((prev) =>
      prev.includes(subdomain)
        ? prev.filter((s) => s !== subdomain)
        : [...prev, subdomain]
    );
  };

  const toggleDomainGroup = (domain: string, subdomains: string[]) => {
    const allSelected = subdomains.every((s) => selectedSubdomains.includes(s));
    if (allSelected) {
      setSelectedSubdomains((prev) =>
        prev.filter((s) => !subdomains.includes(s))
      );
    } else {
      setSelectedSubdomains((prev) => [
        ...new Set([...prev, ...subdomains]),
      ]);
    }
  };

  const handleGenerate = async () => {
    if (selectedSubdomains.length === 0) {
      setError("Select at least one topic.");
      return;
    }

    const weakAreasForApi = [
      ...new Set(
        MARYLAND_BLUEPRINT.filter((b) =>
          selectedSubdomains.includes(b.subdomain)
        ).map((b) => b.domain)
      ),
    ];

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          weakAreas: weakAreasForApi,
          subdomains: selectedSubdomains,
          questionCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to generate quiz.");
        return;
      }

      const questions = data.questions as QuizQuestion[];
      const quizId = data.quizId as string | undefined;
      const source = data.source as string | undefined;
      setActiveQuiz(questions, quizId);
      if (source === "bank") {
        setError(null);
      }
      router.push(
        source === "bank" ? "/practice?mode=ai&source=bank" : "/practice?mode=ai"
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai-generator"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Sparkles className="h-5 w-5 text-md-red" />
        <h2 className="font-semibold text-slate-900">Focused Practice</h2>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            Select Topics
          </p>
          <p className="mb-3 text-xs text-slate-500">
            {MARYLAND_BLUEPRINT.length} Maryland exam topics across {DOMAINS.length}{" "}
            domains
          </p>
          <div className="max-h-72 space-y-4 overflow-y-auto rounded-lg border border-slate-100 p-2">
            {grouped.map(({ domain, subdomains }) => {
              const names = subdomains
                .map((s) => s.subdomain)
                .filter(Boolean) as string[];
              const allInGroup =
                names.length > 0 &&
                names.every((n) => selectedSubdomains.includes(n));

              return (
                <div key={domain}>
                  <button
                    type="button"
                    onClick={() => toggleDomainGroup(domain, names)}
                    className="mb-1.5 flex w-full items-center gap-2 rounded px-1 text-left text-xs font-semibold uppercase tracking-wide text-md-red hover:bg-md-red-light/40"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={allInGroup}
                      className="pointer-events-none h-3.5 w-3.5 rounded accent-md-red"
                    />
                    {domain}
                  </button>
                  <div className="space-y-1 pl-1">
                    {subdomains.map((area) => {
                      const name = area.subdomain ?? area.domain;
                      const stat = statsMap.get(name) ?? area;
                      return (
                        <label
                          key={name}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:border-slate-100 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubdomains.includes(name)}
                            onChange={() => toggleSubdomain(name)}
                            className="h-4 w-4 shrink-0 rounded border-stone-300 text-md-red accent-md-red"
                          />
                          <span className="flex-1 text-sm text-slate-800">
                            {name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {stat.total > 0
                              ? `${stat.percentage}%`
                              : "No data"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {selectedSubdomains.length} topic
            {selectedSubdomains.length === 1 ? "" : "s"} selected
          </p>
        </div>

        <div>
          <label
            htmlFor="question-count"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Number of Questions
          </label>
          <select
            id="question-count"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {QUESTION_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} Questions
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-3 text-sm disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Building your set..." : "Start Focused Practice"}
        </button>

        <div className="rounded-lg border border-md-gold/30 bg-md-gold-light px-4 py-3 text-xs text-stone-800">
          Pulls from your full practice library first, then generates new items only
          when needed.
          {isLoggedIn
            ? " Quizzes and results are saved to your account."
            : " Sign in to save progress and unlock the full library."}
        </div>
      </div>
    </div>
  );
}
