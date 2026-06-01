"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { getStatusLabel } from "@/lib/domains";
import { setActiveQuiz } from "@/lib/storage";
import type { ExamAttempt, ExamImageAnalysis } from "@/types/quiz";

type RecentExamsProps = {
  attempts: ExamAttempt[];
  isLoggedIn: boolean;
  onAnalysesChange?: (analyses: ExamImageAnalysis[]) => void;
};

export default function RecentExams({
  attempts,
  isLoggedIn,
  onAnalysesChange,
}: RecentExamsProps) {
  const router = useRouter();
  const recent = attempts.slice(0, 3);
  const [analyses, setAnalyses] = useState<ExamImageAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setAnalyses([]);
      return;
    }

    async function loadAnalyses() {
      try {
        setLoadingAnalyses(true);
        const res = await fetch("/api/exam-image-analyses", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        const next = (data.analyses as ExamImageAnalysis[]) ?? [];
        setAnalyses(next);
        onAnalysesChange?.(next);
      } finally {
        setLoadingAnalyses(false);
      }
    }

    loadAnalyses();
  }, [isLoggedIn, onAnalysesChange]);

  const handleFileUpload = async (file: File) => {
    if (!isLoggedIn) {
      setError("Sign in to analyze and save exam result images.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/exam-image-analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageDataUrl: dataUrl,
          fileName: file.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to analyze image.");
        return;
      }
      const analysis = data.analysis as ExamImageAnalysis;
      setAnalyses((prev) => {
        const next = [analysis, ...prev].slice(0, 10);
        onAnalysesChange?.(next);
        return next;
      });
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const generateQuizFromAnalysis = async (analysis: ExamImageAnalysis) => {
    const weakAreas = analysis.weakAreas.map((w) => w.domain);
    if (weakAreas.length === 0) {
      setError("This analysis did not identify weak areas to generate from.");
      return;
    }

    setError(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          weakAreas,
          questionCount: 20,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate quiz.");
        return;
      }
      setActiveQuiz(data.questions, data.quizId);
      router.push("/practice?mode=ai");
    } catch {
      setError("Could not generate quiz from this analysis.");
    }
  };

  return (
    <div
      id="upload"
      className="rounded-xl border border-slate-200 bg-white shadow-sm scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Recent Practice Exam Results
        </h2>
        <Link
          href="/results"
          className="link-accent text-sm"
        >
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No practice exams yet. Start a practice exam to see results here.
          </p>
        ) : (
          recent.map((attempt, i) => {
            const status = getStatusLabel(attempt.percentage);
            const date = new Date(attempt.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                key={attempt.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="text-xs text-slate-500">{date}</p>
                  <p className="font-medium text-slate-900">
                    Life &amp; Health Practice Exam #{attempts.length - i}
                  </p>
                  <p className="text-sm text-slate-500">
                    {attempt.totalQuestions} Questions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900">
                    {attempt.percentage}%
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Official Exam Result Analysis (Uploaded)
          </h3>
          <label className="btn-secondary inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-xs">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Result Image
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Upload a screenshot/photo of your actual exam result. AI will
          identify weak areas and save the analysis to your account.
        </p>
        {error && (
          <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-3">
          {loadingAnalyses ? (
            <p className="text-xs text-slate-500">Loading analyses...</p>
          ) : analyses.length === 0 ? (
            <p className="text-xs text-slate-500">
              No saved image analyses yet.
            </p>
          ) : (
            analyses.slice(0, 3).map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-xs font-medium text-slate-800">
                    {analysis.sourceImageName}
                  </p>
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-700">{analysis.summary}</p>
                {analysis.weakAreas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {analysis.weakAreas.slice(0, 3).map((w) => (
                      <span
                        key={`${analysis.id}-${w.domain}`}
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                      >
                        {w.domain}
                      </span>
                    ))}
                  </div>
                )}
                {analysis.weakAreas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => void generateQuizFromAnalysis(analysis)}
                    className="link-accent mt-2 text-xs"
                  >
                    Generate quiz from this analysis →
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <Link
          href="/results"
          className="link-accent text-sm"
        >
          View Full Exam History →
        </Link>
      </div>
    </div>
  );
}
