import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import { COLLECTIONS } from "@/lib/db/collections";
import type { UserDocument } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db
      .collection<UserDocument>(COLLECTIONS.users)
      .findOne({ email });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const insertResult = await db
      .collection<UserDocument>(COLLECTIONS.users)
      .insertOne({
        email,
        name,
        passwordHash,
        createdAt: new Date(),
      });

    const userId = insertResult.insertedId.toString();
    const token = await createSessionToken({ userId, email, name });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { userId, email, name },
    });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
