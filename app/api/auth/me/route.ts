import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSessionUser } from "@/lib/auth";
import { getUserById, toSessionUser } from "@/lib/db/users";
import type { UserDocument } from "@/types/user";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const doc = await getUserById(session.userId);
  if (!doc?._id) {
    return NextResponse.json({ user: session });
  }

  return NextResponse.json({
    user: toSessionUser(doc as UserDocument & { _id: ObjectId }),
  });
}
