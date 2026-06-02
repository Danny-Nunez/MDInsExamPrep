import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSessionUser } from "@/lib/auth";
import { canAccessFullApp } from "@/lib/access";
import { getRecentLearningContext, saveGeneratedQuiz } from "@/lib/db/exams";
import { buildQuizFromApprovedBank } from "@/lib/quiz-from-bank";
import { ALL_SUBDOMAINS } from "@/lib/marylandBlueprint";
import { DOMAINS, MARYLAND_EXAM } from "@/types/quiz";
import {
  difficultyWritingGuide,
  PROMETRIC_STYLE_RULES,
} from "@/lib/prometric-prompt";
import type { Difficulty, QuizQuestion } from "@/types/quiz";

const VALID_DOMAINS = new Set<string>(DOMAINS);
const VALID_SUBDOMAINS = new Set<string>(ALL_SUBDOMAINS);
const VALID_DIFFICULTIES = new Set<string>([
  "easy",
  "medium",
  "hard",
  "prometric",
]);

type GenerateQuizBody = {
  weakAreas?: string[];
  subdomains?: string[];
  questionCount?: number;
  difficulty?: Difficulty;
};

function buildPrompt(
  weakAreas: string[],
  subdomains: string[],
  questionCount: number,
  difficulty: Difficulty,
  historyContext?: string
): string {
  return `Generate Maryland Life, Accident, Health, and Sickness Producer practice questions aligned to the state exam blueprint.

Focus domains: ${weakAreas.join(", ")}
${subdomains.length > 0 ? `Focus subdomains: ${subdomains.join(", ")}` : ""}

Create ${questionCount} multiple-choice questions.

${difficultyWritingGuide(difficulty)}

${PROMETRIC_STYLE_RULES}

- domain must be one of: ${DOMAINS.join(", ")}
- subdomain should match the blueprint topic when possible
- Set each item's difficulty field to "${difficulty}"
- isStateLaw: true for Maryland Insurance Regulations items
- explanation object with "correct" and "wrongAnswers" keyed by exact choice text

${historyContext ? `Learner history:\n${historyContext}\n` : ""}

Return JSON only:
{
  "questions": [
    {
      "id": "ai-unique-id",
      "state": "Maryland",
      "examType": "Life and Health",
      "domain": "Health Insurance",
      "subdomain": "COBRA",
      "difficulty": "hard",
      "isStateLaw": false,
      "question": "scenario stem...",
      "choices": ["Full answer A text", "Full answer B text", "Full answer C text", "Full answer D text"],
      "correctAnswer": "Full answer B text",
      "explanation": {
        "correct": "why correct",
        "wrongAnswers": { "other choice text": "why wrong" }
      },
      "sourceType": "ai-reviewed"
    }
  ]
}`;
}

function buildHistoryContext(
  data: Awaited<ReturnType<typeof getRecentLearningContext>>
): string {
  const missedByDomain = new Map<string, number>();

  for (const attempt of data.recentAttempts) {
    for (const ans of attempt.answers) {
      if (!ans.isCorrect) {
        missedByDomain.set(
          ans.domain,
          (missedByDomain.get(ans.domain) ?? 0) + 1
        );
      }
    }
  }

  const repeatedMissDomains = [...missedByDomain.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain, misses]) => `${domain} (${misses} misses)`);

  const attemptSummaries = data.recentAttempts.map((a, i) => {
    const weakest = [...a.domainScores]
      .sort((x, y) => x.percentage - y.percentage)
      .slice(0, 3)
      .map((d) => `${d.domain} ${d.percentage}%`)
      .join(", ");
    return `Attempt ${i + 1}: score ${a.percentage}%, weakest: ${weakest || "n/a"}`;
  });

  const imageInferred = data.recentImageAnalyses
    .flatMap((a) =>
      a.weakAreas.map(
        (w) => `${w.domain} (${Math.round(w.confidence * 100)}%)`
      )
    )
    .slice(0, 8);

  const parts = [
    attemptSummaries.length > 0
      ? `Recent attempts: ${attemptSummaries.join(" | ")}`
      : "",
    repeatedMissDomains.length > 0
      ? `Repeated misses by domain: ${repeatedMissDomains.join(", ")}`
      : "",
    imageInferred.length > 0
      ? `Uploaded exam-image inferred weaknesses: ${imageInferred.join(", ")}`
      : "",
  ].filter(Boolean);

  return parts.join("\n");
}

function normalizeAiQuestion(
  raw: Record<string, unknown>,
  index: number
): QuizQuestion | null {
  const domain = raw.domain;
  if (typeof domain !== "string" || !VALID_DOMAINS.has(domain)) return null;

  const question = raw.question;
  if (typeof question !== "string" || !question) return null;

  const choices = raw.choices;
  if (
    !Array.isArray(choices) ||
    choices.length !== 4 ||
    !choices.every((c) => typeof c === "string")
  ) {
    return null;
  }

  const correctAnswer = raw.correctAnswer;
  if (typeof correctAnswer !== "string" || !choices.includes(correctAnswer)) {
    return null;
  }

  let explanation: QuizQuestion["explanation"];
  if (typeof raw.explanation === "string" && raw.explanation) {
    explanation = raw.explanation;
  } else if (
    raw.explanation &&
    typeof raw.explanation === "object" &&
    typeof (raw.explanation as { correct?: string }).correct === "string"
  ) {
    explanation = raw.explanation as QuizQuestion["explanation"];
  } else {
    return null;
  }

  const subdomain =
    typeof raw.subdomain === "string" &&
    VALID_SUBDOMAINS.has(raw.subdomain)
      ? raw.subdomain
      : undefined;

  const difficulty =
    typeof raw.difficulty === "string" &&
    VALID_DIFFICULTIES.has(raw.difficulty)
      ? (raw.difficulty as Difficulty)
      : "medium";

  return {
    id:
      typeof raw.id === "string" && raw.id
        ? raw.id
        : `ai-${Date.now()}-${index}`,
    state:
      typeof raw.state === "string" ? raw.state : MARYLAND_EXAM.state,
    examType:
      typeof raw.examType === "string"
        ? raw.examType
        : MARYLAND_EXAM.examType,
    domain,
    subdomain,
    difficulty,
    question,
    choices: choices as string[],
    correctAnswer,
    explanation,
    isStateLaw: Boolean(raw.isStateLaw),
    sourceType: "ai-reviewed",
  };
}

function parseQuestions(content: string): QuizQuestion[] {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("Invalid JSON from OpenAI");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("questions" in parsed) ||
    !Array.isArray((parsed as { questions: unknown }).questions)
  ) {
    throw new Error("Response missing questions array");
  }

  const raw = (parsed as { questions: unknown[] }).questions;
  const valid: QuizQuestion[] = [];

  for (let i = 0; i < raw.length; i++) {
    if (!raw[i] || typeof raw[i] !== "object") continue;
    const normalized = normalizeAiQuestion(
      raw[i] as Record<string, unknown>,
      i
    );
    if (normalized) valid.push(normalized);
  }

  if (valid.length === 0) {
    throw new Error("No valid questions in response");
  }

  return valid;
}

async function generateViaOpenAI(
  apiKey: string,
  weakAreas: string[],
  subdomains: string[],
  questionCount: number,
  difficulty: Difficulty,
  historyContext: string
): Promise<QuizQuestion[]> {
  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You write Maryland insurance licensing exam items in Prometric style. JSON only.",
      },
      {
        role: "user",
        content: buildPrompt(
          weakAreas,
          subdomains,
          questionCount,
          difficulty,
          historyContext
        ),
      },
    ],
    temperature: 0.55,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }
  return parseQuestions(content);
}

export async function POST(request: Request) {
  try {
    let body: GenerateQuizBody;
    try {
      body = (await request.json()) as GenerateQuizBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const weakAreas = (body.weakAreas ?? []).filter((a) =>
      VALID_DOMAINS.has(a)
    );
    const subdomains = (body.subdomains ?? []).filter((s) =>
      VALID_SUBDOMAINS.has(s)
    );
    const questionCount = Math.min(
      50,
      Math.max(1, Number(body.questionCount) || 10)
    );
    const difficulty: Difficulty =
      body.difficulty && VALID_DIFFICULTIES.has(body.difficulty)
        ? body.difficulty
        : "prometric";

    if (weakAreas.length === 0) {
      return NextResponse.json(
        { error: "At least one valid domain is required." },
        { status: 400 }
      );
    }

    const user = await getSessionUser();
    let historyContext = "";
    if (user) {
      try {
        const context = await getRecentLearningContext(user.userId);
        historyContext = buildHistoryContext(context);
      } catch (contextErr) {
        console.error("Failed to load learning context:", contextErr);
      }
    }

    let questions: QuizQuestion[] = [];
    let source: "bank" | "ai" | "mixed" = "ai";

    if (user && canAccessFullApp(user)) {
      const bankQuestions = await buildQuizFromApprovedBank({
        limit: questionCount,
        weakAreas,
        subdomains,
        difficulty,
      });

      if (bankQuestions.length >= questionCount) {
        questions = bankQuestions.slice(0, questionCount);
        source = "bank";
      } else if (bankQuestions.length > 0) {
        const apiKey = process.env.OPENAI_API_KEY;
        const remainder = questionCount - bankQuestions.length;
        if (apiKey && remainder > 0) {
          const aiQuestions = await generateViaOpenAI(
            apiKey,
            weakAreas,
            subdomains,
            remainder,
            difficulty,
            historyContext
          );
          questions = [...bankQuestions, ...aiQuestions].slice(0, questionCount);
          source = "mixed";
        } else {
          questions = bankQuestions;
          source = "bank";
        }
      }
    }

    if (questions.length === 0) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          {
            error:
              "No approved bank questions matched and OpenAI is not configured.",
          },
          { status: 500 }
        );
      }
      questions = await generateViaOpenAI(
        apiKey,
        weakAreas,
        subdomains,
        questionCount,
        difficulty,
        historyContext
      );
      source = "ai";
    }

    let quizId: string | undefined;
    if (user) {
      try {
        quizId = await saveGeneratedQuiz(
          user.userId,
          weakAreas,
          questionCount,
          questions
        );
      } catch (dbErr) {
        console.error("Failed to save generated quiz:", dbErr);
      }
    }

    return NextResponse.json({ questions, quizId, source });
  } catch (err) {
    console.error("generate-quiz error:", err);
    const message =
      err instanceof Error && err.message.includes("JSON")
        ? "Could not parse quiz questions. Please try again."
        : "Failed to generate quiz. Please try again later.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
