import type { Filter } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import type { ConceptDocument } from "@/types/question-bank";

export type ConceptFilters = {
  domain?: string;
  subdomain?: string;
  difficulty?: string;
  examWeight?: string;
  marylandSpecific?: string;
  status?: string;
  search?: string;
  limit?: number;
  skip?: number;
};

function conceptsCol(db: Awaited<ReturnType<typeof getDb>>) {
  return db.collection<ConceptDocument>(COLLECTIONS.concepts);
}

export async function ensureConceptIndexes() {
  const db = await getDb();
  const col = conceptsCol(db);
  await col.createIndex({ objectiveId: 1 }, { unique: true });
  await col.createIndex({ domain: 1, subdomain: 1 });
  await col.createIndex({ difficulty: 1, examWeight: 1, status: 1 });
}

export async function listConcepts(filters: ConceptFilters = {}) {
  const db = await getDb();
  const col = conceptsCol(db);
  const query: Filter<ConceptDocument> = {};

  if (filters.domain) query.domain = filters.domain;
  if (filters.subdomain) query.subdomain = filters.subdomain;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.examWeight) query.examWeight = filters.examWeight;
  if (filters.marylandSpecific) query.marylandSpecific = filters.marylandSpecific;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { concept: { $regex: filters.search, $options: "i" } },
      { objective: { $regex: filters.search, $options: "i" } },
      { objectiveId: { $regex: filters.search, $options: "i" } },
    ];
  }

  const limit = Math.min(filters.limit ?? 100, 500);
  const skip = filters.skip ?? 0;

  const [items, total] = await Promise.all([
    col.find(query).sort({ domain: 1, subdomain: 1, objectiveId: 1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(query),
  ]);

  return { items, total };
}

export async function getConceptByObjectiveId(objectiveId: string) {
  const db = await getDb();
  return conceptsCol(db).findOne({ objectiveId });
}

export async function upsertConcepts(docs: ConceptDocument[]) {
  const db = await getDb();
  const col = conceptsCol(db);
  if (docs.length === 0) return { upserted: 0 };

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { objectiveId: doc.objectiveId },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops, { ordered: false });
  return {
    upserted: (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0),
  };
}
