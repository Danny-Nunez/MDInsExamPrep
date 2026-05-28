# Maryland Question Bank

`maryland-question-bank.json` is the local curated question bank used for practice and Prometric-style exams.

## Schema

Each question includes:

- `id` — e.g. `md-health-001`
- `state`, `examType` — Maryland Life and Health
- `domain` — one of four blueprint domains
- `subdomain` — e.g. COBRA, Twisting and rebating
- `difficulty` — `easy` | `medium` | `hard` | `prometric`
- `isStateLaw` — `true` for Maryland regulation items
- `question`, `choices`, `correctAnswer`
- `explanation` — string or `{ correct, wrongAnswers }`
- `sourceType` — `curated` | `ai-reviewed`

## Growing the bank

Target 500–1500 questions. Add scenario-based items with BEST-answer wording. Use AI to draft variations, then human-review before appending to this file.

## Usage in app

- `lib/questionBank.ts` loads and filters the bank
- Study: `/practice?session=study`
- Exam simulation: `/practice?session=exam&prometric=1` (60 questions, timer, no instant feedback)
