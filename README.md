# Maryland Insurance Exam

AI-powered licensing exam prep for Maryland Life, Accident, Health, and Sickness Producer practice.

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- OpenAI API (server-side `/api/generate-quiz`)
- MongoDB for users, exam attempts, category performance, and generated quizzes
- localStorage fallback for guests (not signed in)

## Getting started

```bash
npm install
cp .env.example .env.local
```

Add to `.env.local`:

- `OPENAI_API_KEY` — for AI quiz generation
- `MONGO_URI` — MongoDB Atlas connection string
- `AUTH_SECRET` — random string (32+ chars) for session cookies

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, then sign in or register to access the dashboard at `/dashboard`.

## Features

- **Dashboard** — Latest score, goal (75%), exams taken, weak areas, category progress, AI quiz generator
- **Practice exam** — Seed questions or AI-generated quiz; one-at-a-time or full exam mode
- **Results** — Score %, pass/fail, category breakdown, answer review with explanations
- **Weak area tracking** — Categories below 75% highlighted after each attempt

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Practice exam dashboard |
| `/practice` | Practice exam |
| `/results` | Latest results & history |
| `/api/generate-quiz` | POST — AI question generation |
| `/api/auth/login` | POST — sign in |
| `/api/auth/register` | POST — create account |
| `/api/auth/logout` | POST — sign out |
| `/api/auth/me` | GET — current user |
| `/api/exams` | GET/POST — exam history (auth required) |
| `/api/performance` | GET — category stats (auth required) |
| `/api/quizzes` | GET/POST — generated quizzes (auth required) |
| `/login` | Sign in page |
| `/register` | Create account page |

## Environment

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Server-only OpenAI key for quiz generation |
| `MONGO_URI` | MongoDB Atlas connection string |
| `AUTH_SECRET` | Secret for signing session JWT cookies |

Without an API key, seed practice exams still work. Without MongoDB/auth, guests use browser localStorage only.

## Prometric question bank (OpenAI Batch)

Bulk-generate Prometric-difficulty questions from the blueprint, import them into MongoDB, and auto-approve items that pass a rule-based checklist. Full checklist details: [`scripts/BATCH_PROMETRIC.md`](scripts/BATCH_PROMETRIC.md).

### Prerequisites

```bash
npm run seed:blueprint   # once — loads ~2,934 objectives into MongoDB `concepts`
```

`.env` needs `OPENAI_API_KEY` and MongoDB (`MONGO_URI`; use `MONGO_URI_STANDARD` locally if SRV DNS fails on Mac). Optional: `BATCH_MODEL=gpt-4o-mini` (default).

### npm scripts

| Command | What it does |
|---------|----------------|
| `npm run batch:prometric:submit` | Submit a new OpenAI Batch job |
| `npm run batch:prometric:status` | Poll the last submitted batch |
| `npm run batch:prometric:process` | Download results, insert questions, auto-approve |
| `npm run batch:prometric:local` | Small synchronous test (no Batch API pricing) |

### Standard workflow

```bash
# 1) Preview which objectives will be included (no API spend)
npm run batch:prometric:submit -- --dry-run --concepts 50 --per-concept 6 --exam-weight High

# 2) Submit batch (often finishes in hours; OpenAI allows up to ~24h)
npm run batch:prometric:submit -- --concepts 50 --per-concept 6 --exam-weight High

# 3) Poll until completed
npm run batch:prometric:status

# 4) Import + auto-approve into MongoDB
npm run batch:prometric:process
```

Review failures in the admin UI at `/admin/review` (filter **Needs review**).

### How many objectives?

The script selects learning objectives where blueprint `difficulty` is **Prometric**. **`--concepts N` is a cap** — it stops after `N` objectives (default `40` if omitted).

Approximate counts in blueprint v4:

| Scope | `--concepts` | Questions @ 6 each |
|-------|----------------|-------------------|
| Small test | `50` | ~300 |
| All High-weight Prometric | `676` | ~4,056 |
| All Prometric (High + Medium) | `978` | ~5,868 |

**All High-weight Prometric:**

```bash
npm run batch:prometric:submit -- --dry-run --concepts 676 --per-concept 6 --exam-weight High
npm run batch:prometric:submit -- --concepts 676 --per-concept 6 --exam-weight High
```

**All Prometric objectives (no exam-weight filter):**

```bash
npm run batch:prometric:submit -- --dry-run --concepts 978 --per-concept 6
npm run batch:prometric:submit -- --concepts 978 --per-concept 6
```

You can pass any number **≥** the pool size (e.g. `--concepts 9999` behaves like “as many as exist”).

### Chunked runs (recommended for large banks)

One huge batch is expensive and slow. Run in chunks, then **process** each batch before submitting the next.

By default, selection uses **`--spread`** (round-robin): each batch takes at most **one Prometric objective per blueprint concept** (`md-lh-0001`, `md-lh-0002`, …) until it reaches `--concepts 200`. That way 200 objectives ≈ **200 different topics**, not the first 200 rows in ID order.

```bash
npm run batch:prometric:submit -- --concepts 200 --per-concept 6 --exam-weight High
npm run batch:prometric:status
npm run batch:prometric:process

# Repeat submit → status → process until dry-run shows few or zero objectives left
npm run batch:prometric:submit -- --dry-run --concepts 200 --per-concept 6 --exam-weight High
```

Dry-run / submit logs show `Selection: spread` plus domain counts. To allow **two** Prometric objectives from the same blueprint concept in one batch (there are usually two per concept):

```bash
npm run batch:prometric:submit -- --concepts 200 --per-concept 6 --exam-weight High --max-per-blueprint 2
```

Old “first 200 in sort order” behavior: add `--sequential`.

### Continuing after a partial run

By default, **`--min-approved-skip 3`** skips objectives that already have 3+ approved Prometric questions. A follow-up submit only fills gaps:

```bash
npm run batch:prometric:submit -- --concepts 676 --per-concept 6 --exam-weight High
```

To regenerate even when some objectives are already stocked:

```bash
npm run batch:prometric:submit -- --concepts 50 --per-concept 6 --exam-weight High --min-approved-skip 0
```

### Useful flags

| Flag | Default | Description |
|------|---------|-------------|
| `--concepts N` | `40` | Max objectives to include in this batch |
| `--per-concept N` | `8` | Questions requested per objective |
| `--exam-weight High` | (none) | Only objectives on High-weight blueprint concepts |
| `--dry-run` | — | List objectives only; no Batch API call |
| `--min-approved-skip N` | `3` | Skip objectives with ≥ N approved Prometric questions |
| `--spread` | on | Round-robin across blueprint concepts (breadth) |
| `--sequential` | — | First N eligible objectives by sort order |
| `--max-per-blueprint N` | `1` (with spread) | Max objectives per blueprint concept per batch |
| `--no-auto-approve` | — | Insert all as `needs_review` |
| `--batch-id batch_xxx` | — | Process a specific batch (ignores state file) |

### Local prompt test (no batch)

```bash
npm run batch:prometric:local -- --concepts 3 --per-concept 5
```

### Output files (gitignored)

- `.batch-prometric-state.json` — last submitted `batch_id`
- `.batch-output/` — JSONL input/output from OpenAI
