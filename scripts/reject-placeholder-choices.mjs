/**
 * Mark questions with a/b/c/d-only choices as rejected (bad batch template copy).
 *
 * Usage: npm run questions:reject-placeholders
 *        npm run questions:reject-placeholders -- --dry-run
 */
import { connectMongo } from "./lib/mongo-connect.mjs";

const LETTER_ONLY = /^[a-d]$/i;

function isPlaceholderChoices(choices) {
  if (!Array.isArray(choices) || choices.length !== 4) return false;
  return choices.every((c) => LETTER_ONLY.test(String(c).trim()));
}

function parseArgs(argv) {
  return { dryRun: argv.includes("--dry-run") };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const client = await connectMongo();
  const col = client.db("examprep").collection("questions");

  const cursor = col.find({
    status: { $in: ["needs_review", "approved"] },
  });

  let matched = 0;
  let updated = 0;
  for await (const doc of cursor) {
    if (!isPlaceholderChoices(doc.choices)) continue;
    matched++;
    if (opts.dryRun) {
      console.log(`  would reject ${doc._id} | ${doc.conceptId}`);
      continue;
    }
    await col.updateOne(
      { _id: doc._id },
      {
        $set: {
          status: "rejected",
          updatedAt: new Date(),
          "qualityCheck.ruleFailures": [
            "choices_placeholder_letters",
            ...(doc.qualityCheck?.ruleFailures ?? []),
          ],
        },
      }
    );
    updated++;
  }

  await client.close();
  console.log(
    opts.dryRun
      ? `Found ${matched} placeholder-choice questions (dry run).`
      : `Rejected ${updated} placeholder-choice questions.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
