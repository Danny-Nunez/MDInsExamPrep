"use client";

import { CONCEPT_FILTER_DOMAINS } from "@/lib/admin-concept-filters";

export type QuestionReviewFilterValues = {
  domain: string;
  subdomain: string;
  concept: string;
};

type QuestionReviewFiltersProps = {
  values: QuestionReviewFilterValues;
  onChange: (values: QuestionReviewFilterValues) => void;
  subdomains: string[];
  concepts: string[];
  loadingOptions?: boolean;
};

export default function QuestionReviewFilters({
  values,
  onChange,
  subdomains,
  concepts,
  loadingOptions = false,
}: QuestionReviewFiltersProps) {
  const set = (key: keyof QuestionReviewFilterValues, value: string) => {
    const next = { ...values, [key]: value };
    if (key === "domain") {
      next.subdomain = "";
      next.concept = "";
    }
    onChange(next);
  };

  const hasDomain = Boolean(values.domain);

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
      <select
        value={values.domain}
        onChange={(e) => set("domain", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All domains</option>
        {CONCEPT_FILTER_DOMAINS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={values.subdomain}
        onChange={(e) => set("subdomain", e.target.value)}
        disabled={!hasDomain || loadingOptions}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">
          {hasDomain ? "All subdomains" : "Select a domain first"}
        </option>
        {subdomains.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={values.concept}
        onChange={(e) => set("concept", e.target.value)}
        disabled={!hasDomain || loadingOptions}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">
          {hasDomain ? "All topics" : "Select a domain first"}
        </option>
        {concepts.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="search"
        placeholder="Search topic (concept name)…"
        value={values.concept}
        onChange={(e) => set("concept", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2 lg:col-span-3"
      />
      {(values.domain || values.subdomain || values.concept) && (
        <button
          type="button"
          onClick={() =>
            onChange({ domain: "", subdomain: "", concept: "" })
          }
          className="text-left text-sm text-md-red hover:underline sm:col-span-2 lg:col-span-3"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
