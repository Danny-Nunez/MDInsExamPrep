import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { isAdminEmail } from "@/lib/admin-emails";
import { userHasActiveSubscription } from "@/lib/subscription";
import type { SessionUser, UserDocument } from "@/types/user";

export function toSessionUser(user: UserDocument & { _id: ObjectId }): SessionUser {
  return {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    hasSubscription: userHasActiveSubscription(user),
    isAdmin: isAdminEmail(user.email),
  };
}

export async function getUserById(userId: string): Promise<UserDocument | null> {
  const db = await getDb();
  if (!ObjectId.isValid(userId)) return null;
  return db.collection<UserDocument>(COLLECTIONS.users).findOne({
    _id: new ObjectId(userId),
  });
}

export async function getUserByEmail(email: string): Promise<UserDocument | null> {
  const db = await getDb();
  return db.collection<UserDocument>(COLLECTIONS.users).findOne({
    email: email.trim().toLowerCase(),
  });
}

export async function updateUserSubscription(
  userId: string,
  patch: Partial<
    Pick<
      UserDocument,
      | "subscriptionStatus"
      | "stripeCustomerId"
      | "stripeSubscriptionId"
      | "subscriptionCurrentPeriodEnd"
    >
  >
) {
  const db = await getDb();
  if (!ObjectId.isValid(userId)) return false;
  await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
    { _id: new ObjectId(userId) },
    { $set: patch }
  );
  return true;
}
