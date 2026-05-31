# Prometric batch question bank

Quick start and “run all concepts” commands: see **[README.md § Prometric question bank](../README.md#prometric-question-bank-openai-batch)**.

Build ~100–400 **approved** Prometric questions using OpenAI **Batch API** (lower cost than live calls) plus a **free rule-based checklist** for auto-approve.

## Prerequisites

- `.env` with `OPENAI_API_KEY` and MongoDB credentials
- **Recommended:** `MONGO_USER` + `MONGO_PASSWORD` (plain password; scripts encode it for you)
- Or `MONGO_URI` + `MONGO_URI_STANDARD` if SRV DNS fails locally
- Blueprint seeded: `npm run seed:blueprint`
- Optional: `BATCH_MODEL=gpt-4o-mini` (default)

## Recommended run (~320 questions)

```bash
# 1) Preview which objectives will be used
npm run batch:prometric:submit -- --dry-run --concepts 40 --per-concept 8 --exam-weight High

# 2) Submit batch (completes within ~24h, often much faster)
npm run batch:prometric:submit -- --concepts 40 --per-concept 8 --exam-weight High

# 3) Poll status
npm run batch:prometric:status

# 4) When status is completed, import + auto-approve
npm run batch:prometric:process
```

## Auto-approve checklist (Prometric only)

A question is **`approved`** only if **all** rules pass:

| Rule | Requirement |
|------|-------------|
| Difficulty | `prometric` |
| Stem length | 50–1200 characters |
| Exam style | Contains `?` OR words like BEST / MOST likely / PRIMARILY |
| Not recall | No “What is the definition…” stems |
| Choices | 4 unique options, each ≥ 8 chars, no “all/none of the above” |
| Answer | `correctAnswer` matches one choice exactly |
| Explanation | ≥ 40 characters |

Failed items are saved as **`needs_review`** with `qualityCheck.ruleFailures` for manual fix in `/admin/review`.

## Test locally first (3 concepts)

Uses standard API (not batch pricing), good for prompt QA:

```bash
npm run batch:prometric:local -- --concepts 3 --per-concept 5
```

## Run all Prometric objectives

`--concepts` is a **cap** (your `50` run stopped at 50). Blueprint v4 has ~**676** High-weight Prometric objectives and ~**978** total Prometric.

```bash
# All High-weight Prometric (~4,056 questions @ 6 each)
npm run batch:prometric:submit -- --dry-run --concepts 676 --per-concept 6 --exam-weight High
npm run batch:prometric:submit -- --concepts 676 --per-concept 6 --exam-weight High

# All Prometric (High + Medium)
npm run batch:prometric:submit -- --concepts 978 --per-concept 6
```

Prefer chunked runs (`--concepts 200`) and repeat after `process`; see README.

## Breadth across blueprint concepts (default)

Submit uses **`--spread`** by default: round-robin across blueprint concept ids (`md-lh-0001`, …) with **`--max-per-blueprint 1`**, so `--concepts 200` picks ~200 different topics. Use `--dry-run` to see domain breakdown before spending on the batch.

```bash
npm run batch:prometric:submit -- --dry-run --concepts 200 --per-concept 6 --exam-weight High
```

- `--max-per-blueprint 2` — up to two Prometric objectives from the same blueprint row per batch  
- `--sequential` — legacy: first N objectives in examWeight / objectiveId order  

## Flags

- `--no-auto-approve` — insert everything as `needs_review` (inspect checklist only)
- `--min-approved-skip 3` — skip objectives that already have 3+ approved Prometric questions
- `--batch-id batch_xxx` — process a specific batch without `.batch-prometric-state.json`

## Output files

- `.batch-prometric-state.json` — last submitted batch id
- `.batch-output/` — JSONL input/output (gitignored)

## Cost note

Batch API is typically **~50% cheaper** than synchronous chat for the same model. Check [OpenAI pricing](https://openai.com/api/pricing/) for current rates.
