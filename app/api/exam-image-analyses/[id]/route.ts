import { NextResponse } from "next/server";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import { deleteExamImageAnalysis } from "@/lib/db/exams";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await context.params;
    const deleted = await deleteExamImageAnalysis(auth.userId, id);
    if (!deleted) {
      return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE exam-image-analyses error:", err);
    return NextResponse.json(
      { error: "Failed to delete analysis." },
      { status: 500 }
    );
  }
}
