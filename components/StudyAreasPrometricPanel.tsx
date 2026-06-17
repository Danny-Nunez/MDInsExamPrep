"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileWarning, Loader2 } from "lucide-react";
import { getScoreColor } from "@/lib/domains";
import { weakAreaDisplayLabel } from "@/lib/prometric-score-report";
import { setActiveQuiz } from "@/lib/storage";
import type { ExamImageAnalysis, ExamImageWeakArea } from "@/types/quiz";

type StudyAreasPrometricPanelProps = {
  analyses: ExamImageAnalysis[];
};

function collectWeakAreas(analyses: ExamImageAnalysis[]): ExamImageWeakArea[] {
  const seen = new Set<string>();
  const areas: ExamImageWeakArea[] = [];

  for (const analysis of analyses) {
    for (const area of analysis.weakAreas) {
      const key = area.reportDomain ?? area.domain;
      if (seen.has(key)) continue;
      seen.add(key);
      areas.push(area);
    }
  }

  return areas.sort(
    (a, b) => (a.scorePercent ?? 100) - (b.scorePercent ?? 100)
  );
}

export default function StudyAreasPrometricPanel({
  analyses,
}: StudyAreasPrometricPanelProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latest = analyses[0];
  const weakAreas = collectWeakAreas(analyses);

  if (analyses.length === 0 || weakAreas.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900">Prometric score report</h3>
        <p className="mt-2 text-sm text-slate-600">
          Upload a failed exam report on your dashboard to see section scores
          here.
        </p>
        <Link
          href="/dashboard#upload"
          className="link-accent mt-3 inline-block text-sm"
        >
          Upload score report →
        </Link>
      </div>
    );
  }

  const generateQuiz = async () => {
    const studyDomains = Array.from(
      new Set(weakAreas.map((w) => w.domain))
    );
    if (studyDomains.length === 0) return;

    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ weakAreas: studyDomains, questionCount: 20 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate quiz.");
        return;
      }
      setActiveQuiz(data.questions, data.quizId);
      router.push("/practice?mode=ai");
    } catch {
      setError("Could not generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-xl border border-md-red/20 bg-md-red-light/30 p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-md-red" />
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            From Prometric score report
          </h3>
          {latest && (
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {latest.sourceImageName} ·{" "}
              {new Date(latest.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {latest?.summary && (
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {latest.summary}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {weakAreas.map((area) => {
          const score = area.scorePercent ?? null;
          const label = area.reportDomain ?? area.domain;
          return (
            <li key={label}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-slate-800">{label}</span>
                {score != null && (
                  <span className="shrink-0 font-semibold text-amber-700">
                    {score}%
                  </span>
                )}
              </div>
              {score != null && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/80">
                  <div
                    className={`h-full rounded-full ${getScoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-slate-500">{area.recommendation}</p>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void generateQuiz()}
        disabled={generating}
        className="btn-primary mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm disabled:opacity-60"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Building quiz…
          </>
        ) : (
          "Generate quiz from weak areas"
        )}
      </button>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <Link href="/dashboard#upload" className="link-accent">
          Manage uploads
        </Link>
        {analyses.length > 1 && (
          <span className="text-slate-500">
            {analyses.length} reports saved
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-md-red/10 pt-3">
        {weakAreas.map((w) => (
          <span
            key={w.reportDomain ?? w.domain}
            className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
            title={w.issue}
          >
            {weakAreaDisplayLabel(w)}
          </span>
        ))}
      </div>
    </div>
  );
}
