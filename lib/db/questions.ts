import type { Filter } from "mongodb";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { EXAM_LIKE_DIFFICULTY_LABELS } from "@/lib/normalize-difficulty";
import type {
  BankQuizQuestion,
  QuestionDocument,
  QuestionStatus,
} from "@/types/question-bank";

export type QuestionFilters = {
  status?: QuestionStatus;
  conceptId?: string;
  domain?: string;
  subdomain?: string;
  /** Partial match on blueprint concept name (topic). */
  concept?: string;
  difficulty?: string;
  limit?: number;
  skip?: number;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toQuizQuestion(doc: QuestionDocument & { _id?: ObjectId }): BankQuizQuestion {
  return {
    id: doc._id!.toString(),
    conceptId: doc.conceptId,
    domain: doc.domain,
    subdomain: doc.subdomain,
    concept: doc.concept,
    objective: doc.objective,
    difficulty: doc.difficulty,
    questionType: doc.questionType,
    question: doc.question,
    choices: doc.choices,
    correctAnswer: doc.correctAnswer,
    explanation: doc.explanation,
  };
}

export async function ensureQuestionIndexes() {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  await col.createIndex({ status: 1, domain: 1 });
  await col.createIndex({ conceptId: 1, status: 1 });
  await col.createIndex({ createdAt: -1 });
}

export async function insertQuestions(
  docs: Omit<QuestionDocument, "createdAt" | "updatedAt">[]
) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  const now = new Date();
  const payload = docs.map((d) => ({
    ...d,
    createdAt: now,
    updatedAt: now,
  }));
  if (payload.length === 0) return [];
  const result = await col.insertMany(payload);
  return Object.values(result.insertedIds).map(String);
}

export async function listQuestions(filters: QuestionFilters = {}) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  const query: Filter<QuestionDocument> = {};

  if (filters.status) query.status = filters.status;
  if (filters.conceptId) query.conceptId = filters.conceptId;
  if (filters.domain) query.domain = filters.domain;
  if (filters.subdomain) query.subdomain = filters.subdomain;
  if (filters.concept?.trim()) {
    query.concept = {
      $regex: escapeRegex(filters.concept.trim()),
      $options: "i",
    };
  }
  if (filters.difficulty) query.difficulty = filters.difficulty;

  const limit = Math.min(filters.limit ?? 50, 200);
  const skip = filters.skip ?? 0;

  const [items, total] = await Promise.all([
    col.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(query),
  ]);

  return { items, total };
}

export async function getQuestionReviewFilterOptions(filters: {
  status?: QuestionStatus;
  domain?: string;
}) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  const query: Filter<QuestionDocument> = {};
  if (filters.status) query.status = filters.status;
  if (filters.domain) query.domain = filters.domain;

  const [subdomains, concepts] = await Promise.all([
    filters.domain
      ? col.distinct("subdomain", query)
      : Promise.resolve([] as string[]),
    filters.domain
      ? col.distinct("concept", query)
      : Promise.resolve([] as string[]),
  ]);

  return {
    subdomains: subdomains.filter(Boolean).sort((a, b) => a.localeCompare(b)),
    concepts: concepts.filter(Boolean).sort((a, b) => a.localeCompare(b)),
  };
}

export async function getQuestionById(id: string) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  if (!ObjectId.isValid(id)) return null;
  return col.findOne({ _id: new ObjectId(id) });
}

export async function updateQuestion(
  id: string,
  patch: Partial<
    Pick<
      QuestionDocument,
      | "question"
      | "choices"
      | "correctAnswer"
      | "explanation"
      | "status"
      | "difficulty"
    >
  >
) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  if (!ObjectId.isValid(id)) return false;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function getApprovedQuizQuestions(options: {
  domain?: string;
  difficulty?: string;
  conceptIds?: string[];
  limit?: number;
}): Promise<BankQuizQuestion[]> {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  const query: Filter<QuestionDocument> = { status: "approved" };

  if (options.domain) query.domain = options.domain;
  if (options.difficulty) {
    query.difficulty = options.difficulty;
  } else {
    query.difficulty = { $in: [...EXAM_LIKE_DIFFICULTY_LABELS] };
  }
  if (options.conceptIds?.length) {
    query.conceptId = { $in: options.conceptIds };
  }

  const limit = Math.min(options.limit ?? 20, 60);
  const docs = await col.aggregate<QuestionDocument>([
    { $match: query },
    { $sample: { size: limit } },
  ]).toArray();

  return docs.map((d) => toQuizQuestion(d as QuestionDocument & { _id: ObjectId }));
}

export async function countQuestionsByConcept(conceptId: string) {
  const db = await getDb();
  const col = db.collection<QuestionDocument>(COLLECTIONS.questions);
  return col.countDocuments({ conceptId });
}
