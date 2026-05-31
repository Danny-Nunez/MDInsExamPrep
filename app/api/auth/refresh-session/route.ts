import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  createSessionToken,
  getSessionUser,
  withSessionCookie,
} from "@/lib/auth";
import { getUserById, toSessionUser } from "@/lib/db/users";
import type { UserDocument } from "@/types/user";

export async function POST() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const doc = await getUserById(session.userId);
    if (!doc?._id) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = toSessionUser(
      doc as UserDocument & { _id: ObjectId }
    );
    const token = await createSessionToken(user);
    return withSessionCookie(NextResponse.json({ user }), token);
  } catch (err) {
    console.error("refresh-session error:", err);
    return NextResponse.json(
      { error: "Could not refresh session." },
      { status: 500 }
    );
  }
}
