import type { Metadata } from "next";
import CourseHubView from "@/components/course/CourseHubView";
import { absoluteUrl } from "@/lib/seo-sitemap";
import { COURSE_BASE_PATH, MARYLAND_COURSE } from "@/lib/course";

export const metadata: Metadata = {
  title: `${MARYLAND_COURSE.subtitle} | Maryland Insurance Exam`,
  description: MARYLAND_COURSE.description,
  alternates: {
    canonical: COURSE_BASE_PATH,
  },
  openGraph: {
    title: `${MARYLAND_COURSE.subtitle} | Maryland Insurance Exam`,
    description: MARYLAND_COURSE.description,
    url: absoluteUrl(COURSE_BASE_PATH),
    type: "website",
  },
};

export default function FreeMarylandInsuranceCoursePage() {
  return <CourseHubView />;
}
