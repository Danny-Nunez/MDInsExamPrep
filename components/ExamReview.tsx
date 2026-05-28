"use client";

import { formatExplanation } from "@/lib/explanation";
import type { ExamAttempt, QuizQuestion } from "@/types/quiz";
import QuestionCard from "./QuestionCard";

type ExamReviewProps = {
  attempt: ExamAttempt;
  questions: QuizQuestion[];
};

export default function ExamReview({ attempt, questions }: ExamReviewProps) {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-slate-900">Answer Review</h2>
      {attempt.answers.map((answer, index) => {
        const question = questionMap.get(answer.questionId);
        if (!question) return null;

        return (
          <div key={answer.questionId} className="space-y-3">
            <QuestionCard
              question={question}
              questionNumber={index + 1}
              totalQuestions={attempt.totalQuestions}
              selectedAnswer={answer.selectedAnswer}
              onSelect={() => {}}
              showResult
            />
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                answer.isCorrect
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-medium">
                {answer.isCorrect ? "Correct" : "Incorrect"} — Correct answer:{" "}
                {answer.correctAnswer}
              </p>
              <p className="mt-1 text-slate-700">
                {formatExplanation(question.explanation)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
