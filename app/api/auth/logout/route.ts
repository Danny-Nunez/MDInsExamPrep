import { NextResponse } from "next/server";
import { withoutSessionCookie } from "@/lib/auth";

export async function POST() {
  return withoutSessionCookie(NextResponse.json({ ok: true }));
}
