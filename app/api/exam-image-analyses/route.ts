import { NextResponse } from "next/server";
import OpenAI from "openai";
import { isErrorResponse, requireUser } from "@/lib/api-auth";
import {
  getExamImageAnalysesForUser,
  saveExamImageAnalysis,
} from "@/lib/db/exams";
import {
  buildPrometricScoreReportPrompt,
  parsePrometricScoreReportResponse,
} from "@/lib/prometric-score-report";
import type { ExamImageWeakArea } from "@/types/quiz";

type AnalyzeBody = {
  imageDataUrl?: string;
  fileName?: string;
};

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
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You read Prometric/Maryland insurance exam score reports and return only valid JSON. Transcribe domain names exactly as printed.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: buildPrometricScoreReportPrompt() },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "high" } },
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

    const parsed = parsePrometricScoreReportResponse(content);
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
