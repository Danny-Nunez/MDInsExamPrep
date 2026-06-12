import Link from "next/link";
import CourseLessonRow from "@/components/course/CourseLessonRow";
import CTAExamCard from "@/components/landing/CTAExamCard";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import {
  courseLessonPath,
  lessonHasVideo,
  moduleHasVideo,
  type CourseModule,
} from "@/lib/course";

type CourseModuleViewProps = {
  courseModule: CourseModule;
  basePath?: string;
  variant?: "public" | "dashboard";
};

export default function CourseModuleView({
  courseModule,
  basePath = COURSE_BASE_PATH,
  variant = "public",
}: CourseModuleViewProps) {
  const hasVideos = moduleHasVideo(courseModule);

  return (
    <div>
      <Link href={basePath} className="link-accent text-sm">
        ← Free Maryland Insurance Course
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${
            hasVideos ? "text-md-red" : "text-stone-400"
          }`}
        >
          Module {courseModule.number}
        </p>
        {!hasVideos && (
          <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-600">
            Coming soon
          </span>
        )}
      </div>
      <h1
        className={`mt-2 text-3xl font-bold sm:text-4xl ${
          hasVideos ? "text-md-black" : "text-stone-500"
        }`}
      >
        {courseModule.title}
      </h1>
      {!hasVideos && (
        <p className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Lesson videos for this module are not available yet. Check back soon,
          or start with Module 4 (Annuities), which has lessons ready to watch.
        </p>
      )}
      {courseModule.note && (
        <p
          className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            hasVideos
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-stone-200 bg-stone-50 text-stone-500"
          }`}
        >
          {courseModule.note}
        </p>
      )}

      <ul
        className={`mt-8 divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 shadow-sm ${
          hasVideos ? "bg-white" : "bg-stone-50 opacity-75"
        }`}
      >
        {courseModule.lessons.map((lesson) => (
          <li key={lesson.id}>
            <CourseLessonRow
              href={courseLessonPath(courseModule, lesson, basePath)}
              lessonId={lesson.id}
              title={lesson.title}
              isQuiz={lesson.isQuiz}
              hasVideo={lessonHasVideo(lesson)}
              variant="full"
            />
          </li>
        ))}
      </ul>

      {variant === "public" && <CTAExamCard className="mt-10" />}
    </div>
  );
}
