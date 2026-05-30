/**
 * Build an initial Prometric question bank via OpenAI Batch API + rule-based auto-approve.
 *
 * Typical workflow (~300 questions):
 *   npm run batch:prometric:submit -- --concepts 40 --per-concept 8
 *   npm run batch:prometric:status
 *   npm run batch:prometric:process
 *
 * Local test (no batch, 3 concepts):
 *   npm run batch:prometric:local -- --concepts 3 --per-concept 5
 */
import { createReadStream, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import OpenAI from "openai";
import { buildBatchRequestLine } from "./lib/batch-prompts.mjs";
import { connectMongo } from "./lib/mongo-connect.mjs";
import {
  evaluateQuestionQuality,
  parseGeneratedQuestions,
} from "./lib/question-quality.mjs";

const STATE_PATH = resolve(process.cwd(), ".batch-prometric-state.json");
const BATCH_DIR = resolve(process.cwd(), ".batch-output");

const MODEL = process.env.BATCH_MODEL?.trim() || "gpt-4o-mini";

function parseArgs(argv) {
  const cmd = argv[0] ?? "help";
  const flags = {};
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--concepts") flags.concepts = Number(argv[++i]);
    else if (a === "--per-concept") flags.perConcept = Number(argv[++i]);
    else if (a === "--min-approved-skip") flags.minApprovedSkip = Number(argv[++i]);
    else if (a === "--exam-weight") flags.examWeight = argv[++i];
    else if (a === "--batch-id") flags.batchId = argv[++i];
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--no-auto-approve") flags.noAutoApprove = true;
  }
  return {
    cmd,
    concepts: flags.concepts ?? 40,
    perConcept: flags.perConcept ?? 8,
    minApprovedSkip: flags.minApprovedSkip ?? 3,
    examWeight: flags.examWeight ?? "",
    batchId: flags.batchId ?? "",
    dryRun: flags.dryRun ?? false,
    noAutoApprove: flags.noAutoApprove ?? false,
  };
}

function prometricFilter() {
  return { difficulty: /^prometric$/i };
}

async function selectConcepts(db, opts) {
  const conceptsCol = db.collection("concepts");
  const questionsCol = db.collection("questions");

  const query = { difficulty: /^prometric$/i };
  if (opts.examWeight) query.examWeight = opts.examWeight;

  const candidates = await conceptsCol
    .find(query)
    .sort({ examWeight: -1, objectiveId: 1 })
    .toArray();

  const selected = [];
  for (const concept of candidates) {
    if (selected.length >= opts.concepts) break;

    const approved = await questionsCol.countDocuments({
      conceptId: concept.objectiveId,
      status: "approved",
      difficulty: { $in: ["prometric", "Prometric"] },
    });

    if (approved >= opts.minApprovedSkip) continue;
    selected.push(concept);
  }

  return selected;
}

function questionDoc(concept, q, status, quality) {
  return {
    conceptId: concept.objectiveId,
    domain: concept.domain,
    subdomain: concept.subdomain,
    concept: concept.concept,
    objective: concept.objective,
    question: q.question,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: "prometric",
    questionType: concept.questionType,
    status,
    qualityCheck: quality,
    source: "batch_prometric_v1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function insertParsedQuestions(db, concept, content, opts) {
  const parsed = parseGeneratedQuestions(content);
  const questionsCol = db.collection("questions");

  let approved = 0;
  let review = 0;
  const failuresByRule = {};

  for (const q of parsed) {
    const quality = evaluateQuestionQuality({ ...q, difficulty: "prometric" });
    for (const f of quality.failures) {
      failuresByRule[f] = (failuresByRule[f] ?? 0) + 1;
    }

    const autoApprove = quality.pass && !opts.noAutoApprove;
    const status = autoApprove ? "approved" : "needs_review";

    await questionsCol.insertOne(
      questionDoc(concept, q, status, {
        ruleScore: quality.score,
        ruleFailures: quality.failures,
        autoApproveEligible: quality.pass,
      })
    );

    if (autoApprove) approved++;
    else review++;
  }

  return { parsed: parsed.length, approved, review, failuresByRule };
}

async function cmdSubmit(opts) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required");

  const client = await connectMongo();
  const db = client.db("examprep");

  const concepts = await selectConcepts(db, opts);
  await client.close();

  console.log(`Selected ${concepts.length} Prometric objectives (target ${opts.concepts}).`);
  if (concepts.length === 0) {
    console.log("Nothing to generate. Lower --min-approved-skip or seed concepts.");
    return;
  }

  if (opts.dryRun) {
    for (const c of concepts) {
      console.log(`  ${c.objectiveId} | ${c.examWeight} | ${c.domain} > ${c.subdomain}`);
    }
    console.log(`Would request ~${concepts.length * opts.perConcept} questions via Batch API.`);
    return;
  }

  mkdirSync(BATCH_DIR, { recursive: true });
  const jsonlPath = resolve(
    BATCH_DIR,
    `batch-input-${Date.now()}.jsonl`
  );

  const lines = concepts.map((c) =>
    JSON.stringify(buildBatchRequestLine(c, opts.perConcept, MODEL))
  );
  writeFileSync(jsonlPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${lines.length} requests → ${jsonlPath}`);

  const openai = new OpenAI();
  const file = await openai.files.create({
    file: createReadStream(jsonlPath),
    purpose: "batch",
  });

  const batch = await openai.batches.create({
    input_file_id: file.id,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
    metadata: {
      project: "maryland-insurance-exam",
      kind: "prometric-bank",
    },
  });

  const state = {
    batchId: batch.id,
    inputFileId: file.id,
    jsonlPath,
    model: MODEL,
    concepts: concepts.map((c) => c.objectiveId),
    perConcept: opts.perConcept,
    noAutoApprove: opts.noAutoApprove,
    createdAt: new Date().toISOString(),
  };
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

  console.log("\nBatch submitted.");
  console.log(`  batch id: ${batch.id}`);
  console.log(`  status:   ${batch.status}`);
  console.log(`  state:    ${STATE_PATH}`);
  console.log("\nNext: npm run batch:prometric:status");
  console.log("Then: npm run batch:prometric:process");
}

async function loadState(opts) {
  if (opts.batchId) {
    return { batchId: opts.batchId, perConcept: opts.perConcept, noAutoApprove: opts.noAutoApprove };
  }
  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf8"));
  } catch {
    throw new Error(`Missing ${STATE_PATH}. Run submit first or pass --batch-id`);
  }
}

async function cmdStatus(opts) {
  const state = await loadState(opts);
  const openai = new OpenAI();
  const batch = await openai.batches.retrieve(state.batchId);

  console.log(`Batch ${batch.id}`);
  console.log(`  status:          ${batch.status}`);
  console.log(`  completed:       ${batch.request_counts?.completed ?? 0}`);
  console.log(`  failed:          ${batch.request_counts?.failed ?? 0}`);
  console.log(`  output_file_id:  ${batch.output_file_id ?? "(pending)"}`);

  if (batch.status === "completed" && batch.output_file_id) {
    console.log("\nReady to process: npm run batch:prometric:process");
  }
}

async function cmdProcess(opts) {
  const state = await loadState(opts);
  const openai = new OpenAI();
  const batch = await openai.batches.retrieve(state.batchId);

  if (batch.status !== "completed" || !batch.output_file_id) {
    throw new Error(`Batch not ready (status=${batch.status})`);
  }

  const fileRes = await openai.files.content(batch.output_file_id);
  const text = await fileRes.text();

  mkdirSync(BATCH_DIR, { recursive: true });
  const outPath = resolve(BATCH_DIR, `batch-output-${batch.id}.jsonl`);
  writeFileSync(outPath, text, "utf8");
  console.log(`Downloaded output → ${outPath}`);

  const client = await connectMongo();
  const db = client.db("examprep");
  const conceptsCol = db.collection("concepts");

  const conceptMap = new Map();
  for (const id of state.concepts ?? []) {
    const doc = await conceptsCol.findOne({ objectiveId: id });
    if (doc) conceptMap.set(id, doc);
  }

  let totals = { approved: 0, review: 0, parsed: 0, lines: 0, errors: 0 };
  const allFailures = {};

  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    totals.lines++;
    let row;
    try {
      row = JSON.parse(line);
    } catch {
      totals.errors++;
      continue;
    }

    const objectiveId = row.custom_id;
    const concept = conceptMap.get(objectiveId);
    if (!concept) {
      console.warn(`  skip unknown custom_id: ${objectiveId}`);
      totals.errors++;
      continue;
    }

    const statusCode = row.response?.status_code;
    if (statusCode !== 200) {
      console.warn(`  ${objectiveId}: HTTP ${statusCode}`);
      totals.errors++;
      continue;
    }

    const content = row.response?.body?.choices?.[0]?.message?.content;
    if (!content) {
      totals.errors++;
      continue;
    }

    try {
      const result = await insertParsedQuestions(db, concept, content, {
        noAutoApprove: state.noAutoApprove,
      });
      totals.parsed += result.parsed;
      totals.approved += result.approved;
      totals.review += result.review;
      for (const [k, v] of Object.entries(result.failuresByRule)) {
        allFailures[k] = (allFailures[k] ?? 0) + v;
      }
      console.log(
        `  ${objectiveId}: ${result.approved} approved, ${result.review} needs_review (${result.parsed} parsed)`
      );
    } catch (err) {
      console.warn(`  ${objectiveId}: parse error — ${err.message}`);
      totals.errors++;
    }
  }

  await client.close();

  console.log("\n=== Summary ===");
  console.log(`  batch lines:     ${totals.lines}`);
  console.log(`  questions:     ${totals.parsed}`);
  console.log(`  auto-approved: ${totals.approved}`);
  console.log(`  needs_review:  ${totals.review}`);
  console.log(`  errors:        ${totals.errors}`);
  if (Object.keys(allFailures).length) {
    console.log("  checklist failures:");
    for (const [k, v] of Object.entries(allFailures).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${k}: ${v}`);
    }
  }
}

/** Synchronous run for small tests (charges standard API, not batch pricing). */
async function cmdRunLocal(opts) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required");

  const client = await connectMongo();
  const db = client.db("examprep");
  const concepts = await selectConcepts(db, opts);

  console.log(`Local run: ${concepts.length} concepts × ${opts.perConcept} questions`);
  if (opts.dryRun) {
    await client.close();
    return cmdSubmit({ ...opts, dryRun: true });
  }

  const openai = new OpenAI();
  let totals = { approved: 0, review: 0, parsed: 0 };

  for (const concept of concepts) {
    const line = buildBatchRequestLine(concept, opts.perConcept, MODEL);
    const completion = await openai.chat.completions.create(line.body);
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn(`  ${concept.objectiveId}: empty response`);
      continue;
    }
    const result = await insertParsedQuestions(db, concept, content, opts);
    totals.parsed += result.parsed;
    totals.approved += result.approved;
    totals.review += result.review;
    console.log(
      `  ${concept.objectiveId}: ${result.approved} approved, ${result.review} needs_review`
    );
  }

  await client.close();
  console.log("\n=== Summary ===");
  console.log(`  parsed: ${totals.parsed}, approved: ${totals.approved}, needs_review: ${totals.review}`);
}

function printHelp() {
  console.log(`
Maryland Prometric question bank — OpenAI Batch + auto-approve checklist

Commands:
  submit      Create JSONL, upload, start OpenAI batch job
  status      Poll batch job status
  process     Download batch output → MongoDB (auto-approve if checklist passes)
  run-local   Small synchronous test (standard API pricing)

Options:
  --concepts N           Prometric objectives to generate (default 40)
  --per-concept N        Questions per objective (default 8)
  --min-approved-skip N  Skip objectives with N+ approved prometric Qs (default 3)
  --exam-weight High     Only High exam-weight objectives
  --batch-id ID          Use specific batch (process/status)
  --dry-run              List objectives only
  --no-auto-approve      Insert all as needs_review (test checklist)

Examples:
  npm run batch:prometric:submit -- --concepts 40 --per-concept 8 --exam-weight High
  npm run batch:prometric:status
  npm run batch:prometric:process
  npm run batch:prometric:local -- --concepts 3 --per-concept 5
`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  switch (opts.cmd) {
    case "submit":
      await cmdSubmit(opts);
      break;
    case "status":
      await cmdStatus(opts);
      break;
    case "process":
      await cmdProcess(opts);
      break;
    case "run-local":
      await cmdRunLocal(opts);
      break;
    default:
      printHelp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
