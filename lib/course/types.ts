export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export type CourseKnowledgeCheckQuestion = {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation?: string;
};

export type CourseKnowledgeCheck = {
  title?: string;
  questions: CourseKnowledgeCheckQuestion[];
};

export type CourseLesson = {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  description?: string;
  videoUrl?: string;
  youtubeId?: string;
  transcript?: string;
  studyGuide?: string;
  knowledgeCheck?: CourseKnowledgeCheck;
  estimatedMinutes?: number;
  difficulty?: CourseDifficulty;
  isQuiz?: boolean;
};

export function lessonHasVideo(lesson: CourseLesson): boolean {
  return Boolean(lesson.videoUrl || lesson.youtubeId);
}

export function moduleHasVideo(courseModule: CourseModule): boolean {
  return courseModule.lessons.some((lesson) => lessonHasVideo(lesson));
}

export type CourseModule = {
  id: string;
  number: number;
  slug: string;
  title: string;
  note?: string;
  lessons: CourseLesson[];
};

export type MarylandCourse = {
  title: string;
  subtitle: string;
  description: string;
  basePath: string;
  modules: CourseModule[];
};
