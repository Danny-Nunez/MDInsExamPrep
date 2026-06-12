import { ObjectId } from "mongodb";
import { getAllCourseLessonIds } from "@/lib/course";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import type { UserDocument } from "@/types/user";

const VALID_LESSON_IDS = new Set(getAllCourseLessonIds());

function sanitizeLessonIds(ids: string[]): string[] {
  return [...new Set(ids.filter((id) => VALID_LESSON_IDS.has(id)))];
}

export async function getCourseWatchedLessonIds(
  userId: string
): Promise<string[]> {
  const db = await getDb();
  if (!ObjectId.isValid(userId)) return [];
  const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne(
    { _id: new ObjectId(userId) },
    { projection: { courseWatchedLessonIds: 1 } }
  );
  return sanitizeLessonIds(user?.courseWatchedLessonIds ?? []);
}

export async function mergeCourseWatchedLessonIds(
  userId: string,
  lessonIds: string[]
): Promise<string[]> {
  const db = await getDb();
  if (!ObjectId.isValid(userId)) return [];

  const incoming = sanitizeLessonIds(lessonIds);
  const existing = await getCourseWatchedLessonIds(userId);
  const merged = sanitizeLessonIds([...existing, ...incoming]);

  await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { courseWatchedLessonIds: merged } }
  );

  return merged;
}

export async function markCourseLessonWatched(
  userId: string,
  lessonId: string
): Promise<string[]> {
  if (!VALID_LESSON_IDS.has(lessonId)) return getCourseWatchedLessonIds(userId);
  return mergeCourseWatchedLessonIds(userId, [lessonId]);
}
