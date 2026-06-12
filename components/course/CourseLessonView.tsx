import Link from "next/link";
import CourseLessonMedia from "@/components/course/CourseLessonMedia";
import CourseLessonNav from "@/components/course/CourseLessonNav";
import CTAExamCard from "@/components/landing/CTAExamCard";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import {
  courseModulePath,
  lessonHasVideo,
  type CourseLesson,
  type CourseModule,
} from "@/lib/course";

type CourseLessonViewProps = {
  courseModule: CourseModule;
  lesson: CourseLesson;
  basePath?: string;
  variant?: "public" | "dashboard";
};

export default function CourseLessonView({
  courseModule,
  lesson,
  basePath = COURSE_BASE_PATH,
  variant = "public",
}: CourseLessonViewProps) {
  const hasVideo = lessonHasVideo(lesson);
  const isDashboard = variant === "dashboard";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
        <Link href={basePath} className="link-accent">
          Free Course
        </Link>
        <span>/</span>
        <Link
          href={courseModulePath(courseModule, basePath)}
          className="link-accent"
        >
          Module {courseModule.number}
        </Link>
        <span>/</span>
        <span className="text-stone-700">{lesson.id}</span>
      </div>

      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-md-red">
        Module {courseModule.number} · {courseModule.title}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-md-black sm:text-4xl">
        {lesson.title}
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Lesson {lesson.id}
        {lesson.estimatedMinutes ? ` · ~${lesson.estimatedMinutes} min` : ""}
      </p>

      {hasVideo ? (
        <CourseLessonMedia
          lessonId={lesson.id}
          title={lesson.title}
          description={lesson.description}
          videoUrl={lesson.videoUrl}
          youtubeId={lesson.youtubeId}
          transcript={lesson.transcript}
          knowledgeCheck={lesson.knowledgeCheck}
          estimatedMinutes={lesson.estimatedMinutes}
        />
      ) : lesson.isQuiz ? (
        <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-md-black">Module quiz</h2>
          <p className="mt-2 text-stone-600">
            {isDashboard
              ? "This module quiz will unlock as more course content is added. In the meantime, use Practice Exams to test your knowledge."
              : "This quiz will unlock with the full course. For now, test your knowledge with the free 10-question sample or sign up for unlimited practice exams and AI quizzes on your weak areas."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {isDashboard ? (
              <Link href="/practice" className="btn-primary px-5 py-2.5 text-sm">
                Go to Practice Exams
              </Link>
            ) : (
              <>
                <Link href="/sample" className="btn-primary px-5 py-2.5 text-sm">
                  Free 10-question sample
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  Sign up for full practice
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-6 text-center shadow-sm">
          <h2 className="font-semibold text-md-black">Lesson video coming soon</h2>
          <p className="mt-2 text-stone-600">
            We&apos;re building out this lesson. Check back soon, or continue
            with available lessons in this module.
          </p>
          <Link
            href={courseModulePath(courseModule, basePath)}
            className="link-accent mt-4 inline-block text-sm font-semibold"
          >
            View all Module {courseModule.number} lessons →
          </Link>
        </div>
      )}

      {lesson.studyGuide && (
        <div className="prose prose-stone mt-8 max-w-none rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          {lesson.studyGuide}
        </div>
      )}

      <CourseLessonNav
        courseModule={courseModule}
        lesson={lesson}
        basePath={basePath}
      />
      {!isDashboard && <CTAExamCard className="mt-10" />}
    </div>
  );
}
