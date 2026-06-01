import Link from "next/link";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import ExamReadinessCard from "@/components/ExamReadinessCard";
import MetricTrendCard from "@/components/MetricTrendCard";
import LandingMockupSidebar from "@/components/landing/LandingMockupSidebar";

const categories = [
  { name: "Insurance Regulation", pct: 52, color: "bg-red-500" },
  { name: "Qualified Plans", pct: 55, color: "bg-amber-500" },
  { name: "Medical Plans", pct: 62, color: "bg-amber-500" },
  { name: "Annuities", pct: 78, color: "bg-green-500" },
];

const recentExams = [
  { title: "Practice Exam #6", date: "May 24", score: 68, color: "text-red-600" },
  { title: "AI Focused Quiz", date: "May 22", score: 82, color: "text-amber-600" },
];

const mobileNavItems = [
  { label: "Home", icon: LayoutDashboard, active: true },
  { label: "Practice", icon: FileText },
  { label: "AI Quiz", icon: Sparkles },
  { label: "Progress", icon: BarChart3 },
];

export default function LandingHeroMockup() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-xl shadow-stone-300/50">
      <div className="flex flex-col md:flex-row">
        <div className="hidden shrink-0 md:flex">
          <LandingMockupSidebar />
        </div>

        <div className="flex min-w-0 w-full flex-1 flex-col md:min-w-0">
          <div className="min-w-0 flex-1 bg-stone-50 p-2.5 sm:p-3">
            <div className="mb-2">
              <p className="text-xs font-semibold text-md-black sm:text-sm">
                Welcome back, Jordan 👋
              </p>
              <p className="text-[10px] text-stone-500 sm:text-xs">
                Maryland exam readiness snapshot
              </p>
            </div>

            <div className="mb-2 space-y-1.5">
              <ExamReadinessCard
                mockup
                unlocked
                percentage={72}
                trendText="+12% from last week"
                trendPositive
              />
              <div className="grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-3">
                <MetricTrendCard
                  compact
                  title="Correct Answer Rate"
                  value="68%"
                  trend="+8%"
                />
                <MetricTrendCard
                  compact
                  title="Quizzes Taken"
                  value="24"
                  trend="+6"
                />
                <MetricTrendCard
                  compact
                  title="Avg. Score"
                  value="72%"
                  trend="+10%"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-stone-200 bg-white p-2">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                  Weak Areas
                </p>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.name} className="flex items-center gap-1.5">
                      <span className="min-w-0 flex-1 truncate text-[10px] text-stone-700">
                        {cat.name}
                      </span>
                      <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-stone-100 sm:w-16">
                        <div
                          className={`h-full rounded-full ${cat.color}`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-[10px] font-medium text-stone-600">
                        {cat.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0 rounded-lg border border-stone-200 bg-white p-2">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                  Recent Exams
                </p>
                <ul className="space-y-1">
                  {recentExams.map((exam) => (
                    <li
                      key={exam.title}
                      className="flex items-center justify-between gap-1.5 rounded-md border border-stone-100 bg-stone-50 px-1.5 py-1"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-medium text-stone-800">
                          {exam.title}
                        </p>
                        <p className="text-[9px] text-stone-500">{exam.date}</p>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-bold tabular-nums ${exam.color}`}
                      >
                        {exam.score}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2 rounded-lg border border-sky-100 bg-sky-50 px-2 py-1.5 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:px-3">
              <p className="min-w-0 text-[10px] font-medium text-sky-900">
                Focus: Regulation &amp; Qualified Plans
              </p>
              <Link
                href="/register"
                className="btn-primary shrink-0 px-2 py-1 text-center text-[10px]"
              >
                Generate Quiz
              </Link>
            </div>
          </div>

          <nav
            className="flex shrink-0 items-center justify-around border-t border-stone-800 bg-md-black px-1 py-2 md:hidden"
            aria-label="App navigation preview"
          >
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1 ${
                    item.active ? "text-md-gold" : "text-stone-400"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span className="text-[9px] font-medium">{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
