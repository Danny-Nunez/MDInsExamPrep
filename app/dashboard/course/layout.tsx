import DashboardLayout from "@/components/DashboardLayout";
import DashboardCourseProgress from "@/components/dashboard/DashboardCourseProgress";
import { getCourseStats } from "@/lib/course";

export default function DashboardCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lessons: trackableLessonCount } = getCourseStats();

  return (
    <DashboardLayout>
      <div className="mx-auto min-w-0 max-w-5xl overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
        <DashboardCourseProgress trackableLessonCount={trackableLessonCount} />
        {children}
      </div>
    </DashboardLayout>
  );
}
