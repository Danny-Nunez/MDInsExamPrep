import Link from "next/link";
import CourseLessonRow from "@/components/course/CourseLessonRow";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import {
  courseLessonPath,
  courseModulePath,
  type CourseModule,
} from "@/lib/course";
import { lessonHasVideo, moduleHasVideo } from "@/lib/course/types";

type CourseModuleCardProps = {
  courseModule: CourseModule;
  basePath?: string;
  defaultExpanded?: boolean;
};

export default function CourseModuleCard({
  courseModule,
  basePath = COURSE_BASE_PATH,
  defaultExpanded = false,
}: CourseModuleCardProps) {
  const lessons = courseModule.lessons ?? [];
  const hasVideos = moduleHasVideo(courseModule);
  const availableCount = lessons.filter((l) => lessonHasVideo(l)).length;
  const lessonCount = lessons.filter((l) => !l.isQuiz).length;

  return (
    <article
      className={`rounded-xl border shadow-sm ${
        hasVideos
          ? "border-stone-200 bg-white"
          : "border-stone-200 bg-stone-50 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
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
          <h2
            className={`mt-1 text-lg font-bold sm:text-xl ${
              hasVideos ? "text-md-black" : "text-stone-500"
            }`}
          >
            {hasVideos ? (
              <Link
                href={courseModulePath(courseModule, basePath)}
                className="hover:text-md-red"
              >
                {courseModule.title}
              </Link>
            ) : (
              courseModule.title
            )}
          </h2>
          {courseModule.note && (
            <p
              className={`mt-2 text-sm ${
                hasVideos ? "text-amber-800" : "text-stone-400"
              }`}
            >
              {courseModule.note}
            </p>
          )}
          <p className="mt-2 text-sm text-stone-500">
            {hasVideos ? (
              <>
                {lessonCount} lessons · {availableCount} video
                {availableCount === 1 ? "" : "s"} available now
              </>
            ) : (
              <>{lessonCount} lessons · videos coming soon</>
            )}
          </p>
        </div>
        {hasVideos ? (
          <Link
            href={courseModulePath(courseModule, basePath)}
            className="link-accent shrink-0 text-sm font-semibold"
          >
            View module →
          </Link>
        ) : (
          <span className="shrink-0 text-sm font-semibold text-stone-400">
            Coming soon
          </span>
        )}
      </div>

      {hasVideos && (
        <details
          className="border-t border-stone-100"
          open={defaultExpanded || undefined}
        >
          <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-stone-600 marker:content-none hover:text-md-red">
            <span className="inline-flex items-center gap-2">
              <span className="text-stone-400">▸</span>
              Show lessons
            </span>
          </summary>
          <ul className="divide-y divide-stone-100 px-5 pb-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <CourseLessonRow
                  href={courseLessonPath(courseModule, lesson, basePath)}
                  lessonId={lesson.id}
                  title={lesson.title}
                  isQuiz={lesson.isQuiz}
                  hasVideo={lessonHasVideo(lesson)}
                  variant="compact"
                />
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
