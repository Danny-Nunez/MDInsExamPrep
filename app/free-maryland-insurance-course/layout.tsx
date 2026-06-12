import LandingNav from "@/components/LandingNav";
import CourseProgressBanner from "@/components/course/CourseProgressBanner";
import SiteFooter from "@/components/landing/SiteFooter";
import { getCourseStats } from "@/lib/course";

export default function FreeCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lessons: trackableLessonCount } = getCourseStats();

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <LandingNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <CourseProgressBanner trackableLessonCount={trackableLessonCount} />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
