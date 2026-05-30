import OpenAI from "openai";
import type { ConceptDocument } from "@/types/question-bank";

export type GeneratedBankQuestion = {
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

function parseGenerated(content: string): GeneratedBankQuestion[] {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonStr) as { questions?: unknown[] };
  if (!parsed?.questions || !Array.isArray(parsed.questions)) {
    throw new Error("Invalid response shape");
  }

  const valid: GeneratedBankQuestion[] = [];
  for (const item of parsed.questions) {
    if (!item || typeof item !== "object") continue;
    const q = item as Record<string, unknown>;
    if (typeof q.question !== "string" || !q.question) continue;
    if (
      !Array.isArray(q.choices) ||
      q.choices.length !== 4 ||
      !q.choices.every((c) => typeof c === "string")
    ) {
      continue;
    }
    if (
      typeof q.correctAnswer !== "string" ||
      !(q.choices as string[]).includes(q.correctAnswer)
    ) {
      continue;
    }
    if (typeof q.explanation !== "string" || !q.explanation) continue;
    valid.push({
      question: q.question,
      choices: q.choices as string[],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  }

  if (valid.length === 0) throw new Error("No valid questions parsed");
  return valid;
}

export async function generateQuestionsForConcept(
  concept: ConceptDocument,
  count = 10
): Promise<GeneratedBankQuestion[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const openai = new OpenAI({ apiKey });
  const prompt = `Generate ${count} original Maryland Life & Health insurance licensing practice questions.

Concept: ${concept.concept}
Domain: ${concept.domain} > ${concept.subdomain}
Learning objective: ${concept.objective}
Question type: ${concept.questionType}
Difficulty: ${concept.difficulty}
Maryland-specific focus: ${concept.marylandSpecific}

${concept.generationPrompt ?? ""}

Rules:
- Prometric-style, scenario-based when possible
- Use BEST / MOST likely / PRIMARILY where appropriate
- Four plausible choices, exactly one correct
- Do NOT copy real exam questions or provider materials
- Return JSON only:

{
  "questions": [
    {
      "question": "...",
      "choices": ["a","b","c","d"],
      "correctAnswer": "exact choice text",
      "explanation": "why correct and brief note on distractors"
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You write original Maryland insurance licensing exam items. JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return parseGenerated(content);
}
