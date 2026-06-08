"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/LandingNav";
import SiteFooter from "@/components/landing/SiteFooter";
import QuestionCard from "@/components/QuestionCard";
import SampleTopicBreakdown from "@/components/SampleTopicBreakdown";
import { getSampleExamQuestions } from "@/lib/quizSeed";
import { buildExamAttempt } from "@/lib/scoring";
import { markSampleCompleted } from "@/lib/sample-storage";
import {
  FREE_SAMPLE_QUESTION_COUNT,
  SAMPLE_READY_THRESHOLD,
  SIGN_UP_CTA,
} from "@/lib/subscription";
import type { ExamAttempt, QuizQuestion } from "@/types/quiz";

export default function SampleExamPage() {
  const router = useRouter();
  const [questions] = useState<QuizQuestion[]>(() => getSampleExamQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

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
    const result = buildExamAttempt(questions, selectedAnswers, {
      mode: "study",
    });
    setAttempt(result);
    markSampleCompleted(result.percentage);
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

  if (finished && attempt) {
    const examReady = attempt.percentage >= SAMPLE_READY_THRESHOLD;
    return (
      <div className="flex min-h-screen flex-col bg-stone-50">
        <LandingNav />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold text-md-black">
            {examReady ? "Sample complete" : "You're not quite ready yet"}
          </h1>

          {examReady ? (
            <p className="mt-3 text-lg text-stone-600">
              You answered {FREE_SAMPLE_QUESTION_COUNT} questions with instant
              feedback. Here&apos;s your score and a breakdown of your strengths
              and weaknesses by topic.
            </p>
          ) : (
            <p className="mt-3 text-lg text-stone-600">
              Sorry — based on this {FREE_SAMPLE_QUESTION_COUNT}-question trial,
              you&apos;re not ready for the exam yet. Review your topic breakdown
              below to see where to focus next.
            </p>
          )}

          <div
            className={`mt-8 rounded-xl border bg-white p-8 text-center shadow-sm ${
              examReady ? "border-stone-200" : "border-amber-200"
            }`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-wide ${
                examReady ? "text-md-red" : "text-amber-700"
              }`}
            >
              Your score
            </p>
            <p className="mt-2 text-5xl font-bold text-md-black">
              {attempt.percentage}%
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {attempt.score} of {questions.length} correct
              {examReady
                ? ` — at or above our ${SAMPLE_READY_THRESHOLD}% readiness benchmark.`
                : ` — below the ${SAMPLE_READY_THRESHOLD}% benchmark for exam readiness.`}
            </p>
          </div>

          <SampleTopicBreakdown domainScores={attempt.domainScores} />

          {examReady ? (
            <p className="mt-6 text-stone-600">
              Unlock unlimited practice exams, AI weak-area quizzes, performance
              tracking, and timed Prometric-style simulations.
            </p>
          ) : (
            <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
              <p className="font-semibold text-slate-900">
                {SIGN_UP_CTA} to build your path to passing
              </p>
              <p className="mt-2 text-stone-600">
                Start a personalized study plan, track your progress over time,
                and get unlimited practice tests — including full timed exams and
                AI quizzes on your weak areas.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register?next=/subscribe"
              className="btn-primary btn-shimmer px-6 py-3"
            >
              {SIGN_UP_CTA}
            </Link>
            <Link href="/" className="btn-secondary px-6 py-3">
              Back to home
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const currentAnswered =
    currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <LandingNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        <Link href="/" className="link-accent text-sm">
          ← Back to home
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-md-black">
          Free {FREE_SAMPLE_QUESTION_COUNT}-question sample
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Study mode · Instant explanations · Score and topic breakdown at the end
          · No account required
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

        <p className="mt-4 text-center text-sm text-stone-500">
          Question {currentIndex + 1} of {questions.length}
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

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-40"
          >
            Previous
          </button>
          {allAnswered ? (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary px-6 py-2 text-sm"
            >
              See my results
            </button>
          ) : currentIndex < questions.length - 1 ? (
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
            <p className="max-w-48 text-right text-sm text-stone-500 sm:max-w-none">
              {currentAnswered
                ? "Review earlier questions to finish the assessment."
                : "Answer this question to continue."}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
