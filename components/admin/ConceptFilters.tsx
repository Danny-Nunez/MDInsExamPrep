"use client";

export type ConceptFilterValues = {
  domain: string;
  subdomain: string;
  difficulty: string;
  examWeight: string;
  marylandSpecific: string;
  status: string;
  search: string;
};

type ConceptFiltersProps = {
  values: ConceptFilterValues;
  onChange: (values: ConceptFilterValues) => void;
  domains: string[];
  difficulties: string[];
  examWeights: string[];
  statuses: string[];
};

export default function ConceptFilters({
  values,
  onChange,
  domains,
  difficulties,
  examWeights,
  statuses,
}: ConceptFiltersProps) {
  const set = (key: keyof ConceptFilterValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="search"
        placeholder="Search concept or objective…"
        value={values.search}
        onChange={(e) => set("search", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2 lg:col-span-4"
      />
      <select
        value={values.domain}
        onChange={(e) => set("domain", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All domains</option>
        {domains.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Subdomain filter"
        value={values.subdomain}
        onChange={(e) => set("subdomain", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
      <select
        value={values.difficulty}
        onChange={(e) => set("difficulty", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All difficulties</option>
        {difficulties.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={values.examWeight}
        onChange={(e) => set("examWeight", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All weights</option>
        {examWeights.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        value={values.marylandSpecific}
        onChange={(e) => set("marylandSpecific", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">MD specific: any</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <select
        value={values.status}
        onChange={(e) => set("status", e.target.value)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
