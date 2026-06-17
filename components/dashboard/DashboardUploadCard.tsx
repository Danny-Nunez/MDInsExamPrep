"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { setActiveQuiz } from "@/lib/storage";
import { weakAreaDisplayLabel } from "@/lib/prometric-score-report";
import type { ExamImageAnalysis } from "@/types/quiz";
import DeleteExamAnalysisModal from "@/components/dashboard/DeleteExamAnalysisModal";

type DashboardUploadCardProps = {
  analyses?: ExamImageAnalysis[];
  onAnalysisComplete?: (analysis: ExamImageAnalysis) => void;
  onAnalysisDeleted?: (analysisId: string) => void;
};

async function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function DashboardUploadCard({
  analyses = [],
  onAnalysisComplete,
  onAnalysisDeleted,
}: DashboardUploadCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExamImageAnalysis | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [justUploadedId, setJustUploadedId] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!isLoggedIn) return "Sign in to upload a score report.";
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return "Please upload a PDF, JPG, or PNG file.";
    }
    if (!file.type.startsWith("image/")) {
      return "PDF upload coming soon — use JPG or PNG for now.";
    }
    return null;
  };

  const analyzeFile = async (file: File): Promise<ExamImageAnalysis> => {
    const dataUrl = await readImageFile(file);
    const res = await fetch("/api/exam-image-analyses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ imageDataUrl: dataUrl, fileName: file.name }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Upload failed.");
    }
    return data.analysis as ExamImageAnalysis;
  };

  const deleteAnalysis = async (analysisId: string) => {
    const res = await fetch(`/api/exam-image-analyses/${analysisId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Failed to delete.");
    }
    onAnalysisDeleted?.(analysisId);
    if (justUploadedId === analysisId) setJustUploadedId(null);
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    setJustUploadedId(null);
    try {
      const analysis = await analyzeFile(file);
      setJustUploadedId(analysis.id);
      onAnalysisComplete?.(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (file: File) => {
    const replaceId = replaceTargetId;
    if (!replaceId) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setReplaceTargetId(null);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const analysis = await analyzeFile(file);
      await deleteAnalysis(replaceId);
      setJustUploadedId(analysis.id);
      onAnalysisComplete?.(analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Replace failed. Please try again."
      );
    } finally {
      setUploading(false);
      setReplaceTargetId(null);
    }
  };

  const handleDelete = (analysis: ExamImageAnalysis) => {
    setError(null);
    setPendingDelete(analysis);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeletingId(pendingDelete.id);
    setError(null);
    try {
      await deleteAnalysis(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const generateQuizFromAnalysis = async (analysis: ExamImageAnalysis) => {
    const weakAreas = analysis.weakAreas.map((w) => w.domain);
    if (weakAreas.length === 0) {
      setError("No weak areas were identified — try a clearer screenshot.");
      return;
    }

    setError(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ weakAreas, questionCount: 20 }),
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

  const busy = uploading || deletingId !== null;

  return (
    <div
      id="upload"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <Upload className="mt-0.5 h-5 w-5 shrink-0 text-md-red" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900">Upload Score Report</h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload a failed exam report and we&apos;ll map weak areas to your
            study plan.
          </p>
        </div>
      </div>
      <label className="btn-primary mt-4 flex w-full cursor-pointer items-center justify-center gap-2 py-2.5 text-sm">
        {uploading && !replaceTargetId ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing…
          </>
        ) : (
          "Upload Report"
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleReplace(file);
          e.target.value = "";
        }}
      />
      <p className="mt-2 text-xs text-slate-500">JPG or PNG (PDF soon)</p>
      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-2 py-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
      {!isLoggedIn && (
        <p className="mt-2 text-sm text-slate-600">
          <Link href="/login" className="link-accent">
            Sign in
          </Link>{" "}
          to save uploads.
        </p>
      )}

      {analyses.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Saved reports ({analyses.length})
          </p>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {analyses.map((analysis) => {
              const isDeleting = deletingId === analysis.id;
              const isReplacing =
                uploading && replaceTargetId === analysis.id;

              return (
                <div
                  key={analysis.id}
                  className={`rounded-lg border p-3 ${
                    analysis.id === justUploadedId
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {analysis.id === justUploadedId && (
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-green-800">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Analysis complete
                    </p>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {analysis.sourceImageName}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setReplaceTargetId(analysis.id);
                          replaceInputRef.current?.click();
                        }}
                        className="rounded px-2 py-1 text-[11px] font-medium text-md-red hover:bg-md-red-light/60 disabled:opacity-50"
                      >
                        {isReplacing ? "…" : "Replace"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(analysis)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${analysis.sourceImageName}`}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    {analysis.summary}
                  </p>
                  {analysis.weakAreas.length > 0 ? (
                    <>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {analysis.weakAreas.map((w) => (
                          <span
                            key={`${analysis.id}-${w.reportDomain ?? w.domain}`}
                            className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                            title={w.issue}
                          >
                            {weakAreaDisplayLabel(w)}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => void generateQuizFromAnalysis(analysis)}
                        className="link-accent mt-2 text-left text-xs"
                      >
                        Generate quiz from weak areas →
                      </button>
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      No specific weak areas detected — try Replace with a
                      clearer score breakdown.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <DeleteExamAnalysisModal
        open={pendingDelete !== null}
        fileName={pendingDelete?.sourceImageName ?? null}
        loading={deletingId !== null}
        onClose={() => {
          if (deletingId === null) setPendingDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
