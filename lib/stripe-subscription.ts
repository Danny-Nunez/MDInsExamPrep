import type Stripe from "stripe";
import { updateUserSubscription } from "@/lib/db/users";
import type { SubscriptionStatus } from "@/lib/subscription";

export function periodEndFromSubscription(
  sub: Stripe.Subscription
): Date | undefined {
  const end = sub.items?.data?.[0]?.current_period_end;
  if (typeof end === "number") {
    return new Date(end * 1000);
  }
  return undefined;
}

export async function applySubscriptionFromStripe(
  userId: string,
  sub: Stripe.Subscription
): Promise<void> {
  let status: SubscriptionStatus = "none";
  if (sub.status === "active" || sub.status === "trialing") {
    status = "active";
  } else if (sub.status === "past_due" || sub.status === "unpaid") {
    status = "past_due";
  } else if (sub.status === "canceled") {
    status = "canceled";
  }

  await updateUserSubscription(userId, {
    subscriptionStatus: status,
    stripeSubscriptionId: sub.id,
    stripeCustomerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    subscriptionCurrentPeriodEnd: periodEndFromSubscription(sub),
  });
}

export async function activateFromCheckoutSession(
  stripe: Stripe,
  userId: string,
  session: Stripe.Checkout.Session
): Promise<boolean> {
  if (session.metadata?.userId !== userId) return false;
  const paid =
    session.payment_status === "paid" || session.status === "complete";
  if (!paid) return false;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) return false;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  await applySubscriptionFromStripe(userId, sub);
  return true;
}
