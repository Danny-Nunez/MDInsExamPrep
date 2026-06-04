import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getStripe } from "@/lib/stripe";
import {
  activateFromCheckoutSession,
  applySubscriptionFromStripe,
} from "@/lib/stripe-subscription";
import { sendSubscriptionConfirmationEmail } from "@/lib/email/after-subscription";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("stripe webhook verify error:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const stripe = getStripe();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && ObjectId.isValid(userId)) {
          const activated = await activateFromCheckoutSession(
            stripe,
            userId,
            session
          );
          if (activated) {
            const subscriptionId =
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id;
            if (subscriptionId) {
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              await sendSubscriptionConfirmationEmail(userId, sub);
            }
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId && ObjectId.isValid(userId)) {
          await applySubscriptionFromStripe(userId, sub);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("stripe webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
