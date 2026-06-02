import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import {
  applySubscriptionFromStripe,
  periodEndFromSubscription,
} from "@/lib/stripe-subscription";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (session.isAdmin) {
    return NextResponse.json(
      { error: "Admin accounts are not billed through Stripe." },
      { status: 400 }
    );
  }

  const user = await getUserById(session.userId);
  if (!user?.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "No active subscription found to cancel." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const existing = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );

    if (existing.status === "canceled") {
      return NextResponse.json(
        { error: "This subscription is already canceled." },
        { status: 400 }
      );
    }

    if (existing.cancel_at_period_end) {
      const accessEndsAt = periodEndFromSubscription(existing);
      return NextResponse.json({
        cancelAtPeriodEnd: true,
        accessEndsAt: accessEndsAt?.toISOString() ?? null,
        message: "Subscription is already set to cancel at period end.",
      });
    }

    const sub = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await applySubscriptionFromStripe(session.userId, sub);

    const accessEndsAt = periodEndFromSubscription(sub);

    return NextResponse.json({
      cancelAtPeriodEnd: true,
      accessEndsAt: accessEndsAt?.toISOString() ?? null,
    });
  } catch (err) {
    console.error("subscription cancel error:", err);
    return NextResponse.json(
      { error: "Could not cancel subscription. Please try again." },
      { status: 500 }
    );
  }
}
