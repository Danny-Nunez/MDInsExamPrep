import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db/users";
import { sendPasswordResetEmail } from "@/lib/email/send-transactional";

const GENERIC_MESSAGE =
  "If an account exists for that email, we sent a password reset link. Check your inbox.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (user?._id) {
      try {
        await sendPasswordResetEmail({
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
        });
      } catch (err) {
        console.error("forgot-password email error:", err);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
