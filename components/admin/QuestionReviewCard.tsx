"use client";

import { useState } from "react";
import { isPlaceholderLetterChoices } from "@/lib/normalize-question-choices";
import type { QuestionStatus } from "@/types/question-bank";

const CHOICE_LABELS = ["A", "B", "C", "D"];

export type ReviewQuestion = {
  _id: string;
  conceptId: string;
  domain: string;
  subdomain: string;
  concept: string;
  objective: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  status: QuestionStatus;
};

type QuestionReviewCardProps = {
  question: ReviewQuestion;
  onSaved: () => void;
};

export default function QuestionReviewCard({
  question,
  onSaved,
}: QuestionReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    question: question.question,
    choices: [...question.choices],
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isApproved = question.status === "approved";
  const isRejected = question.status === "rejected";
  const placeholderChoices = isPlaceholderLetterChoices(question.choices);

  const patch = async (status?: QuestionStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/questions/${question._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(editing ? form : {}),
          ...(status ? { status } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }
      setEditing(false);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{question.domain}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">
          {question.subdomain}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 ${
            isApproved
              ? "bg-green-100 text-green-800"
              : isRejected
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {question.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-xs text-slate-500">{question.concept}</p>
      <p className="mb-3 text-xs text-slate-600">{question.objective}</p>

      {placeholderChoices && !editing && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Answer choices were saved as placeholders (a/b/c/d only). The model
          copied a bad JSON example — use Edit to paste full choice text, or
          Reject and regenerate.
        </p>
      )}

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {form.choices.map((c, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-6 shrink-0 pt-2 text-sm font-semibold text-slate-500">
                {CHOICE_LABELS[i]}.
              </span>
              <input
                value={c}
                onChange={(e) => {
                  const choices = [...form.choices];
                  choices[i] = e.target.value;
                  setForm({ ...form, choices });
                }}
                placeholder={`Choice ${CHOICE_LABELS[i]} — full answer text`}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <select
            value={form.correctAnswer}
            onChange={(e) =>
              setForm({ ...form, correctAnswer: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {form.choices.map((c, i) => (
              <option key={`${i}-${c}`} value={c}>
                {CHOICE_LABELS[i]}. {c || "(empty)"}
              </option>
            ))}
          </select>
          <textarea
            value={form.explanation}
            onChange={(e) =>
              setForm({ ...form, explanation: e.target.value })
            }
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      ) : (
        <>
          <p className="font-medium text-slate-900">{question.question}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {question.choices.map((c, i) => (
              <li
                key={`${i}-${c}`}
                className={
                  c === question.correctAnswer
                    ? "font-semibold text-green-700"
                    : ""
                }
              >
                <span className="font-semibold text-slate-500">
                  {CHOICE_LABELS[i]}.
                </span>{" "}
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-slate-600">{question.explanation}</p>
        </>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {isApproved ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => patch("needs_review")}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 disabled:opacity-50"
          >
            Unapprove
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => patch("approved")}
            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            Approve
          </button>
        )}
        {isRejected ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => patch("needs_review")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            Restore to review
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => patch("rejected")}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            Reject
          </button>
        )}
        {editing ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => patch()}
            className="btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Save edits
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
