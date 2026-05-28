import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import type { SessionUser } from "@/types/user";

export async function requireUser(): Promise<
  SessionUser | NextResponse
> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }
  return user;
}

export function isErrorResponse(
  value: SessionUser | NextResponse
): value is NextResponse {
  return value instanceof NextResponse;
}
