import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Circle,
  FileText,
  LayoutDashboard,
  Sparkles,
  Upload,
} from "lucide-react";
import ExamReadinessCard from "@/components/ExamReadinessCard";
import MetricTrendCard from "@/components/MetricTrendCard";
import LandingMockupSidebar from "@/components/landing/LandingMockupSidebar";

const weakAreas = [
  { name: "Medicare", pct: 48, color: "bg-red-500" },
  { name: "Insurance Regulation", pct: 52, color: "bg-red-500" },
  { name: "Qualified Plans", pct: 55, color: "bg-amber-500" },
  { name: "Medical Plans", pct: 62, color: "bg-amber-500" },
  { name: "Annuities", pct: 78, color: "bg-green-500" },
];

const recentActivity = [
  { title: "Practice Exam #12", date: "May 26", score: 82, color: "text-green-600" },
  { title: "Focused Practice", date: "May 25", score: 74, color: "text-amber-600" },
  { title: "Prometric Simulation", date: "May 23", score: 68, color: "text-red-600" },
  { title: "Study Mode", date: "May 22", score: 79, color: "text-green-600" },
];

const upcomingStudy = [
  { title: "Medicare Basics", time: "15 min" },
  { title: "MD Regulations Review", time: "20 min" },
  { title: "Annuities Drill", time: "10 min" },
];

const studyPlanDays = [
  { label: "Regulations warm-up", time: "10 min", done: true },
  { label: "Medicare practice set", time: "15 min", done: true },
  { label: "Weak-area quiz", time: "20 min", done: false },
  { label: "Review missed items", time: "10 min", done: false },
];

const topicPerformance = [
  { name: "Life Insurance", pct: 81, color: "bg-green-500" },
  { name: "Health Insurance", pct: 68, color: "bg-amber-500" },
  { name: "MD Regulations", pct: 52, color: "bg-red-500" },
];

const quickLinks = [
  { label: "Exam Guide", href: "/how-to-get-a-maryland-insurance-license" },
  { label: "License Requirements", href: "/maryland-life-health-insurance-exam-requirements" },
  { label: "Study Tips", href: "/maryland-insurance-exam-last-minute-study-tips" },
  { label: "Contact Support", href: "/pricing" },
];

const mobileNavItems = [
  { label: "Home", icon: LayoutDashboard, active: true },
  { label: "Practice", icon: FileText },
  { label: "Progress", icon: BarChart3 },
  { label: "Study", icon: BookOpen },
];

function MockupCard({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-stone-200 bg-white p-2.5 shadow-sm sm:p-3 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500 sm:text-xs">
          {title}
        </p>
        {action}
      </div>
      {children}
    </div>
  );
}

function MockupSparkline() {
  return (
    <svg
      viewBox="0 0 240 64"
      className="h-14 w-full sm:h-16"
      aria-hidden
    >
      <defs>
        <linearGradient id="mockup-readiness-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 52 L48 46 L96 40 L144 28 L192 22 L240 14 L240 64 L0 64 Z"
        fill="url(#mockup-readiness-fill)"
      />
      <polyline
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,52 48,46 96,40 144,28 192,22 240,14"
      />
    </svg>
  );
}

export default function LandingHeroMockup() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-xl shadow-stone-300/50">
      <div className="flex min-h-0 flex-col md:min-h-[640px] md:flex-row">
        <div className="hidden shrink-0 md:flex">
          <LandingMockupSidebar />
        </div>

        <div className="flex min-w-0 w-full flex-1 flex-col">
          <div className="min-w-0 flex-1 bg-stone-50 p-2.5 sm:p-3 lg:p-4">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-md-black sm:text-sm lg:text-base">
                  Welcome back, Alex! 👋
                </p>
                <p className="text-[10px] text-stone-500 sm:text-xs">
                  Here&apos;s your exam readiness snapshot
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden text-center sm:block">
                  <div className="flex items-center gap-0.5 leading-none">
                    <span className="text-lg" aria-hidden>
                      🔥
                    </span>
                    <span className="text-lg font-bold text-md-red">7</span>
                  </div>
                  <p className="text-[9px] text-stone-500">Day Streak</p>
                </div>
                <div className="relative rounded-lg border border-stone-200 bg-white p-1.5">
                  <Bell className="h-4 w-4 text-stone-600" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-md-red text-[9px] font-bold text-white">
                    3
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2 py-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-md-black text-[10px] font-semibold text-md-gold">
                    AJ
                  </div>
                  <span className="hidden text-[11px] font-medium text-md-black min-[420px]:inline">
                    Alex Johnson
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-stone-400 min-[420px]:block" />
                </div>
              </div>
            </div>

            {/* Row 1 — readiness, metrics, AI quiz */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-3">
              <div className="min-w-0 lg:col-span-3">
                <ExamReadinessCard
                  mockup
                  unlocked
                  percentage={72}
                  trendText="+12% from last week"
                  trendPositive
                />
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:col-span-5">
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
              <MockupCard
                title="AI Quiz Generator"
                className="flex flex-col justify-between lg:col-span-4"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-md-gold" />
                  <p className="text-[10px] leading-relaxed text-stone-600 sm:text-xs">
                    Build a custom set from your weak topics so every session
                    targets what raises your score fastest.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="btn-primary mt-3 block w-full py-2 text-center text-[10px] sm:text-xs"
                >
                  Generate Quiz
                </Link>
              </MockupCard>
            </div>

            {/* Row 2 — weak areas, activity, upcoming */}
            <div className="mt-2 grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 xl:grid-cols-3 lg:mt-3 lg:gap-3">
              <MockupCard
                title="Weak Areas"
                action={
                  <span className="text-[10px] font-medium text-md-red">
                    See All
                  </span>
                }
              >
                <ul className="space-y-1.5">
                  {weakAreas.map((area) => (
                    <li key={area.name} className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[10px] text-stone-700 sm:text-xs">
                        {area.name}
                      </span>
                      <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-stone-100 sm:w-16">
                        <div
                          className={`h-full rounded-full ${area.color}`}
                          style={{ width: `${area.pct}%` }}
                        />
                      </div>
                      <span className="w-7 shrink-0 text-right text-[10px] font-medium tabular-nums text-stone-600">
                        {area.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </MockupCard>

              <MockupCard
                title="Recent Activity"
                action={
                  <span className="text-[10px] font-medium text-md-red">
                    View all →
                  </span>
                }
              >
                <ul className="space-y-1.5">
                  {recentActivity.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-center justify-between gap-2 rounded-md border border-stone-100 bg-stone-50 px-2 py-1.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-medium text-stone-800 sm:text-xs">
                          {item.title}
                        </p>
                        <p className="text-[9px] text-stone-500">{item.date}</p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold tabular-nums ${item.color}`}
                      >
                        {item.score}%
                      </span>
                    </li>
                  ))}
                </ul>
              </MockupCard>

              <MockupCard
                title="Upcoming Study"
                className="min-[520px]:col-span-2 xl:col-span-1"
              >
                <ul className="space-y-1.5">
                  {upcomingStudy.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-center justify-between gap-2 text-[10px] sm:text-xs"
                    >
                      <span className="font-medium text-stone-800">
                        {item.title}
                      </span>
                      <span className="text-stone-500">{item.time}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="btn-primary mt-3 block w-full py-2 text-center text-[10px] sm:text-xs"
                >
                  Start Today&apos;s Plan
                </Link>
              </MockupCard>
            </div>

            {/* Row 3 — study plan, progress, upload + links */}
            <div className="mt-2 grid grid-cols-1 gap-2 lg:mt-3 lg:grid-cols-12 lg:gap-3">
              <MockupCard title="Your 14-Day Study Plan" className="lg:col-span-3">
                <p className="mb-2 text-[10px] font-medium text-stone-600 sm:text-xs">
                  Day 1 of 14
                </p>
                <ul className="space-y-2">
                  {studyPlanDays.map((item) => (
                    <li key={item.label} className="flex items-start gap-2">
                      {item.done ? (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      ) : (
                        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-300" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-stone-800 sm:text-xs">
                          {item.label}
                        </p>
                        <p className="text-[9px] text-stone-500">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </MockupCard>

              <MockupCard title="Progress Overview" className="lg:col-span-5">
                <div className="mb-2 flex gap-1 rounded-lg border border-stone-200 bg-stone-50 p-0.5">
                  {["Overview", "Trends", "Activity"].map((tab, i) => (
                    <span
                      key={tab}
                      className={`flex-1 rounded-md px-2 py-1 text-center text-[9px] font-medium sm:text-[10px] ${
                        i === 0
                          ? "bg-white text-md-black shadow-sm"
                          : "text-stone-500"
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <p className="mb-1 text-[10px] font-medium text-stone-700 sm:text-xs">
                  Readiness Over Time
                </p>
                <MockupSparkline />
                <p className="mt-2 text-[10px] font-medium text-stone-700 sm:text-xs">
                  Topic Performance
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {topicPerformance.map((topic) => (
                    <li key={topic.name} className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[10px] text-stone-700">
                        {topic.name}
                      </span>
                      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className={`h-full rounded-full ${topic.color}`}
                          style={{ width: `${topic.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </MockupCard>

              <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
                <MockupCard title="Upload Score Report">
                  <div className="flex items-start gap-2">
                    <Upload className="mt-0.5 h-4 w-4 shrink-0 text-md-red" />
                    <p className="text-[10px] leading-relaxed text-stone-600 sm:text-xs">
                      Upload a failed exam report and we&apos;ll map weak areas
                      to your personalized study plan.
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="btn-primary mt-3 block w-full py-2 text-center text-[10px] sm:text-xs"
                  >
                    Upload Report
                  </Link>
                  <p className="mt-2 text-[9px] text-stone-500">
                    PDF, JPG, or PNG
                  </p>
                </MockupCard>

                <MockupCard title="Quick Links">
                  <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="rounded-md border border-stone-100 bg-stone-50 px-2 py-2 text-center text-[9px] font-medium text-stone-700 hover:border-md-red/30 hover:text-md-red sm:text-[10px]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </MockupCard>
              </div>
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
