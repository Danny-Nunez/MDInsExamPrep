import { COURSE_BASE_PATH } from "@/lib/course/constants";
import { MARYLAND_COURSE } from "@/lib/course/maryland-course";
import type { CourseLesson, CourseModule } from "@/lib/course/types";

export {
  COURSE_BASE_PATH,
  DASHBOARD_COURSE_BASE_PATH,
} from "@/lib/course/constants";
export { MARYLAND_COURSE } from "@/lib/course/maryland-course";
export type {
  CourseDifficulty,
  CourseKnowledgeCheck,
  CourseKnowledgeCheckQuestion,
  CourseLesson,
  CourseModule,
  MarylandCourse,
} from "@/lib/course/types";
export { lessonHasVideo, moduleHasVideo } from "@/lib/course/types";

export function getAllCourseModules(): CourseModule[] {
  return MARYLAND_COURSE.modules;
}

export function getCourseModuleBySlug(slug: string): CourseModule | null {
  return MARYLAND_COURSE.modules.find((m) => m.slug === slug) ?? null;
}

export function getCourseLesson(
  moduleSlug: string,
  lessonSlug: string
): { module: CourseModule; lesson: CourseLesson } | null {
  const courseModule = getCourseModuleBySlug(moduleSlug);
  if (!courseModule) return null;
  const lesson = courseModule.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  return { module: courseModule, lesson };
}

export function courseModulePath(
  module: CourseModule,
  basePath: string = COURSE_BASE_PATH
): string {
  return `${basePath}/${module.slug}`;
}

export function courseLessonPath(
  courseModule: CourseModule,
  lesson: CourseLesson,
  basePath: string = COURSE_BASE_PATH
): string {
  return `${courseModulePath(courseModule, basePath)}/${lesson.slug}`;
}

export function getCourseLessonNeighbors(
  moduleSlug: string,
  lessonSlug: string
): {
  previous: { module: CourseModule; lesson: CourseLesson } | null;
  next: { module: CourseModule; lesson: CourseLesson } | null;
} {
  const flat = MARYLAND_COURSE.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({ module: courseModule, lesson }))
  );
  const index = flat.findIndex(
    (item) =>
      item.module.slug === moduleSlug && item.lesson.slug === lessonSlug
  );
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? flat[index - 1]! : null,
    next: index < flat.length - 1 ? flat[index + 1]! : null,
  };
}

export function getAllCourseLessonParams(): {
  moduleSlug: string;
  lessonSlug: string;
}[] {
  return MARYLAND_COURSE.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({
      moduleSlug: courseModule.slug,
      lessonSlug: lesson.slug,
    }))
  );
}

export function getAllCourseLessonIds(): string[] {
  return MARYLAND_COURSE.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => lesson.id)
  );
}

export function getAllCourseModuleSlugs(): string[] {
  return MARYLAND_COURSE.modules.map((m) => m.slug);
}

export function getCourseStats() {
  const modules = MARYLAND_COURSE.modules.length;
  const lessons = MARYLAND_COURSE.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => !l.isQuiz).length,
    0
  );
  const quizzes = MARYLAND_COURSE.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isQuiz).length,
    0
  );
  return { modules, lessons, quizzes };
}

export function getCourseHtmlSitemapLinks(): { label: string; href: string }[] {
  return MARYLAND_COURSE.modules.map((courseModule) => ({
    label: `Module ${courseModule.number}: ${courseModule.title}`,
    href: courseModulePath(courseModule),
  }));
}

export function getCourseLessonHtmlSitemapLinks(): {
  label: string;
  href: string;
}[] {
  return MARYLAND_COURSE.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({
      label: `${lesson.id} ${lesson.title}`,
      href: courseLessonPath(courseModule, lesson),
    }))
  );
}

/** Module + lesson paths for sitemap.xml (hub is listed in PUBLIC_SITEMAP_PAGES). */
export function getCourseSitemapPaths(): string[] {
  const paths: string[] = [];
  for (const courseModule of MARYLAND_COURSE.modules) {
    paths.push(courseModulePath(courseModule));
    for (const lesson of courseModule.lessons) {
      paths.push(courseLessonPath(courseModule, lesson));
    }
  }
  return paths;
}

/** True when a sitemap path is a course module (not a lesson). */
export function isCourseModuleSitemapPath(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  return (
    segments.length === 2 &&
    segments[0] === "free-maryland-insurance-course"
  );
}
