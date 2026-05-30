import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import type { UserProgressDocument } from "@/types/question-bank";

export function calcMasteryScore(correct: number, attempts: number): number {
  if (attempts <= 0) return 0;
  return Math.round((correct / attempts) * 100);
}

export async function ensureUserProgressIndexes() {
  const db = await getDb();
  const col = db.collection<UserProgressDocument>(COLLECTIONS.userProgress);
  await col.createIndex({ userId: 1, conceptId: 1 }, { unique: true });
  await col.createIndex({ userId: 1, masteryScore: 1 });
}

export async function recordAnswer(
  userId: string,
  conceptId: string,
  isCorrect: boolean
) {
  const db = await getDb();
  const col = db.collection<UserProgressDocument>(COLLECTIONS.userProgress);
  const existing = await col.findOne({ userId, conceptId });

  const attempts = (existing?.attempts ?? 0) + 1;
  const correct = (existing?.correct ?? 0) + (isCorrect ? 1 : 0);
  const incorrect = (existing?.incorrect ?? 0) + (isCorrect ? 0 : 1);
  const masteryScore = calcMasteryScore(correct, attempts);

  const doc: UserProgressDocument = {
    userId,
    conceptId,
    attempts,
    correct,
    incorrect,
    masteryScore,
    lastPracticedAt: new Date(),
  };

  await col.updateOne(
    { userId, conceptId },
    { $set: doc },
    { upsert: true }
  );

  return doc;
}

export async function getWeakConceptIds(
  userId: string,
  limit = 20
): Promise<string[]> {
  const db = await getDb();
  const col = db.collection<UserProgressDocument>(COLLECTIONS.userProgress);
  const rows = await col
    .find({ userId, attempts: { $gt: 0 } })
    .sort({ masteryScore: 1, lastPracticedAt: 1 })
    .limit(limit)
    .toArray();

  return rows
    .filter((r) => r.masteryScore < 75)
    .map((r) => r.conceptId);
}

export async function getUserProgress(userId: string) {
  const db = await getDb();
  const col = db.collection<UserProgressDocument>(COLLECTIONS.userProgress);
  return col.find({ userId }).sort({ masteryScore: 1 }).toArray();
}
