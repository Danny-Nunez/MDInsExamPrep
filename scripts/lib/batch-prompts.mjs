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
      "question": "Full scenario stem ending in a question?",
      "choices": [
        "First complete answer option as a full sentence (not the letter a)",
        "Second complete answer option as a full sentence",
        "Third complete answer option as a full sentence",
        "Fourth complete answer option as a full sentence"
      ],
      "correctAnswer": "Second complete answer option as a full sentence",
      "explanation": "Why the correct option is best and why each distractor is wrong"
    }
  ]
}

CRITICAL: Each "choices" entry must be full answer text (15+ characters). Never use "a", "b", "c", or "d" as values. "correctAnswer" must exactly match one choice string.`;
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
