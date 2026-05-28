import { ObjectId } from "mongodb";
import { mergeCategoryPerformance } from "@/lib/domains";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import type {
  CategoryPerformance,
  ExamAttempt,
  ExamImageAnalysis,
  ExamImageWeakArea,
  QuizQuestion,
} from "@/types/quiz";

export type ExamAttemptDocument = ExamAttempt & {
  userId: ObjectId;
  source: "seed" | "ai";
  quizId?: ObjectId;
  questions?: QuizQuestion[];
  createdAt: Date;
};

export type GeneratedQuizDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  weakAreas: string[];
  questionCount: number;
  questions: QuizQuestion[];
  createdAt: Date;
  completedAt?: Date;
  examAttemptId?: string;
  score?: number;
  percentage?: number;
};

export type CategoryPerformanceDocument = {
  userId: ObjectId;
  categories: CategoryPerformance[];
  updatedAt: Date;
};

export type ExamImageAnalysisDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  sourceImageName: string;
  summary: string;
  weakAreas: ExamImageWeakArea[];
  createdAt: Date;
};

export async function saveExamAttempt(
  userId: string,
  attempt: ExamAttempt,
  options?: {
    source?: "seed" | "ai";
    quizId?: string;
    questions?: QuizQuestion[];
  }
): Promise<void> {
  const db = await getDb();
  const userObjectId = new ObjectId(userId);

  await db.collection<ExamAttemptDocument>(COLLECTIONS.examAttempts).insertOne({
    ...attempt,
    userId: userObjectId,
    source: options?.source ?? "seed",
    quizId: options?.quizId ? new ObjectId(options.quizId) : undefined,
    questions: options?.questions,
    createdAt: new Date(attempt.date),
  });

  if (options?.quizId) {
    await db.collection<GeneratedQuizDocument>(COLLECTIONS.generatedQuizzes).updateOne(
      { _id: new ObjectId(options.quizId), userId: userObjectId },
      {
        $set: {
          completedAt: new Date(),
          examAttemptId: attempt.id,
          score: attempt.score,
          percentage: attempt.percentage,
        },
      }
    );
  }

  const perfCol = db.collection<CategoryPerformanceDocument>(
    COLLECTIONS.categoryPerformance
  );
  const existing = await perfCol.findOne({ userId: userObjectId });

  const merged = mergeCategoryPerformance(
    existing?.categories ?? [],
    attempt.domainScores.map((d) => ({
      domain: d.domain,
      subdomain: d.subdomain,
      correct: d.correct,
      total: d.total,
    }))
  );

  await perfCol.updateOne(
    { userId: userObjectId },
    {
      $set: { categories: merged, updatedAt: new Date() },
      $setOnInsert: { userId: userObjectId },
    },
    { upsert: true }
  );
}

export async function getExamAttemptsForUser(
  userId: string
): Promise<ExamAttempt[]> {
  const db = await getDb();
  const docs = await db
    .collection<ExamAttemptDocument>(COLLECTIONS.examAttempts)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    id: doc.id,
    date: doc.date,
    score: doc.score,
    totalQuestions: doc.totalQuestions,
    percentage: doc.percentage,
    answers: doc.answers,
    domainScores: doc.domainScores,
  }));
}

export async function getCategoryPerformanceForUser(
  userId: string
): Promise<CategoryPerformance[]> {
  const db = await getDb();
  const doc = await db
    .collection<CategoryPerformanceDocument>(COLLECTIONS.categoryPerformance)
    .findOne({ userId: new ObjectId(userId) });

  return doc?.categories ?? [];
}

export async function saveGeneratedQuiz(
  userId: string,
  weakAreas: string[],
  questionCount: number,
  questions: QuizQuestion[]
): Promise<string> {
  const db = await getDb();
  const result = await db
    .collection<GeneratedQuizDocument>(COLLECTIONS.generatedQuizzes)
    .insertOne({
      userId: new ObjectId(userId),
      weakAreas,
      questionCount,
      questions,
      createdAt: new Date(),
    });

  return result.insertedId.toString();
}

export async function getGeneratedQuizzesForUser(
  userId: string,
  limit = 20
): Promise<(GeneratedQuizDocument & { id: string })[]> {
  const db = await getDb();
  const docs = await db
    .collection<GeneratedQuizDocument>(COLLECTIONS.generatedQuizzes)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => ({
    ...doc,
    id: doc._id!.toString(),
  }));
}

export async function saveExamImageAnalysis(
  userId: string,
  analysis: {
    sourceImageName: string;
    summary: string;
    weakAreas: ExamImageWeakArea[];
  }
): Promise<string> {
  const db = await getDb();
  const result = await db
    .collection<ExamImageAnalysisDocument>(COLLECTIONS.examImageAnalyses)
    .insertOne({
      userId: new ObjectId(userId),
      sourceImageName: analysis.sourceImageName,
      summary: analysis.summary,
      weakAreas: analysis.weakAreas,
      createdAt: new Date(),
    });

  return result.insertedId.toString();
}

export async function getExamImageAnalysesForUser(
  userId: string,
  limit = 10
): Promise<ExamImageAnalysis[]> {
  const db = await getDb();
  const docs = await db
    .collection<ExamImageAnalysisDocument>(COLLECTIONS.examImageAnalyses)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => ({
    id: doc._id?.toString() ?? "",
    createdAt: doc.createdAt.toISOString(),
    sourceImageName: doc.sourceImageName,
    summary: doc.summary,
    weakAreas: doc.weakAreas,
  }));
}

export async function getRecentLearningContext(userId: string): Promise<{
  recentAttempts: Pick<ExamAttempt, "date" | "percentage" | "domainScores" | "answers">[];
  recentImageAnalyses: Pick<ExamImageAnalysis, "createdAt" | "weakAreas" | "summary">[];
}> {
  const db = await getDb();
  const userObjectId = new ObjectId(userId);

  const [attemptDocs, imageDocs] = await Promise.all([
    db
      .collection<ExamAttemptDocument>(COLLECTIONS.examAttempts)
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        date: 1,
        percentage: 1,
        domainScores: 1,
        answers: 1,
      })
      .toArray(),
    db
      .collection<ExamImageAnalysisDocument>(COLLECTIONS.examImageAnalyses)
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(3)
      .project({
        createdAt: 1,
        weakAreas: 1,
        summary: 1,
      })
      .toArray(),
  ]);

  return {
    recentAttempts: attemptDocs.map((d) => ({
      date: d.date,
      percentage: d.percentage,
      domainScores: d.domainScores ?? [],
      answers: d.answers ?? [],
    })),
    recentImageAnalyses: imageDocs.map((d) => ({
      createdAt: d.createdAt.toISOString(),
      weakAreas: d.weakAreas ?? [],
      summary: d.summary ?? "",
    })),
  };
}
