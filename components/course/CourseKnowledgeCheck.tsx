"use client";

import { useMemo, useState } from "react";
import type { CourseKnowledgeCheck } from "@/lib/course/types";

type CourseKnowledgeCheckProps = {
  knowledgeCheck: CourseKnowledgeCheck;
  /** Embedded inside lesson media tabs — lighter chrome. */
  variant?: "standalone" | "embedded";
};

export default function CourseKnowledgeCheck({
  knowledgeCheck,
  variant = "standalone",
}: CourseKnowledgeCheckProps) {
  const embedded = variant === "embedded";
  const { title = "Knowledge Check", questions } = knowledgeCheck;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  /** Index of current question, or `questions.length` on the results screen. */
  const [step, setStep] = useState(0);

  const onResults = step >= questions.length;
  const currentQuestion = !onResults ? questions[step] : null;
  const selected = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answered = selected !== undefined;
  const isCorrect =
    currentQuestion && selected === currentQuestion.correctAnswer;

  const correctCount = useMemo(
    () =>
      questions.filter((q) => answers[q.id] === q.correctAnswer).length,
    [answers, questions]
  );

  const handleSelect = (choice: string) => {
    if (!currentQuestion || answered) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, questions.length));
  };

  const handleRetry = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <section
      id="knowledge-check"
      className={
        embedded
          ? "scroll-mt-24"
          : "mt-10 scroll-mt-24 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      }
      aria-labelledby="knowledge-check-heading"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
        {title}
      </p>
      <h2
        id="knowledge-check-heading"
        className={`font-bold text-md-black ${
          embedded ? "mt-1 text-lg sm:text-xl" : "mt-1 text-xl sm:text-2xl"
        }`}
      >
        {onResults ? "Your results" : "Check your understanding"}
      </h2>

      {!onResults && (
        <>
          <p className="mt-2 text-sm text-stone-600">
            Answer each question, then continue to the next.
          </p>

          <div className="mt-4 flex items-center gap-2">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index < step
                    ? "bg-md-red"
                    : index === step
                      ? "bg-md-gold"
                      : "bg-stone-200"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-2 text-sm font-medium text-stone-500">
            Question {step + 1} of {questions.length}
          </p>
        </>
      )}

      {onResults ? (
        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 px-5 py-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Your score
          </p>
          <p className="mt-2 text-4xl font-bold text-md-black">
            {correctCount} / {questions.length}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            {correctCount === questions.length
              ? "Great work — you're ready for the next lesson."
              : "Review the lesson and try again when you're ready."}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="btn-secondary mt-5 px-5 py-2.5 text-sm"
          >
            Try again
          </button>
        </div>
      ) : (
        currentQuestion && (
          <div className="mt-5 rounded-lg border border-stone-100 bg-stone-50 p-5">
            <p className="font-semibold text-md-black">
              {currentQuestion.question}
            </p>

            <div className="mt-4 space-y-2">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selected === choice;
                const choiceIsCorrect =
                  choice === currentQuestion.correctAnswer;
                let className =
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ";

                if (answered) {
                  if (choiceIsCorrect) {
                    className +=
                      "border-green-500 bg-green-50 text-green-900";
                  } else if (isSelected) {
                    className += "border-red-400 bg-red-50 text-red-900";
                  } else {
                    className +=
                      "border-stone-200 bg-white text-stone-500";
                  }
                } else {
                  className +=
                    "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-white";
                }

                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelect(choice)}
                    className={className}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                  isCorrect
                    ? "border-green-200 bg-green-50 text-green-900"
                    : "border-red-200 bg-red-50 text-red-900"
                }`}
              >
                <p className="font-semibold">
                  {isCorrect ? "Correct!" : "Not quite."}
                </p>
                {!isCorrect && (
                  <p className="mt-1">
                    Correct answer:{" "}
                    <span className="font-medium">
                      {currentQuestion.correctAnswer}
                    </span>
                  </p>
                )}
                {currentQuestion.explanation && (
                  <p className="mt-2 text-stone-700">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}

            {answered && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  {step < questions.length - 1 ? "Next question" : "See score"}
                </button>
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
}
