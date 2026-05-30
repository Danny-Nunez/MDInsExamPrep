import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ isAdmin: false, user: null });
  }
  return NextResponse.json({
    user: { name: user.name, email: user.email },
    isAdmin: isAdminEmail(user.email),
  });
}
