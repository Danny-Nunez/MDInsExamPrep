import { NextResponse } from "next/server";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import {
  getExamAttemptsForUser,
  saveExamAttempt,
} from "@/lib/db/exams";
import type { ExamAttempt, QuizQuestion } from "@/types/quiz";

export async function GET() {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const attempts = await getExamAttemptsForUser(auth.userId);
    return NextResponse.json({ attempts });
  } catch (err) {
    console.error("GET exams error:", err);
    return NextResponse.json(
      { error: "Failed to load exam history." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const attempt = body.attempt as ExamAttempt | undefined;

    if (!attempt?.id || !Array.isArray(attempt.answers)) {
      return NextResponse.json(
        { error: "Invalid exam attempt data." },
        { status: 400 }
      );
    }

    await saveExamAttempt(auth.userId, attempt, {
      source: body.source === "ai" ? "ai" : "seed",
      quizId: body.quizId ? String(body.quizId) : undefined,
      questions: body.questions as QuizQuestion[] | undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST exams error:", err);
    return NextResponse.json(
      { error: "Failed to save exam." },
      { status: 500 }
    );
  }
}
