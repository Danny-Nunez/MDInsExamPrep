import Link from "next/link";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import {
  courseLessonPath,
  courseModulePath,
  getCourseLessonNeighbors,
  type CourseLesson,
  type CourseModule,
} from "@/lib/course";

type CourseLessonNavProps = {
  courseModule: CourseModule;
  lesson: CourseLesson;
  basePath?: string;
};

export default function CourseLessonNav({
  courseModule,
  lesson,
  basePath = COURSE_BASE_PATH,
}: CourseLessonNavProps) {
  const { previous, next } = getCourseLessonNeighbors(
    courseModule.slug,
    lesson.slug
  );

  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {previous ? (
        <Link
          href={courseLessonPath(previous.module, previous.lesson, basePath)}
          className="rounded-lg border border-stone-200 px-4 py-3 text-sm hover:bg-stone-50"
        >
          <span className="block text-stone-500">Previous</span>
          <span className="font-semibold text-md-black">
            {previous.lesson.id} · {previous.lesson.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      <Link
        href={courseModulePath(courseModule, basePath)}
        className="text-center text-sm font-semibold text-md-red hover:underline"
      >
        Back to Module {courseModule.number}
      </Link>

      {next ? (
        <Link
          href={courseLessonPath(next.module, next.lesson, basePath)}
          className="rounded-lg border border-stone-200 px-4 py-3 text-sm hover:bg-stone-50 sm:text-right"
        >
          <span className="block text-stone-500">Next</span>
          <span className="font-semibold text-md-black">
            {next.lesson.id} · {next.lesson.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
