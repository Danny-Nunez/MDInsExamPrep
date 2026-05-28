import { NextResponse } from "next/server";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import {
  getGeneratedQuizzesForUser,
  saveGeneratedQuiz,
} from "@/lib/db/exams";
import type { QuizQuestion } from "@/types/quiz";

export async function GET() {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const quizzes = await getGeneratedQuizzesForUser(auth.userId);
    return NextResponse.json({ quizzes });
  } catch (err) {
    console.error("GET quizzes error:", err);
    return NextResponse.json(
      { error: "Failed to load generated quizzes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const weakAreas = body.weakAreas as string[] | undefined;
    const questionCount = Number(body.questionCount) || 0;
    const questions = body.questions as QuizQuestion[] | undefined;

    if (!weakAreas?.length || !questions?.length) {
      return NextResponse.json(
        { error: "Invalid quiz data." },
        { status: 400 }
      );
    }

    const quizId = await saveGeneratedQuiz(
      auth.userId,
      weakAreas,
      questionCount,
      questions
    );

    return NextResponse.json({ quizId });
  } catch (err) {
    console.error("POST quizzes error:", err);
    return NextResponse.json(
      { error: "Failed to save quiz." },
      { status: 500 }
    );
  }
}
