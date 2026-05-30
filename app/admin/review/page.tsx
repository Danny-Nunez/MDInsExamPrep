"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import QuestionReviewCard, {
  type ReviewQuestion,
} from "@/components/admin/QuestionReviewCard";

export default function AdminReviewPage() {
  const [items, setItems] = useState<ReviewQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("needs_review");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "30", status });
    const res = await fetch(`/api/admin/questions?${params}`, {
      credentials: "include",
    });
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  if (forbidden) {
    return (
      <AdminLayout>
        <p className="text-slate-600">Admin access required.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review questions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Only approved questions appear in student bank quizzes.
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="needs_review">Needs review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-slate-500">{total} questions</p>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No questions in this queue.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((q) => (
            <QuestionReviewCard
              key={q._id}
              question={q}
              onSaved={load}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
