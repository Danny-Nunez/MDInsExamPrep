import Link from "next/link";

const categories = [
  { name: "Annuities", pct: 78, color: "bg-green-500" },
  { name: "Medical Plans", pct: 62, color: "bg-amber-500" },
  { name: "Qualified Plans", pct: 55, color: "bg-amber-500" },
  { name: "Health Insurance Basics", pct: 71, color: "bg-green-500" },
  { name: "General Insurance", pct: 68, color: "bg-amber-500" },
  { name: "Life Insurance Policies", pct: 74, color: "bg-green-500" },
  { name: "Group Health Insurance", pct: 58, color: "bg-amber-500" },
  { name: "Insurance Regulation", pct: 52, color: "bg-red-500" },
  { name: "Life Insurance Basics", pct: 80, color: "bg-green-500" },
];

const recentExams = [
  { title: "Practice Exam #6", date: "May 24", score: 68, color: "text-red-600" },
  { title: "AI Focused Quiz", date: "May 22", score: 82, color: "text-amber-600" },
  { title: "Practice Exam #5", date: "May 20", score: 71, color: "text-green-600" },
];

export default function LandingHeroMockup() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-md-black">
            Welcome back, Jordan 👋
          </p>
          <p className="text-xs text-stone-500">Maryland exam readiness snapshot</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Maryland Exam Readiness", value: "71%" },
          { label: "Average Score", value: "66%" },
          { label: "Exams Taken", value: "6" },
          { label: "Weak Areas", value: "4" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-stone-100 bg-stone-50 px-2.5 py-2 text-center"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-500 sm:text-xs">
              {stat.label}
            </p>
            <p className="mt-0.5 text-lg font-bold text-md-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Maryland Blueprint Performance
          </p>
          <ul className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <li key={cat.name} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-[11px] text-stone-700 sm:w-32 sm:text-xs">
                  {cat.name}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[11px] font-medium text-stone-600">
                  {cat.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Recent Exams
          </p>
          <ul className="space-y-2">
            {recentExams.map((exam) => (
              <li
                key={exam.title}
                className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-stone-800">{exam.title}</p>
                  <p className="text-[10px] text-stone-500">{exam.date} · 10 questions</p>
                </div>
                <span className={`text-sm font-bold ${exam.color}`}>
                  {exam.score}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-100 bg-sky-50 px-3 py-3">
        <div>
          <p className="text-xs font-semibold text-sky-900">AI Study Recommendation</p>
          <p className="text-[11px] text-sky-800">
            Focus on Insurance Regulation &amp; Qualified Plans
          </p>
        </div>
        <Link
          href="/register"
          className="btn-primary shrink-0 px-3 py-1.5 text-xs"
        >
          Generate Quiz
        </Link>
      </div>
    </div>
  );
}
