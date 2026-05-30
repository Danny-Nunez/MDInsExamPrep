import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-emails";
import type { SessionUser } from "@/types/user";

export { getAdminEmails, isAdminEmail } from "@/lib/admin-emails";

export async function requireAdmin(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  return user;
}

export function isAdminResponse(
  value: SessionUser | NextResponse
): value is NextResponse {
  return value instanceof NextResponse;
}
