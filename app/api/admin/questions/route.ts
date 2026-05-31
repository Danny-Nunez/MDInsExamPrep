import { NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/admin-auth";
import { listQuestions } from "@/lib/db/questions";
import type { QuestionStatus } from "@/types/question-bank";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as QuestionStatus | null;

  const result = await listQuestions({
    status: status ?? undefined,
    conceptId: searchParams.get("conceptId") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    subdomain: searchParams.get("subdomain") ?? undefined,
    concept: searchParams.get("concept") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    limit: Number(searchParams.get("limit")) || 50,
    skip: Number(searchParams.get("skip")) || 0,
  });

  return NextResponse.json({
    items: result.items.map((q) => ({
      ...q,
      _id: q._id?.toString(),
    })),
    total: result.total,
  });
}
