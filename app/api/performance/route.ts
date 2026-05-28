import { NextResponse } from "next/server";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import { getCategoryPerformanceForUser } from "@/lib/db/exams";

export async function GET() {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const performance = await getCategoryPerformanceForUser(auth.userId);
    return NextResponse.json({ performance });
  } catch (err) {
    console.error("GET performance error:", err);
    return NextResponse.json(
      { error: "Failed to load performance data." },
      { status: 500 }
    );
  }
}
