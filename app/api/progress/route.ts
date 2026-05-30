import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { recordAnswer, getUserProgress } from "@/lib/db/userProgress";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { conceptId?: string; isCorrect?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const conceptId = body.conceptId?.trim();
  if (!conceptId || typeof body.isCorrect !== "boolean") {
    return NextResponse.json(
      { error: "conceptId and isCorrect are required." },
      { status: 400 }
    );
  }

  const progress = await recordAnswer(
    user.userId,
    conceptId,
    body.isCorrect
  );

  return NextResponse.json({ progress });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const rows = await getUserProgress(user.userId);
  return NextResponse.json({ progress: rows });
}
