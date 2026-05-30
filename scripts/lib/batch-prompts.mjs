const PROMETRIC_STYLE_RULES = `Prometric-style exam rules (Maryland Life & Health Producer):
- Scenario-based stems: named people, employers, policy details, dollar amounts, dates (avoid "What is the definition of…?")
- At least 70% of items must use BEST, MOST appropriate, MOST likely, or PRIMARILY in the stem
- Four closely plausible distractors; one clearly best answer under Maryland law and exam conventions
- Test application and judgment, not recall of a single fact
- Maryland Insurance Administration rules when the topic is state-specific
- Do NOT copy real exam questions or third-party prep materials`;

export function buildGenerationPrompt(concept, count) {
  return `Generate ${count} original Maryland Life & Health insurance licensing practice questions.

Concept: ${concept.concept}
Domain: ${concept.domain} > ${concept.subdomain}
Learning objective: ${concept.objective}
Question type: ${concept.questionType}
Blueprint difficulty label: Prometric
Maryland-specific focus: ${concept.marylandSpecific}

Difficulty target: PROMETRIC / actual exam level — maximum rigor. Multi-step reasoning, exceptions, and near-miss distractors.

${concept.generationPrompt ?? ""}

${PROMETRIC_STYLE_RULES}

Return JSON only:
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
}

export function buildBatchRequestLine(concept, count, model) {
  return {
    custom_id: concept.objectiveId,
    method: "POST",
    url: "/v1/chat/completions",
    body: {
      model,
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write original Maryland insurance licensing exam items at Prometric difficulty. Challenging, scenario-based, JSON only.",
        },
        {
          role: "user",
          content: buildGenerationPrompt(concept, count),
        },
      ],
    },
  };
}
