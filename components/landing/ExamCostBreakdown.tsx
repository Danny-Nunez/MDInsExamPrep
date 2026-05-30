import {
  LICENSING_FEE_ROWS,
  MARYLAND_EXAM_FEE,
  MIA_INITIAL_LICENSE_FEE,
  PROMETRIC_EXAM_FEES,
  formatUsd,
  minimumLicensingCost,
} from "@/lib/maryland-exam-costs";

export default function ExamCostBreakdown() {
  const highlighted = PROMETRIC_EXAM_FEES.filter((e) => e.highlight);
  const other = PROMETRIC_EXAM_FEES.filter((e) => !e.highlight);
  const minOnePass = minimumLicensingCost(1);
  const minTwoAttempts = minimumLicensingCost(2);

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Exam fee (Prometric)
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">
            {formatUsd(MARYLAND_EXAM_FEE)}
          </p>
          <p className="mt-1 text-xs text-stone-500">Per exam code, per attempt</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            License application (MIA)
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">
            {formatUsd(MIA_INITIAL_LICENSE_FEE)}
          </p>
          <p className="mt-1 text-xs text-stone-500">After you pass, via NIPR</p>
        </div>
        <div className="rounded-xl border border-md-red/30 bg-md-red-light p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-md-red">
            Typical minimum (1 pass)
          </p>
          <p className="mt-2 text-3xl font-bold text-md-black">
            {formatUsd(minOnePass)}
          </p>
          <p className="mt-1 text-xs text-stone-600">
            {formatUsd(MARYLAND_EXAM_FEE)} exam + {formatUsd(MIA_INITIAL_LICENSE_FEE)}{" "}
            license
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3 sm:px-6">
          <h2 className="text-lg font-semibold text-md-black">
            Prometric exam fees (Life &amp; Health focus)
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Each code below is {formatUsd(MARYLAND_EXAM_FEE)} per sitting (Prometric Maryland
            insurance FAQ).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-100 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3 sm:px-6">Code</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3 text-right sm:px-6">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {highlighted.map((row) => (
                <tr key={row.code} className="bg-md-red-light/40">
                  <td className="px-4 py-3 font-mono text-xs font-semibold sm:px-6">
                    {row.code}
                  </td>
                  <td className="px-4 py-3 font-medium text-md-black">{row.name}</td>
                  <td className="px-4 py-3 text-right font-semibold sm:px-6">
                    {formatUsd(row.fee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="border-t border-stone-100 px-4 py-3 sm:px-6">
          <summary className="cursor-pointer text-sm font-medium text-md-red hover:underline">
            Other Maryland exam codes ({formatUsd(MARYLAND_EXAM_FEE)} each)
          </summary>
          <table className="mt-3 min-w-full text-left text-sm">
            <tbody className="divide-y divide-stone-100">
              {other.map((row) => (
                <tr key={row.code}>
                  <td className="py-2 font-mono text-xs text-stone-600">{row.code}</td>
                  <td className="py-2 text-stone-700">{row.name}</td>
                  <td className="py-2 text-right font-medium">
                    {formatUsd(row.fee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3 sm:px-6">
          <h2 className="text-lg font-semibold text-md-black">
            State &amp; licensing fees
          </h2>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-100 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3 sm:px-6">Fee type</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {LICENSING_FEE_ROWS.map((row) => (
              <tr key={row.item}>
                <td className="px-4 py-4 sm:px-6">
                  <p className="font-medium text-md-black">{row.item}</p>
                  <p className="mt-1 text-xs text-stone-500">{row.note}</p>
                </td>
                <td className="px-4 py-4 text-right align-top font-semibold text-md-black sm:px-6">
                  {row.amount === 0 ? "$0" : formatUsd(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950 sm:px-6">
        <p className="font-semibold">If you need a retake</p>
        <p className="mt-1">
          Each additional exam attempt adds {formatUsd(MARYLAND_EXAM_FEE)} (e.g. two
          attempts before passing ≈ {formatUsd(minTwoAttempts)} in exam fees alone, plus{" "}
          {formatUsd(MIA_INITIAL_LICENSE_FEE)} license fee). NIPR may charge separate
          processing fees—see checkout on{" "}
          <a
            href="https://www.nipr.com"
            className="font-medium text-md-red hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            nipr.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
