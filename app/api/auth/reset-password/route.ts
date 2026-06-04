import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { verifyPasswordResetToken } from "@/lib/email/password-reset-token";
import type { UserDocument } from "@/types/user";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");

    if (!token) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const payload = await verifyPasswordResetToken(token);
    if (!payload || !ObjectId.isValid(payload.userId)) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user || user.email !== payload.email) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
      { _id: user._id },
      { $set: { passwordHash } }
    );

    return NextResponse.json({ message: "Password updated. You can sign in now." });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json(
      { error: "Could not reset password. Please try again." },
      { status: 500 }
    );
  }
}
