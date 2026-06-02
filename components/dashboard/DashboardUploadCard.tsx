"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { ExamImageAnalysis } from "@/types/quiz";

type DashboardUploadCardProps = {
  onAnalysisComplete?: (analysis: ExamImageAnalysis) => void;
};

export default function DashboardUploadCard({
  onAnalysisComplete,
}: DashboardUploadCardProps) {
  const { isLoggedIn } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!isLoggedIn) {
      setError("Sign in to upload a score report.");
      return;
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Please upload a PDF, JPG, or PNG file.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("PDF upload coming soon — use JPG or PNG for now.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/exam-image-analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageDataUrl: dataUrl, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onAnalysisComplete?.(data.analysis as ExamImageAnalysis);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
        {uploading ? (
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
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
      <p className="mt-2 text-xs text-slate-500">JPG or PNG (PDF soon)</p>
      {error && (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      )}
      {!isLoggedIn && (
        <p className="mt-2 text-sm text-slate-600">
          <Link href="/login" className="link-accent">
            Sign in
          </Link>{" "}
          to save uploads.
        </p>
      )}
    </div>
  );
}
