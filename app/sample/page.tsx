"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import QuestionCard from "@/components/QuestionCard";
import { getSampleExamQuestions } from "@/lib/quizSeed";
import { buildExamAttempt } from "@/lib/scoring";
import { markSampleCompleted } from "@/lib/sample-storage";
import {
  FREE_SAMPLE_QUESTION_COUNT,
  SUBSCRIPTION_PRICE_LABEL,
} from "@/lib/subscription";
import type { QuizQuestion } from "@/types/quiz";
import { PASS_THRESHOLD } from "@/types/quiz";

export default function SampleExamPage() {
  const router = useRouter();
  const [questions] = useState<QuizQuestion[]>(() => getSampleExamQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [finished, setFinished] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;

  const correctCount = useMemo(
    () =>
      Object.entries(selectedAnswers).filter(
        ([id, ans]) =>
          questions.find((q) => q.id === id)?.correctAnswer === ans
      ).length,
    [selectedAnswers, questions]
  );

  const handleSelect = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers((prev) => {
      if (prev[questionId] !== undefined) return prev;
      return { ...prev, [questionId]: answer };
    });
  }, []);

  const handleFinish = () => {
    const attempt = buildExamAttempt(questions, selectedAnswers, {
      mode: "study",
    });
    setScorePercent(attempt.percentage);
    markSampleCompleted(attempt.percentage);
    setFinished(true);
  };

  useEffect(() => {
    if (finished) {
      router.prefetch("/subscribe");
    }
  }, [finished, router]);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Loading sample exam...
      </div>
    );
  }

  if (finished) {
    const passed = scorePercent >= PASS_THRESHOLD;
    return (
      <div className="min-h-screen bg-stone-50">
        <LandingNav />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold text-md-black">Sample complete</h1>
          <p className="mt-3 text-lg text-stone-600">
            You answered {FREE_SAMPLE_QUESTION_COUNT} questions with instant
            feedback — the same study mode you get with a full subscription.
          </p>
          <div className="mt-8 rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
              Your score
            </p>
            <p className="mt-2 text-5xl font-bold text-md-black">
              {scorePercent}%
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {correctCount} of {questions.length} correct
              {passed ? " — at or above the 75% pass target." : "."}
            </p>
          </div>
          <p className="mt-6 text-stone-600">
            Unlock unlimited practice exams, AI weak-area quizzes, performance
            tracking, and timed Prometric-style simulations for{" "}
            {SUBSCRIPTION_PRICE_LABEL}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/subscribe" className="btn-primary px-6 py-3">
              Subscribe — {SUBSCRIPTION_PRICE_LABEL}
            </Link>
            <Link href="/" className="btn-secondary px-6 py-3">
              Back to home
            </Link>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  const currentAnswered =
    currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-stone-50">
      <LandingNav />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <Link href="/" className="link-accent text-sm">
          ← Back to home
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-md-black">
          Free {FREE_SAMPLE_QUESTION_COUNT}-question sample
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Study mode · Instant explanations · No account required
        </p>

        <div className="mb-6 mt-6 h-2 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full bg-md-red transition-all"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            onSelect={(answer) => handleSelect(currentQuestion.id, answer)}
            studyMode
          />
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-40"
          >
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              disabled={!currentAnswered}
              onClick={() =>
                setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
            >
              Next question
            </button>
          ) : (
            <span className="text-sm text-stone-500">Last question</span>
          )}
        </div>

        <div className="sticky bottom-0 mt-8 rounded-xl border border-stone-200 bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-stone-600">
              Answered {answeredCount} of {questions.length}
              {answeredCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-green-700">
                    {correctCount} correct so far
                  </span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleFinish}
              disabled={!allAnswered}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              See my score
            </button>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
