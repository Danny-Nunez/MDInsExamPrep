import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseLessonView from "@/components/course/CourseLessonView";
import {
  COURSE_BASE_PATH,
  getAllCourseLessonParams,
  getCourseLesson,
} from "@/lib/course";

type PageProps = {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
};

export async function generateStaticParams() {
  return getAllCourseLessonParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const result = getCourseLesson(moduleSlug, lessonSlug);
  if (!result) return {};

  const { module: courseModule, lesson } = result;
  return {
    title: `${lesson.id} ${lesson.title} | Module ${courseModule.number} | Free Maryland Insurance Course`,
    description:
      lesson.description ??
      `Free lesson ${lesson.id}: ${lesson.title} — Maryland Life & Health insurance exam prep.`,
    alternates: {
      canonical: `${COURSE_BASE_PATH}/${courseModule.slug}/${lesson.slug}`,
    },
  };
}

export default async function CourseLessonPage({ params }: PageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const result = getCourseLesson(moduleSlug, lessonSlug);
  if (!result) notFound();

  const { module: courseModule, lesson } = result;

  return <CourseLessonView courseModule={courseModule} lesson={lesson} />;
}
