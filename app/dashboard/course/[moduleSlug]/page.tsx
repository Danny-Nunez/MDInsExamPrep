import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseModuleView from "@/components/course/CourseModuleView";
import {
  DASHBOARD_COURSE_BASE_PATH,
  getAllCourseModuleSlugs,
  getCourseModuleBySlug,
} from "@/lib/course";

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
    title: `Module ${courseModule.number}: ${courseModule.title} | Free Course`,
    robots: { index: false, follow: false },
  };
}

export default async function DashboardCourseModulePage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const courseModule = getCourseModuleBySlug(moduleSlug);
  if (!courseModule) notFound();

  return (
    <CourseModuleView
      courseModule={courseModule}
      basePath={DASHBOARD_COURSE_BASE_PATH}
      variant="dashboard"
    />
  );
}
