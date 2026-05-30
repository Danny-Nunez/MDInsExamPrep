"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Pagination from "@/components/admin/Pagination";
import QuestionReviewCard, {
  type ReviewQuestion,
} from "@/components/admin/QuestionReviewCard";

const PAGE_SIZE = 25;

export default function AdminReviewPage() {
  const [items, setItems] = useState<ReviewQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("needs_review");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const skip = (page - 1) * PAGE_SIZE;
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      skip: String(skip),
      status,
    });
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
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages && total > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages, total]);

  const handleStatusChange = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  const handleSaved = () => {
    load();
  };

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
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="needs_review">Needs review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {total.toLocaleString()} questions · {PAGE_SIZE} per page
      </p>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No questions in this queue.</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((q) => (
              <QuestionReviewCard
                key={q._id}
                question={q}
                onSaved={handleSaved}
              />
            ))}
          </div>
          {total > PAGE_SIZE && (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={total}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
