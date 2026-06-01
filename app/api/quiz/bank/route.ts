import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getApprovedQuizQuestions } from "@/lib/db/questions";
import { getWeakConceptIds } from "@/lib/db/userProgress";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const weakOnly = searchParams.get("weakOnly") === "1";
  const subdomains = searchParams.getAll("subdomain").filter(Boolean);
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 60);

  let conceptIds: string[] | undefined;
  if (weakOnly) {
    conceptIds = await getWeakConceptIds(user.userId, 30);
    if (conceptIds.length === 0) {
      return NextResponse.json({
        questions: [],
        message: "No weak areas tracked yet. Complete a bank quiz first.",
      });
    }
  }

  const questions = await getApprovedQuizQuestions({
    domain,
    subdomains: subdomains.length ? subdomains : undefined,
    difficulty,
    conceptIds,
    limit,
  });

  if (questions.length === 0) {
    return NextResponse.json({
      questions: [],
      message:
        "No approved questions match these filters. Generate and approve questions in admin.",
    });
  }

  return NextResponse.json({ questions });
}
