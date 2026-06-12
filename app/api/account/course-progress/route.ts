import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getCourseWatchedLessonIds,
  markCourseLessonWatched,
  mergeCourseWatchedLessonIds,
} from "@/lib/db/course-progress";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const watchedLessonIds = await getCourseWatchedLessonIds(session.userId);
  return NextResponse.json({ watchedLessonIds });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { lessonId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const lessonId = String(body.lessonId ?? "").trim();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required." }, { status: 400 });
  }

  const watchedLessonIds = await markCourseLessonWatched(
    session.userId,
    lessonId
  );
  return NextResponse.json({ watchedLessonIds });
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { lessonIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const lessonIds = Array.isArray(body.lessonIds)
    ? body.lessonIds.filter((id): id is string => typeof id === "string")
    : [];

  const watchedLessonIds = await mergeCourseWatchedLessonIds(
    session.userId,
    lessonIds
  );
  return NextResponse.json({ watchedLessonIds });
}
