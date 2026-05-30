import { NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/admin-auth";
import { getConceptByObjectiveId } from "@/lib/db/concepts";
import {
  countQuestionsByConcept,
  insertQuestions,
} from "@/lib/db/questions";
import { generateQuestionsForConcept } from "@/lib/generate-concept-questions";

type RouteParams = { params: Promise<{ objectiveId: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { objectiveId } = await params;
  const concept = await getConceptByObjectiveId(objectiveId);

  if (!concept) {
    return NextResponse.json({ error: "Concept not found." }, { status: 404 });
  }

  try {
    const generated = await generateQuestionsForConcept(concept, 10);
    const inserted = await insertQuestions(
      generated.map((q) => ({
        conceptId: concept.objectiveId,
        domain: concept.domain,
        subdomain: concept.subdomain,
        concept: concept.concept,
        objective: concept.objective,
        question: q.question,
        choices: q.choices,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: concept.difficulty,
        questionType: concept.questionType,
        status: "needs_review",
      }))
    );

    const totalForConcept = await countQuestionsByConcept(concept.objectiveId);

    return NextResponse.json({
      created: inserted.length,
      totalForConcept,
      questionIds: inserted,
    });
  } catch (err) {
    console.error("generate concept questions:", err);
    return NextResponse.json(
      { error: "Failed to generate questions. Try again." },
      { status: 500 }
    );
  }
}
