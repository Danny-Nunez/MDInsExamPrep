import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseModuleView from "@/components/course/CourseModuleView";
import {
  COURSE_BASE_PATH,
  getAllCourseModuleSlugs,
  getCourseModuleBySlug,
} from "@/lib/course";

function moduleLessonCount(courseModule: {
  lessons: { isQuiz?: boolean }[];
}): number {
  return courseModule.lessons.filter((lesson) => !lesson.isQuiz).length;
}

function moduleMetaDescription(courseModule: {
  number: number;
  title: string;
  description?: string;
  lessons: { isQuiz?: boolean }[];
}): string {
  if (courseModule.description) return courseModule.description;
  const count = moduleLessonCount(courseModule);
  return `Free Maryland Life & Health exam prep — Module ${courseModule.number}: ${courseModule.title}. ${count} lessons.`;
}

type PageProps = {
  params: Promise<{ moduleSlug: string }>;
};

export async function generateStaticParams() {
  return getAllCourseModuleSlugs().map((moduleSlug) => ({ moduleSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const courseModule = getCourseModuleBySlug(moduleSlug);
  if (!courseModule) return {};

  return {
    title: `Module ${courseModule.number}: ${courseModule.title} | Free Maryland Insurance Course`,
    description: moduleMetaDescription(courseModule),
    alternates: {
      canonical: `${COURSE_BASE_PATH}/${courseModule.slug}`,
    },
  };
}

export default async function CourseModulePage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const courseModule = getCourseModuleBySlug(moduleSlug);
  if (!courseModule) notFound();

  return <CourseModuleView courseModule={courseModule} />;
}
