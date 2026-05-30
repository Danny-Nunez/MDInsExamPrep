# Maryland Life & Health Exam Blueprint V4 — Cursor/MongoDB Setup

This package includes:
- `Maryland_Life_Health_Exam_Blueprint_V4_CursorReady.xlsx` — full spreadsheet with blueprint, schemas, templates, and summary tabs.
- `maryland_life_health_blueprint_v4.csv` — flat import file, one row per learning objective.
- `maryland_life_health_blueprint_v4.json` — nested MongoDB-ready JSON, one document per concept with objectives embedded.

## Recommended MongoDB Collections

### `concepts`
Use the JSON file for this collection.

```js
{
  conceptId: "md-lh-0001",
  domain: "Insurance Regulation",
  subdomain: "Licensing",
  concept: "Producer license requirements",
  examWeight: "High",
  marylandSpecific: "Yes",
  status: "ready_for_generation",
  objectiveCount: 6,
  totalQuestionTarget: 132,
  objectives: [
    {
      objectiveId: "md-lh-0001-obj-1",
      learningObjective: "Define Producer license requirements...",
      questionType: "Definition",
      difficulty: "Easy",
      questionTarget: 17,
      generationPrompt: "Generate Maryland Life & Health..."
    }
  ]
}
```

### `questions`
Generated questions should go here.

```js
{
  questionId: "md-lh-q-000001",
  conceptId: "md-lh-0001",
  objectiveId: "md-lh-0001-obj-2",
  domain: "Insurance Regulation",
  subdomain: "Licensing",
  concept: "Producer license requirements",
  difficulty: "Prometric",
  questionType: "Scenario",
  question: "...",
  choices: ["...", "...", "...", "..."],
  correctAnswer: "...",
  explanation: "...",
  marylandSpecific: true,
  status: "needs_review",
  source: "generated_from_blueprint_v4",
  createdAt: new Date()
}
```

## Cursor Prompt

Paste this into Cursor:

```text
Build an import workflow for my Maryland Life & Health exam prep MVP.

I have a CSV/JSON blueprint file named maryland_life_health_blueprint_v4.json. Create a seed script that imports it into MongoDB as a `concepts` collection. Then create a `questions` collection schema for generated questions.

Requirements:
1. Import concept documents with embedded objectives.
2. Add indexes on domain, subdomain, conceptId, objectives.objectiveId, examWeight, marylandSpecific, and status.
3. Build an admin route/page to browse concepts by domain/subdomain.
4. Add a "Generate Questions" action for a selected objective.
5. Save generated questions with status `needs_review`.
6. Add approve/reject/publish controls.
7. Build quiz selection logic that only uses `published` questions.
8. Track user progress by conceptId and objectiveId.
9. Do not copy real prep-provider questions. Generate original exam-style questions from the blueprint only.
```

## Scale

- Concepts: 489
- Learning objectives: 2934
- Estimated generated question capacity from targets: 60,795
