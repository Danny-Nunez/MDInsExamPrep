import { NextResponse } from "next/server";
import OpenAI from "openai";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import {
  getExamImageAnalysesForUser,
  saveExamImageAnalysis,
} from "@/lib/db/exams";
import { DOMAINS } from "@/types/quiz";
import type { ExamImageWeakArea } from "@/types/quiz";

const VALID_DOMAINS = new Set<string>(DOMAINS);

type AnalyzeBody = {
  imageDataUrl?: string;
  fileName?: string;
};

type AiResponse = {
  summary: string;
  weakAreas: {
    domain: string;
    confidence: number;
    issue: string;
    recommendation: string;
  }[];
};

function buildPrompt(): string {
  return `You are analyzing a screenshot/photo of an insurance licensing exam result report for Maryland Life, Accident, Health, and Sickness producer prep.

Extract likely weak areas from the visible result details.
Use ONLY these domains:
${DOMAINS.join(", ")}

Return strict JSON only with this shape:
{
  "summary": "short paragraph",
  "weakAreas": [
    {
      "domain": "string",
      "confidence": 0.0,
      "issue": "string",
      "recommendation": "string"
    }
  ]
}

Rules:
- confidence must be 0 to 1
- include up to 5 weak areas
- if no clear weak areas are visible, still return summary and an empty weakAreas array
- do not include markdown`;
}

function parseAiResponse(content: string): AiResponse {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonStr) as Partial<AiResponse>;
  if (!parsed.summary || typeof parsed.summary !== "string") {
    throw new Error("Invalid summary in AI response");
  }

  const weakAreas = Array.isArray(parsed.weakAreas) ? parsed.weakAreas : [];
  const validated = weakAreas
    .filter((w) => w && typeof w === "object")
    .map((w) => ({
      domain: String(w.domain ?? ""),
      confidence: Number(w.confidence ?? 0),
      issue: String(w.issue ?? ""),
      recommendation: String(w.recommendation ?? ""),
    }))
    .filter(
      (w) =>
        VALID_DOMAINS.has(w.domain) &&
        w.issue.length > 0 &&
        w.recommendation.length > 0
    )
    .map((w) => ({
      ...w,
      confidence: Math.max(0, Math.min(1, w.confidence)),
    }))
    .slice(0, 5);

  return {
    summary: parsed.summary.trim(),
    weakAreas: validated,
  };
}

export async function GET() {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const analyses = await getExamImageAnalysesForUser(auth.userId);
    return NextResponse.json({ analyses });
  } catch (err) {
    console.error("GET exam-image-analyses error:", err);
    return NextResponse.json(
      { error: "Failed to load saved analyses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (isErrorResponse(auth)) return auth;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as AnalyzeBody;
    const imageDataUrl = body.imageDataUrl?.trim();
    const fileName = body.fileName?.trim() || "uploaded-exam-result";

    if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "A valid image upload is required." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You analyze exam result screenshots and return only valid JSON.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt() },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 502 }
      );
    }

    const parsed = parseAiResponse(content);
    const analysisId = await saveExamImageAnalysis(auth.userId, {
      sourceImageName: fileName,
      summary: parsed.summary,
      weakAreas: parsed.weakAreas as ExamImageWeakArea[],
    });

    return NextResponse.json({
      analysis: {
        id: analysisId,
        createdAt: new Date().toISOString(),
        sourceImageName: fileName,
        summary: parsed.summary,
        weakAreas: parsed.weakAreas,
      },
    });
  } catch (err) {
    console.error("POST exam-image-analyses error:", err);
    return NextResponse.json(
      { error: "Failed to analyze exam image. Please try again." },
      { status: 500 }
    );
  }
}
