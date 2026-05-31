import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  createSessionToken,
  verifyPassword,
  withSessionCookie,
} from "@/lib/auth";
import { COLLECTIONS } from "@/lib/db/collections";
import { toSessionUser } from "@/lib/db/users";
import { isAdminEmail } from "@/lib/admin-emails";
import type { UserDocument } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db
      .collection<UserDocument>(COLLECTIONS.users)
      .findOne({ email });

    if (!user || !user._id) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (isAdminEmail(email) && user.role !== "admin") {
      await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
        { _id: user._id },
        { $set: { role: "admin" } }
      );
      user.role = "admin";
    }

    const sessionUser = toSessionUser(
      user as UserDocument & { _id: ObjectId }
    );
    const token = await createSessionToken(sessionUser);
    return withSessionCookie(
      NextResponse.json({ user: sessionUser }),
      token
    );
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
