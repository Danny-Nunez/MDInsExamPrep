"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import {
  formatExplanation,
  getExplanationDetail,
  getWrongAnswerNote,
} from "@/lib/explanation";
import type { QuizQuestion } from "@/types/quiz";

type QuestionCardProps = {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onSelect: (answer: string) => void;
  /** Force review mode (e.g. results page). */
  showResult?: boolean;
  /** Study mode reveals feedback after answering; exam mode waits until showResult. */
  studyMode?: boolean;
  markedForReview?: boolean;
  onToggleReview?: () => void;
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-orange-100 text-orange-800",
  prometric: "bg-md-red-light text-md-red-dark",
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelect,
  showResult = false,
  studyMode = true,
  markedForReview = false,
  onToggleReview,
}: QuestionCardProps) {
  const answered = selectedAnswer !== undefined;
  const reveal = showResult || (studyMode && answered);
  const isCorrect = selectedAnswer === question.correctAnswer;
  const detail = getExplanationDetail(question.explanation);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-slate-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {onToggleReview && (
            <button
              type="button"
              onClick={onToggleReview}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                markedForReview
                  ? "bg-amber-100 text-amber-800"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {markedForReview ? "Marked for review" : "Mark for review"}
            </button>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
              DIFFICULTY_STYLES[question.difficulty] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {question.difficulty}
          </span>
          {question.isStateLaw && (
            <span className="rounded-full bg-md-gold-light px-2.5 py-1 text-xs font-medium text-md-black">
              MD law
            </span>
          )}
          <span className="rounded-full bg-md-red-light px-3 py-1 text-xs font-medium text-md-red-dark">
            {question.domain}
          </span>
          {question.subdomain && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {question.subdomain}
            </span>
          )}
        </div>
      </div>

      <h2 className="mb-6 text-lg font-semibold leading-relaxed text-slate-900">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.choices.map((choice) => {
          const isSelected = selectedAnswer === choice;
          const choiceIsCorrect = choice === question.correctAnswer;
          let className =
            "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ";

          if (reveal) {
            if (choiceIsCorrect) {
              className += "border-green-500 bg-green-50 text-green-900";
            } else if (isSelected && !choiceIsCorrect) {
              className += "border-red-500 bg-red-50 text-red-900";
            } else {
              className += "border-slate-200 bg-slate-50 text-slate-600";
            }
          } else if (isSelected) {
            className += "border-md-red bg-md-red-light text-md-red-dark";
          } else {
            className +=
              "border-stone-200 bg-white text-stone-800 hover:border-md-gold hover:bg-md-gold-light/50";
          }

          return (
            <button
              key={choice}
              type="button"
              disabled={reveal}
              onClick={() => onSelect(choice)}
              className={className}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {reveal && selectedAnswer && (
        <div
          className={`mt-5 rounded-lg border px-4 py-3 ${
            isCorrect
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <p
              className={`font-semibold ${
                isCorrect ? "text-green-800" : "text-red-800"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
          </div>
          {!isCorrect && (
            <p className="mt-2 text-sm text-slate-700">
              Correct answer:{" "}
              <span className="font-medium">{question.correctAnswer}</span>
            </p>
          )}
          <p className="mt-2 text-sm text-slate-700">
            {formatExplanation(question.explanation)}
          </p>
          {!isCorrect && detail?.wrongAnswers && selectedAnswer && (
            <p className="mt-2 text-sm text-slate-600">
              {getWrongAnswerNote(question, selectedAnswer) ??
                "Review why your choice does not apply."}
            </p>
          )}
          {reveal &&
            detail?.wrongAnswers &&
            question.choices
              .filter((c) => c !== question.correctAnswer)
              .map((choice) => {
                const note = detail.wrongAnswers?.[choice];
                if (!note) return null;
                return (
                  <p key={choice} className="mt-1 text-xs text-slate-500">
                    <span className="font-medium">{choice}:</span> {note}
                  </p>
                );
              })}
        </div>
      )}
    </div>
  );
}
