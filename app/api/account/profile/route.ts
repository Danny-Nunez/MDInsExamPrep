import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  createSessionToken,
  getSessionUser,
  withSessionCookie,
} from "@/lib/auth";
import { getUserById, toSessionUser, updateUserName } from "@/lib/db/users";
import { normalizeFullName } from "@/lib/format-display-name";
import { getStripe } from "@/lib/stripe";
import type { UserDocument } from "@/types/user";

export async function PATCH(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    let body: { name?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    const rawName = String(body.name ?? "").trim();
    const name = normalizeFullName(rawName);
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (name.length > 80) {
      return NextResponse.json(
        { error: "Name is too long (max 80 characters)." },
        { status: 400 }
      );
    }

    const updated = await updateUserName(session.userId, name);
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userDoc = await getUserById(session.userId);
    if (!userDoc?._id) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (userDoc.stripeCustomerId) {
      try {
        await getStripe().customers.update(userDoc.stripeCustomerId, { name });
      } catch (err) {
        console.error("stripe customer name update error:", err);
      }
    }

    const user = toSessionUser(userDoc as UserDocument & { _id: ObjectId });
    const token = await createSessionToken(user);
    return withSessionCookie(NextResponse.json({ user }), token);
  } catch (err) {
    console.error("account profile update error:", err);
    return NextResponse.json(
      { error: "Could not update name. Please try again." },
      { status: 500 }
    );
  }
}
