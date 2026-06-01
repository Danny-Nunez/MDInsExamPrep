import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canAccessFullApp } from "@/lib/access";
import { buildQuizFromApprovedBank } from "@/lib/quiz-from-bank";
export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!canAccessFullApp(user)) {
    return NextResponse.json({ error: "Subscription required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const count = Math.min(Number(searchParams.get("count")) || 20, 60);
  const domain = searchParams.get("domain") ?? undefined;

  const questions = await buildQuizFromApprovedBank({
    limit: count,
    weakAreas: domain ? [domain] : undefined,
  });

  if (questions.length === 0) {
    return NextResponse.json({
      questions: [],
      source: "none",
      fallback: true,
      message:
        "No approved bank questions available. Using built-in seed questions.",
    });
  }

  return NextResponse.json({
    questions,
    source: "bank",
    count: questions.length,
  });
}
