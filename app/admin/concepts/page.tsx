"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import ConceptFilters, {
  type ConceptFilterValues,
} from "@/components/admin/ConceptFilters";
import Pagination from "@/components/admin/Pagination";
import {
  CONCEPT_FILTER_DIFFICULTIES,
  CONCEPT_FILTER_DOMAINS,
  CONCEPT_FILTER_EXAM_WEIGHTS,
  CONCEPT_FILTER_STATUSES,
} from "@/lib/admin-concept-filters";
import type { ConceptDocument } from "@/types/question-bank";

const PAGE_SIZE = 100;

const emptyFilters: ConceptFilterValues = {
  domain: "",
  subdomain: "",
  difficulty: "",
  examWeight: "",
  marylandSpecific: "",
  status: "",
  search: "",
};

export default function AdminConceptsPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ConceptDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFiltersChange = (next: ConceptFilterValues) => {
    setFilters(next);
    setPage(1);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    const skip = (page - 1) * PAGE_SIZE;
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      skip: String(skip),
    });
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const res = await fetch(`/api/admin/concepts?${params}`, {
      credentials: "include",
    });
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setMessage("Failed to load concepts.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [filters, page]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages && total > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages, total]);

  const handleGenerate = async (objectiveId: string) => {
    setGeneratingId(objectiveId);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/admin/concepts/${encodeURIComponent(objectiveId)}/generate`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setMessage(
        `Created ${data.created} questions for ${objectiveId} (${data.totalForConcept} total for concept).`
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGeneratingId(null);
    }
  };

  if (forbidden) {
    return (
      <AdminLayout>
        <p className="text-slate-600">
          Admin access required. Set <code className="text-sm">ADMIN_EMAILS</code>{" "}
          in Vercel/env to your login email.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Concepts & objectives</h1>
        <p className="mt-1 text-sm text-slate-600">
          {total.toLocaleString()} learning objectives · {PAGE_SIZE} per page ·
          Generate 10 questions per row
        </p>
      </div>

      <ConceptFilters
        values={filters}
        onChange={handleFiltersChange}
        domains={[...CONCEPT_FILTER_DOMAINS]}
        difficulties={[...CONCEPT_FILTER_DIFFICULTIES]}
        examWeights={[...CONCEPT_FILTER_EXAM_WEIGHTS]}
        statuses={[...CONCEPT_FILTER_STATUSES]}
      />

      {message && (
        <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Domain</th>
                <th className="px-3 py-2">Concept</th>
                <th className="px-3 py-2">Objective</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Diff.</th>
                <th className="px-3 py-2">Weight</th>
                <th className="px-3 py-2">MD</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row) => (
                <tr key={row.objectiveId} className="align-top">
                  <td className="px-3 py-2 text-xs">
                    <div className="font-medium">{row.domain}</div>
                    <div className="text-slate-500">{row.subdomain}</div>
                  </td>
                  <td className="max-w-[140px] px-3 py-2 text-xs">{row.concept}</td>
                  <td className="max-w-[220px] px-3 py-2 text-xs">
                    {row.objective}
                  </td>
                  <td className="px-3 py-2 text-xs">{row.questionType}</td>
                  <td className="px-3 py-2 text-xs">{row.difficulty}</td>
                  <td className="px-3 py-2 text-xs">{row.examWeight}</td>
                  <td className="px-3 py-2 text-xs">{row.marylandSpecific}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      disabled={generatingId === row.objectiveId}
                      onClick={() => handleGenerate(row.objectiveId)}
                      className="btn-primary whitespace-nowrap px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {generatingId === row.objectiveId
                        ? "Generating…"
                        : "Generate 10"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}
    </AdminLayout>
  );
}
