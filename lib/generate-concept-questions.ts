import OpenAI from "openai";
import {
  BANK_QUESTION_JSON_SCHEMA,
  difficultyWritingGuide,
  PROMETRIC_STYLE_RULES,
} from "@/lib/prometric-prompt";
import { parseGeneratedQuestions } from "@/lib/question-quality-checklist";
import type { ConceptDocument } from "@/types/question-bank";

export type GeneratedBankQuestion = {
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

function parseGenerated(content: string): GeneratedBankQuestion[] {
  const valid = parseGeneratedQuestions(content);
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
Blueprint difficulty label: ${concept.difficulty}
Maryland-specific focus: ${concept.marylandSpecific}

${difficultyWritingGuide(concept.difficulty)}

${concept.generationPrompt ?? ""}

${PROMETRIC_STYLE_RULES}

${BANK_QUESTION_JSON_SCHEMA}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You write original Maryland insurance licensing exam items at Prometric difficulty. Challenging, scenario-based, JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.55,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");
  return parseGenerated(content);
}
