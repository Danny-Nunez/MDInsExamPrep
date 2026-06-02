"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import PracticeHub from "@/components/PracticeHub";
import QuestionCard from "@/components/QuestionCard";
import {
  DEFAULT_PRACTICE_LENGTH,
  getPracticeExamQuestions,
  getPrometricExamQuestions,
  PROMETRIC_EXAM_LENGTH,
} from "@/lib/quizSeed";
import { buildExamAttempt } from "@/lib/scoring";
import { useAuth } from "@/contexts/AuthContext";
import {
  clearActiveQuiz,
  getActiveQuiz,
  getActiveQuizId,
  saveExamAttempt,
  setActiveQuiz,
} from "@/lib/storage";
import type { QuizQuestion } from "@/types/quiz";
import { PASS_THRESHOLD } from "@/types/quiz";

type LayoutMode = "one" | "full";
type SessionMode = "study" | "exam";

const EXAM_MINUTES = 120;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PracticeExamContent() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const isAiMode = searchParams.get("mode") === "ai";
  const sessionMode: SessionMode =
    searchParams.get("session") === "exam" ? "exam" : "study";
  const isPrometricPreset = searchParams.get("prometric") === "1";

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("one");
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [quizSource, setQuizSource] = useState<"bank" | "seed" | "ai" | null>(
    null
  );

  const studyMode = sessionMode === "study";

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      const aiQuiz = getActiveQuiz();
      if (isAiMode && aiQuiz && aiQuiz.length > 0) {
        if (!cancelled) {
          setQuestions(aiQuiz);
          setQuizSource("ai");
          setMounted(true);
        }
        return;
      }

      const count = isPrometricPreset
        ? PROMETRIC_EXAM_LENGTH
        : Number(searchParams.get("count")) || DEFAULT_PRACTICE_LENGTH;

      if (isLoggedIn) {
        const params = new URLSearchParams({ count: String(count) });
        if (isPrometricPreset) params.set("prometric", "1");
        const domain = searchParams.get("domain");
        const difficulty = searchParams.get("difficulty");
        if (domain) params.set("domain", domain);
        if (difficulty) params.set("difficulty", difficulty);
        if (searchParams.get("weakOnly") === "1") params.set("weakOnly", "1");
        const res = await fetch(`/api/quiz/practice?${params}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const fromBank = (data.questions ?? []) as QuizQuestion[];
          if (!cancelled && fromBank.length > 0) {
            setQuestions(fromBank);
            setActiveQuiz(fromBank);
            setQuizSource(data.source === "bank" ? "bank" : "seed");
            setMounted(true);
            if (sessionMode === "exam") {
              setTimerRunning(true);
              setStartedAt(Date.now());
            }
            return;
          }
        }
      }

      const fallback = isPrometricPreset
        ? getPrometricExamQuestions(PROMETRIC_EXAM_LENGTH)
        : getPracticeExamQuestions(count);
      if (!cancelled) {
        setQuestions(fallback);
        setActiveQuiz(fallback);
        setQuizSource("seed");
        setMounted(true);
        if (sessionMode === "exam") {
          setTimerRunning(true);
          setStartedAt(Date.now());
        }
      }
    }

    void loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [isAiMode, isPrometricPreset, searchParams, sessionMode, isLoggedIn]);

  useEffect(() => {
    if (!timerRunning || sessionMode !== "exam") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, sessionMode]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSelect = useCallback(
    (questionId: string, answer: string) => {
      setSelectedAnswers((prev) => {
        if (prev[questionId] !== undefined && studyMode) return prev;
        if (prev[questionId] !== undefined && !studyMode) {
          return { ...prev, [questionId]: answer };
        }
        return { ...prev, [questionId]: answer };
      });
    },
    [studyMode]
  );

  const toggleMark = (id: string) => {
    setMarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentAnswered =
    currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;

  const handleSubmit = async () => {
    const timeSpentSeconds =
      startedAt != null
        ? Math.round((Date.now() - startedAt) / 1000)
        : undefined;
    const attempt = buildExamAttempt(questions, selectedAnswers, {
      mode: sessionMode,
      timeSpentSeconds,
    });
    await saveExamAttempt(attempt, isLoggedIn, {
      source: isAiMode ? "ai" : "seed",
      quizId: getActiveQuizId() ?? undefined,
      questions,
    });
    sessionStorage.setItem("lastExamAttempt", JSON.stringify(attempt));
    sessionStorage.setItem("lastExamQuestions", JSON.stringify(questions));
    clearActiveQuiz();
    router.push("/results");
  };

  if (!mounted || questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading exam...
        </div>
      </DashboardLayout>
    );
  }

  if (showReviewScreen) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">Review before submit</h1>
          <p className="mt-1 text-sm text-slate-500">
            {answeredCount} answered · {markedIds.size} marked for review
          </p>
          <ul className="mt-6 space-y-2">
            {questions.map((q, i) => {
              const answered = selectedAnswers[q.id] !== undefined;
              const marked = markedIds.has(q.id);
              return (
                <li
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <span>
                    Q{i + 1}: {answered ? "Answered" : "Unanswered"}
                    {marked && " · Flagged"}
                  </span>
                  <button
                    type="button"
                    className="text-md-red hover:underline"
                    onClick={() => {
                      setCurrentIndex(i);
                      setShowReviewScreen(false);
                    }}
                  >
                    Go to question
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setShowReviewScreen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Back to exam
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered && sessionMode === "study"}
              className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
            >
              Submit exam
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/practice" className="link-accent text-sm">
              ← Practice Exams
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {isAiMode
                ? "Focused Practice"
                : sessionMode === "exam"
                  ? isPrometricPreset
                    ? "Prometric Simulation"
                    : "Exam Simulation"
                  : "Study Mode"}
            </h1>
            <p className="text-sm text-slate-500">
              {questions.length} questions · Pass {PASS_THRESHOLD}% ·{" "}
              {sessionMode === "exam"
                ? "No feedback until submit"
                : "Instant feedback after each answer"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {sessionMode === "exam" && (
              <span
                className={`rounded-lg px-3 py-1.5 text-sm font-mono font-semibold ${
                  secondsLeft < 600
                    ? "bg-red-100 text-red-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {formatTime(secondsLeft)}
              </span>
            )}
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-sm">
              <button
                type="button"
                onClick={() => setLayoutMode("one")}
                className={`rounded-md px-3 py-1.5 font-medium ${
                  layoutMode === "one"
                    ? "bg-md-red text-white"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                One at a time
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("full")}
                className={`rounded-md px-3 py-1.5 font-medium ${
                  layoutMode === "full"
                    ? "bg-md-red text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Full exam
              </button>
            </div>
          </div>
        </div>

        {layoutMode === "one" && (
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-md-red transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        )}

        {layoutMode === "one" ? (
          <>
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswers[currentQuestion.id]}
                onSelect={(answer) =>
                  handleSelect(currentQuestion.id, answer)
                }
                studyMode={studyMode}
                markedForReview={markedIds.has(currentQuestion.id)}
                onToggleReview={
                  sessionMode === "exam"
                    ? () => toggleMark(currentQuestion.id)
                    : undefined
                }
              />
            )}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  disabled={!currentAnswered && studyMode}
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1)
                    )
                  }
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next Question
                </button>
              ) : (
                <span className="text-sm text-slate-500">
                  Last question — review or submit
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={i + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswers[q.id]}
                onSelect={(answer) => handleSelect(q.id, answer)}
                studyMode={studyMode}
                markedForReview={markedIds.has(q.id)}
                onToggleReview={
                  sessionMode === "exam" ? () => toggleMark(q.id) : undefined
                }
              />
            ))}
          </div>
        )}

        <div className="sticky bottom-0 mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Answered {answeredCount} of {questions.length}
              {studyMode && answeredCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-green-600">
                    {
                      Object.entries(selectedAnswers).filter(
                        ([id, ans]) =>
                          questions.find((q) => q.id === id)?.correctAnswer ===
                          ans
                      ).length
                    }{" "}
                    correct
                  </span>
                </>
              )}
            </p>
            <div className="flex gap-2">
              {sessionMode === "exam" && (
                <button
                  type="button"
                  onClick={() => setShowReviewScreen(true)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
                >
                  Review all
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  sessionMode === "exam"
                    ? setShowReviewScreen(true)
                    : handleSubmit()
                }
                disabled={
                  sessionMode === "study" ? !allAnswered : answeredCount === 0
                }
                className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {sessionMode === "exam" ? "Finish exam" : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PracticePageRouter() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");
  const isAiMode = searchParams.get("mode") === "ai";

  if (!session && !isAiMode) {
    return (
      <DashboardLayout>
        <PracticeHub
          selectedDomain={searchParams.get("domain") ?? ""}
          selectedDifficulty={searchParams.get("difficulty") ?? ""}
          weakOnly={searchParams.get("weakOnly") === "1"}
        />
      </DashboardLayout>
    );
  }

  return <PracticeExamContent />;
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex min-h-screen items-center justify-center text-slate-500">
            Loading...
          </div>
        </DashboardLayout>
      }
    >
      <PracticePageRouter />
    </Suspense>
  );
}
