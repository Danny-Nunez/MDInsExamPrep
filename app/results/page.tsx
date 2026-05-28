"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import ExamReview from "@/components/ExamReview";
import DomainProgress from "@/components/DomainProgress";
import { useAuth } from "@/contexts/AuthContext";
import { getExamAttempts } from "@/lib/storage";
import type { ExamAttempt, QuizQuestion } from "@/types/quiz";
import { PASS_THRESHOLD } from "@/types/quiz";

export default function ResultsPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const storedAttempt = sessionStorage.getItem("lastExamAttempt");
    const storedQuestions = sessionStorage.getItem("lastExamQuestions");

    if (storedAttempt) {
      setAttempt(JSON.parse(storedAttempt) as ExamAttempt);
    }
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions) as QuizQuestion[]);
    }

    getExamAttempts(isLoggedIn).then(setHistory).finally(() => setMounted(true));
  }, [isLoggedIn, authLoading]);

  if (!mounted || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading results...
        </div>
      </DashboardLayout>
    );
  }

  const displayAttempt = attempt ?? history[0];

  if (!displayAttempt) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">No Results Yet</h1>
          <p className="mt-2 text-slate-600">
            Complete a practice exam to see your scores.
          </p>
          <Link
            href="/practice"
            className="btn-primary mt-6 inline-block px-6 py-2.5 text-sm"
          >
            Start Practice Exam
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const passed = displayAttempt.percentage >= PASS_THRESHOLD;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="link-accent text-sm"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Exam Results</p>
          <p className="mt-2 text-5xl font-bold text-slate-900">
            {displayAttempt.percentage}%
          </p>
          <p className="mt-2 text-lg text-slate-600">
            {displayAttempt.score} of {displayAttempt.totalQuestions} correct
          </p>
          <span
            className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
              passed
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {passed ? "PASS" : "FAIL"} — {PASS_THRESHOLD}% required to pass
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">
            Performance by Category
          </h2>
          <DomainProgress
            items={displayAttempt.domainScores.map((d) => ({
              domain: d.domain,
              correct: d.correct,
              total: d.total,
              percentage: d.percentage,
            }))}
          />
        </div>

        {history.length > 1 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Exam History</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {history.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm text-slate-500">
                      {new Date(a.date).toLocaleString()}
                    </p>
                    <p className="text-slate-800">
                      {a.score}/{a.totalQuestions} correct
                    </p>
                  </div>
                  <span className="text-xl font-bold text-slate-900">
                    {a.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showReview && questions.length > 0 && (
          <div className="mt-6">
            <ExamReview attempt={displayAttempt} questions={questions} />
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div
            className={`grid gap-3 ${
              questions.length > 0
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {questions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="btn-primary w-full px-5 py-2.5 text-sm"
              >
                {showReview ? "Hide Review" : "Show Answer Review"}
              </button>
            )}
            <Link
              href="/practice"
              className="btn-primary inline-flex w-full items-center justify-center px-5 py-2.5 text-sm"
            >
              Take Another Exam
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
