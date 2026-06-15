import { NextResponse } from "next/server";
import OpenAI from "openai";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import { canAccessFullApp } from "@/lib/access";
import { getPersonalizedLearningContext } from "@/lib/learning-context";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type TutorBody = {
  messages?: ChatMessage[];
};

function buildSystemPrompt(learningContext: string): string {
  const contextBlock = learningContext
    ? `\n\nStudent progress context (use when relevant, do not invent scores):\n${learningContext}`
    : "";

  return `You are a Maryland Life, Accident, Health & Sickness insurance licensing exam tutor. You help subscribed students understand exam concepts, clarify tricky topics, and study more effectively.

Guidelines:
- Focus on Maryland Life & Health producer exam content (Prometric-style).
- Be accurate, concise, and encouraging. Use short paragraphs or bullet points when helpful.
- If asked for practice questions, give 1–2 brief example stems with answers and brief explanations.
- Do not give legal advice; frame answers as exam prep, not professional guidance.
- If unsure, say so and suggest what to review in the course or practice exams.${contextBlock}`;
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  if (!canAccessFullApp(auth)) {
    return NextResponse.json(
      { error: "An active subscription is required for AI tutor chat." },
      { status: 403 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI tutor is not configured." },
      { status: 500 }
    );
  }

  let body: TutorBody;
  try {
    body = (await request.json()) as TutorBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = rawMessages
    .filter(
      (m): m is ChatMessage =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "A user message is required." },
      { status: 400 }
    );
  }

  const learningContext = await getPersonalizedLearningContext(auth.userId);

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 900,
      messages: [
        { role: "system", content: buildSystemPrompt(learningContext) },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: reply });
  } catch (err) {
    console.error("ai-tutor error:", err);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
