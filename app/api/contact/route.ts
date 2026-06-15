import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email/send-transactional";

const MAX_NAME = 100;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function cleanField(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const honeypot = cleanField(body.website, 200);
    if (honeypot) {
      return NextResponse.json({
        message: "Thanks — your message has been sent.",
      });
    }

    const name = cleanField(body.name, MAX_NAME);
    const email = cleanField(body.email, 320).toLowerCase();
    const subject = cleanField(body.subject, MAX_SUBJECT);
    const message = cleanField(body.message, MAX_MESSAGE);

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }

    const result = await sendContactFormEmail({ name, email, subject, message });

    if (!result.sent) {
      return NextResponse.json(
        {
          error:
            result.error ??
            "We couldn't send your message right now. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "Thanks — your message has been sent. We'll get back to you soon.",
    });
  } catch (err) {
    console.error("contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
