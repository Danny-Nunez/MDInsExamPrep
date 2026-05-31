import { NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/admin-auth";
import { getQuestionReviewFilterOptions } from "@/lib/db/questions";
import type { QuestionStatus } from "@/types/question-bank";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as QuestionStatus | null;
  const domain = searchParams.get("domain")?.trim() || undefined;

  const options = await getQuestionReviewFilterOptions({
    status: status ?? undefined,
    domain,
  });

  return NextResponse.json(options);
}
