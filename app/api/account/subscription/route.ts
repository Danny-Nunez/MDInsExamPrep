import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { periodEndFromSubscription } from "@/lib/stripe-subscription";
import { getStripe } from "@/lib/stripe";
import {
  SUBSCRIPTION_PRICE_LABEL,
  userHasActiveSubscription,
  type SubscriptionStatus,
} from "@/lib/subscription";

const PLAN_NAME = "Maryland Life & Health Exam Prep";

function formatPriceLabel(
  unitAmountCents: number | null | undefined,
  interval: string | null | undefined
): string {
  if (unitAmountCents == null) return SUBSCRIPTION_PRICE_LABEL;
  const dollars =
    unitAmountCents % 100 === 0
      ? String(unitAmountCents / 100)
      : (unitAmountCents / 100).toFixed(2);
  if (interval === "year") return `$${dollars}/year`;
  if (interval === "week") return `$${dollars}/week`;
  return `$${dollars}/month`;
}

function mapStripeStatus(status: string): SubscriptionStatus {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled") return "canceled";
  return "none";
}

export type AccountSubscriptionResponse = {
  planName: string;
  priceLabel: string;
  status: SubscriptionStatus;
  hasSubscription: boolean;
  nextBillDate: string | null;
  cancelAtPeriodEnd: boolean;
};

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  let response: AccountSubscriptionResponse = {
    planName: PLAN_NAME,
    priceLabel: SUBSCRIPTION_PRICE_LABEL,
    status: user.subscriptionStatus ?? "none",
    hasSubscription: userHasActiveSubscription(user),
    nextBillDate: user.subscriptionCurrentPeriodEnd
      ? user.subscriptionCurrentPeriodEnd.toISOString()
      : null,
    cancelAtPeriodEnd: false,
  };

  if (user.stripeSubscriptionId) {
    try {
      const sub = await getStripe().subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      const item = sub.items.data[0];
      const periodEnd = periodEndFromSubscription(sub);

      response = {
        planName: PLAN_NAME,
        priceLabel: formatPriceLabel(
          item?.price?.unit_amount,
          item?.price?.recurring?.interval ?? "month"
        ),
        status: mapStripeStatus(sub.status),
        hasSubscription:
          sub.status === "active" || sub.status === "trialing",
        nextBillDate: periodEnd?.toISOString() ?? response.nextBillDate,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      };
    } catch (err) {
      console.error("account subscription stripe error:", err);
    }
  }

  return NextResponse.json(response);
}
