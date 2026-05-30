import { NextResponse } from "next/server";
import { isAdminResponse, requireAdmin } from "@/lib/admin-auth";
import { listConcepts } from "@/lib/db/concepts";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (isAdminResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const result = await listConcepts({
    domain: searchParams.get("domain") ?? undefined,
    subdomain: searchParams.get("subdomain") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    examWeight: searchParams.get("examWeight") ?? undefined,
    marylandSpecific: searchParams.get("marylandSpecific") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    limit: Number(searchParams.get("limit")) || 100,
    skip: Number(searchParams.get("skip")) || 0,
  });

  return NextResponse.json({
    items: result.items.map((c) => ({
      ...c,
      _id: c._id?.toString?.() ?? c._id,
    })),
    total: result.total,
  });
}
