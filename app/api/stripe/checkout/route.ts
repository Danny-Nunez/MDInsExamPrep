import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSessionUser } from "@/lib/auth";
import { canAccessFullApp } from "@/lib/access";
import { getUserById } from "@/lib/db/users";
import { getStripePriceId, stripePriceConfigError } from "@/lib/stripe-config";
import { getAppUrl, getStripe } from "@/lib/stripe";
import { SUBSCRIPTION_AMOUNT_CENTS } from "@/lib/subscription";

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (canAccessFullApp(sessionUser)) {
      return NextResponse.json(
        { error: "You already have an active subscription." },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId();
    if (!priceId) {
      console.error("stripe checkout: invalid STRIPE_PRICE_ID", {
        configured: Boolean(process.env.STRIPE_PRICE_ID),
        prefix: process.env.STRIPE_PRICE_ID?.slice(0, 12),
      });
      return NextResponse.json(
        { error: stripePriceConfigError() },
        { status: 503 }
      );
    }

    const user = await getUserById(sessionUser.userId);
    if (!user?._id) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: sessionUser.email,
        name: sessionUser.name,
        metadata: { userId: sessionUser.userId },
      });
      customerId = customer.id;
      const { getDb } = await import("@/lib/mongodb");
      const { COLLECTIONS } = await import("@/lib/db/collections");
      const db = await getDb();
      await db.collection(COLLECTIONS.users).updateOne(
        { _id: new ObjectId(sessionUser.userId) },
        { $set: { stripeCustomerId: customerId } }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/subscribe?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscribe?canceled=1`,
      metadata: { userId: sessionUser.userId },
      subscription_data: {
        metadata: { userId: sessionUser.userId },
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Could not start checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
      amountCents: SUBSCRIPTION_AMOUNT_CENTS,
    });
  } catch (err) {
    console.error("stripe checkout error:", err);
    const message =
      err instanceof Error && err.message.includes("No such price")
        ? stripePriceConfigError()
        : "Checkout failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
