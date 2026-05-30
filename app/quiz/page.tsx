"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import QuestionCard from "@/components/QuestionCard";
import { bankQuestionToQuiz, recordBankProgress } from "@/lib/bank-quiz";
import { buildExamAttempt } from "@/lib/scoring";
import { useAuth } from "@/contexts/AuthContext";
import { saveExamAttempt } from "@/lib/storage";
import type { BankQuizQuestion } from "@/types/question-bank";
import type { QuizQuestion } from "@/types/quiz";
import { DOMAINS, PASS_THRESHOLD } from "@/types/quiz";

function BankQuizContent() {
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [conceptIds, setConceptIds] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const domain = searchParams.get("domain") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";
  const weakOnly = searchParams.get("weakOnly") === "1";
  const count = searchParams.get("count") ?? "20";

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ limit: count });
    if (domain) params.set("domain", domain);
    if (difficulty) params.set("difficulty", difficulty);
    if (weakOnly) params.set("weakOnly", "1");

    const res = await fetch(`/api/quiz/bank?${params}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not load quiz.");
      setLoading(false);
      return;
    }
    if (data.message) setInfo(data.message);
    const raw = (data.questions ?? []) as Array<
      BankQuizQuestion & { conceptId: string }
    >;
    const idMap: Record<string, string> = {};
    const mapped = raw.map((q) => {
      idMap[q.id] = q.conceptId;
      return bankQuestionToQuiz(q);
    });
    setConceptIds(idMap);
    setQuestions(mapped);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setLoading(false);
  }, [count, domain, difficulty, weakOnly]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const current = questions[currentIndex];

  const handleSelect = (questionId: string, answer: string) => {
    if (selectedAnswers[questionId] !== undefined) return;
    const q = questions.find((x) => x.id === questionId);
    const isCorrect = q?.correctAnswer === answer;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));

    const conceptId = conceptIds[questionId];
    if (conceptId && isCorrect !== undefined) {
      void recordBankProgress(conceptId, isCorrect);
    }
  };

  const handleSubmit = async () => {
    const attempt = buildExamAttempt(questions, selectedAnswers, {
      mode: "study",
    });
    await saveExamAttempt(attempt, isLoggedIn, { source: "seed", questions });
    sessionStorage.setItem("lastExamAttempt", JSON.stringify(attempt));
    sessionStorage.setItem("lastExamQuestions", JSON.stringify(questions));
    window.location.href = "/results";
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Loading approved questions…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/dashboard" className="link-accent text-sm">
        ← Dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Question bank quiz</h1>
      <p className="mt-1 text-sm text-slate-600">
        Approved questions only · Pass {PASS_THRESHOLD}%
      </p>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-medium text-slate-500">Domain</span>
          <Link
            href={`/quiz?${new URLSearchParams({ count, ...(difficulty && { difficulty }), ...(weakOnly && { weakOnly: "1" }) }).toString()}`}
            className={`rounded-lg border px-3 py-1.5 text-xs ${!domain ? "border-md-red bg-md-red-light text-md-red-dark" : "border-slate-200"}`}
          >
            All
          </Link>
          {DOMAINS.map((d) => (
            <Link
              key={d}
              href={`/quiz?${new URLSearchParams({ domain: d, count, ...(difficulty && { difficulty }), ...(weakOnly && { weakOnly: "1" }) }).toString()}`}
              className={`rounded-lg border px-3 py-1.5 text-xs ${domain === d ? "border-md-red bg-md-red-light text-md-red-dark" : "border-slate-200"}`}
            >
              {d.replace(" Insurance", "").replace("Maryland ", "MD ")}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-medium text-slate-500">Difficulty</span>
          {["", "easy", "medium", "hard", "prometric"].map((d) => (
            <Link
              key={d || "all"}
              href={`/quiz?${new URLSearchParams({ count, ...(domain && { domain }), ...(weakOnly && { weakOnly: "1" }), ...(d && { difficulty: d }) }).toString()}`}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${difficulty === d || (!difficulty && !d) ? "border-md-red bg-md-red-light text-md-red-dark" : "border-slate-200"}`}
            >
              {d || "All"}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/quiz?${new URLSearchParams({ count, ...(domain && { domain }), ...(difficulty && { difficulty }) }).toString()}`}
            className={`rounded-lg border px-3 py-1.5 text-xs ${!weakOnly ? "border-md-red bg-md-red-light text-md-red-dark" : "border-slate-200"}`}
          >
            All topics
          </Link>
          <Link
            href={`/quiz?${new URLSearchParams({ weakOnly: "1", count, ...(domain && { domain }), ...(difficulty && { difficulty }) }).toString()}`}
            className={`rounded-lg border px-3 py-1.5 text-xs ${weakOnly ? "border-md-red bg-md-red-light text-md-red-dark" : "border-slate-200"}`}
          >
            Weak areas
          </Link>
          <button
            type="button"
            onClick={loadQuiz}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
          >
            Shuffle
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && !error && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {info}
        </p>
      )}

      {questions.length > 0 && current && (
        <>
          <div className="mt-6">
            <QuestionCard
              question={current}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswers[current.id]}
              onSelect={(answer) => handleSelect(current.id, answer)}
              studyMode
            />
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                disabled={!selectedAnswers[current.id]}
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedAnswers).length !== questions.length
                }
                className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
              >
                Finish
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function BankQuizPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<p className="p-8 text-slate-500">Loading…</p>}>
        <BankQuizContent />
      </Suspense>
    </DashboardLayout>
  );
}
