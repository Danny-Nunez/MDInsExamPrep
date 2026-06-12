import type { Metadata } from "next";
import CourseHubView from "@/components/course/CourseHubView";
import { COURSE_BASE_PATH, MARYLAND_COURSE } from "@/lib/course";

export const metadata: Metadata = {
  title: `${MARYLAND_COURSE.subtitle} | Maryland Insurance Exam`,
  description: MARYLAND_COURSE.description,
  alternates: {
    canonical: COURSE_BASE_PATH,
  },
};

export default function FreeMarylandInsuranceCoursePage() {
  return <CourseHubView />;
}
