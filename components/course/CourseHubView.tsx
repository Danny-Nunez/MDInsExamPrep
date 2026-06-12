import Link from "next/link";
import CourseModuleCard from "@/components/course/CourseModuleCard";
import CTAExamCard from "@/components/landing/CTAExamCard";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import {
  getAllCourseModules,
  getCourseStats,
  MARYLAND_COURSE,
} from "@/lib/course";

type CourseHubViewProps = {
  basePath?: string;
  variant?: "public" | "dashboard";
};

export default function CourseHubView({
  basePath = COURSE_BASE_PATH,
  variant = "public",
}: CourseHubViewProps) {
  const modules = getAllCourseModules();
  const stats = getCourseStats();
  const isDashboard = variant === "dashboard";

  return (
    <div>
      {!isDashboard && (
        <>
          <p className="text-sm font-bold uppercase tracking-wide text-md-red">
            {MARYLAND_COURSE.subtitle}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-md-black sm:text-4xl">
            {MARYLAND_COURSE.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-stone-600">
            {MARYLAND_COURSE.description} Follow the full course in order, or
            jump straight to lessons recommended from your practice results and
            uploaded Prometric score report.
          </p>
        </>
      )}

      <div className={`grid gap-3 sm:grid-cols-3 ${isDashboard ? "" : "mt-8"}`}>
        {[
          { label: "Modules", value: stats.modules },
          { label: "Lessons", value: `${stats.lessons}+` },
          { label: "Quizzes", value: stats.quizzes },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-center shadow-sm"
          >
            <p className="text-2xl font-bold text-md-black">{item.value}</p>
            <p className="text-sm text-stone-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        {modules.map((courseModule) => (
          <CourseModuleCard
            key={courseModule.id}
            courseModule={courseModule}
            basePath={basePath}
            defaultExpanded={courseModule.slug === "annuities"}
          />
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-md-black">How to use this course</h2>
        <ul className="mt-4 space-y-2 text-stone-600">
          {!isDashboard && (
            <li>
              • Create a free account to save lesson progress across devices — no
              subscription required.
            </li>
          )}
          {isDashboard && (
            <li>• Your lesson progress saves automatically to your account.</li>
          )}
          <li>
            • Work module by module, or open the Annuities section for Lesson
            4.1 now.
          </li>
          <li>
            • Lessons without a video yet are marked coming soon — more are added
            regularly.
          </li>
          <li>
            • Pair each module with practice exams and AI weak-area quizzes
            {isDashboard ? " from the Practice tab." : " when you subscribe."}
          </li>
        </ul>
        <Link
          href={`${basePath}/annuities/annuities-fundamentals`}
          className="btn-primary mt-6 inline-flex px-6 py-3 text-sm"
        >
          Start Module 4 · Annuities Fundamentals
        </Link>
      </div>

      {!isDashboard && <CTAExamCard className="mt-10" />}
    </div>
  );
}
