import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  createSessionToken,
  getSessionUser,
  setSessionCookie,
} from "@/lib/auth";
import { getUserById, toSessionUser } from "@/lib/db/users";
import { getStripe } from "@/lib/stripe";
import { activateFromCheckoutSession } from "@/lib/stripe-subscription";
import type { UserDocument } from "@/types/user";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const body = await request.json();
    const sessionId = String(body.sessionId ?? "").trim();
    if (!sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Invalid checkout session." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const activated = await activateFromCheckoutSession(
      stripe,
      sessionUser.userId,
      checkoutSession
    );

    if (!activated) {
      return NextResponse.json(
        {
          error:
            "Payment not completed yet or session does not match your account.",
        },
        { status: 400 }
      );
    }

    const doc = await getUserById(sessionUser.userId);
    if (!doc?._id) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = toSessionUser(doc as UserDocument & { _id: ObjectId });
    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({ user, activated: true });
  } catch (err) {
    console.error("stripe confirm error:", err);
    return NextResponse.json(
      { error: "Could not confirm payment. Try again or contact support." },
      { status: 500 }
    );
  }
}
