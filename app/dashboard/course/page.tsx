import type { Metadata } from "next";
import CourseHubView from "@/components/course/CourseHubView";
import { DASHBOARD_COURSE_BASE_PATH, MARYLAND_COURSE } from "@/lib/course";

export const metadata: Metadata = {
  title: `${MARYLAND_COURSE.subtitle} | Dashboard`,
  robots: { index: false, follow: false },
};

export default function DashboardCoursePage() {
  return (
    <CourseHubView
      basePath={DASHBOARD_COURSE_BASE_PATH}
      variant="dashboard"
    />
  );
}
