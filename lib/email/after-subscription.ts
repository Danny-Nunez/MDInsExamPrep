import type Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { getUserById } from "@/lib/db/users";
import { periodEndFromSubscription } from "@/lib/stripe-subscription";
import {
  formatStripePriceLabel,
  sendSubscriptionActiveEmail,
} from "@/lib/email/send-transactional";
import type { UserDocument } from "@/types/user";

export async function sendSubscriptionConfirmationEmail(
  userId: string,
  sub: Stripe.Subscription
): Promise<void> {
  const user = await getUserById(userId);
  if (!user?.email) return;

  if (user.subscriptionConfirmationEmailSubId === sub.id) {
    return;
  }

  const item = sub.items.data[0];
  const priceLabel = formatStripePriceLabel(
    item?.price?.unit_amount,
    item?.price?.recurring?.interval ?? "month"
  );
  const periodEnd = periodEndFromSubscription(sub);

  try {
    await sendSubscriptionActiveEmail({
      email: user.email,
      name: user.name,
      priceLabel,
      nextBillDate: periodEnd ?? null,
    });

    const db = await getDb();
    if (ObjectId.isValid(userId)) {
      await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
        { _id: new ObjectId(userId) },
        { $set: { subscriptionConfirmationEmailSubId: sub.id } }
      );
    }
  } catch (err) {
    console.error("subscription confirmation email error:", err);
  }
}
