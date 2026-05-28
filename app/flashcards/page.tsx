"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { formatExplanation } from "@/lib/explanation";
import { QUESTION_BANK } from "@/lib/questionBank";
import { DOMAINS } from "@/types/quiz";

export default function FlashcardsPage() {
  const [domain, setDomain] = useState<string>("All");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const cards = useMemo(() => {
    if (domain === "All") return QUESTION_BANK;
    return QUESTION_BANK.filter((q) => q.domain === domain);
  }, [domain]);

  const currentCard = cards[index];

  const resetForNewDomain = (nextDomain: string) => {
    setDomain(nextDomain);
    setIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    setIndex((prev) => (cards.length > 0 ? (prev + 1) % cards.length : 0));
    setShowAnswer(false);
  };

  const prevCard = () => {
    setIndex((prev) =>
      cards.length > 0 ? (prev - 1 + cards.length) % cards.length : 0
    );
    setShowAnswer(false);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="link-accent text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Flashcards</h1>
          <p className="mt-1 text-slate-600">
            Drill one concept at a time. Reveal the answer, then move to the
            next card.
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label
            htmlFor="domain-filter"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Filter by domain
          </label>
          <select
            id="domain-filter"
            value={domain}
            onChange={(e) => resetForNewDomain(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="All">All Domains</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {currentCard ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-md-red-light px-3 py-1 text-xs font-medium text-md-red-dark">
                  {currentCard.domain}
                </span>
                <span className="text-sm text-slate-500">
                  Card {index + 1} of {cards.length}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                {currentCard.question}
              </h2>

              {showAnswer ? (
                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-900">
                    Correct answer: {currentCard.correctAnswer}
                  </p>
                  <p className="mt-2 text-sm text-green-800">
                    {formatExplanation(currentCard.explanation)}
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Try answering in your head before revealing.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={prevCard}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswer((v) => !v)}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  {showAnswer ? "Hide Answer" : "Reveal Answer"}
                </button>
                <button
                  type="button"
                  onClick={nextCard}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No flashcards available for this domain.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
