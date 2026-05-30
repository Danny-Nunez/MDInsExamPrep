import { NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/admin-auth";
import { getQuestionById, updateQuestion } from "@/lib/db/questions";
import type { QuestionStatus } from "@/types/question-bank";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { id } = await params;
  const question = await getQuestionById(id);
  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...question,
    _id: question._id?.toString(),
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const patch: Parameters<typeof updateQuestion>[1] = {};

  if (typeof body.question === "string") patch.question = body.question;
  if (Array.isArray(body.choices) && body.choices.length === 4) {
    patch.choices = body.choices as string[];
  }
  if (typeof body.correctAnswer === "string") {
    patch.correctAnswer = body.correctAnswer;
  }
  if (typeof body.explanation === "string") {
    patch.explanation = body.explanation;
  }
  if (typeof body.difficulty === "string") patch.difficulty = body.difficulty;
  if (
    body.status === "needs_review" ||
    body.status === "approved" ||
    body.status === "rejected"
  ) {
    patch.status = body.status as QuestionStatus;
  }

  const ok = await updateQuestion(id, patch);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await getQuestionById(id);
  return NextResponse.json({
    ...updated,
    _id: updated?._id?.toString(),
  });
}
