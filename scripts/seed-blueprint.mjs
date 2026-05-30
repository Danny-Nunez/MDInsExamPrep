/**
 * Import maryland_life_health_blueprint_v4.json into MongoDB `concepts` collection.
 * One document per learning objective.
 *
 * Usage: npm run seed:blueprint
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { connectMongo } from "./lib/mongo-connect.mjs";

const jsonPath = resolve(
  process.cwd(),
  "maryland_life_health_blueprint_v4.json"
);

function flattenBlueprint(rows) {
  const docs = [];
  for (const row of rows) {
    const objectives = row.objectives ?? [];
    for (const obj of objectives) {
      docs.push({
        blueprintConceptId: row.conceptId,
        objectiveId: obj.objectiveId,
        domain: row.domain,
        subdomain: row.subdomain,
        concept: row.concept,
        objective: obj.learningObjective,
        questionType: obj.questionType,
        difficulty: obj.difficulty,
        examWeight: row.examWeight,
        marylandSpecific: row.marylandSpecific,
        questionTarget: obj.questionTarget ?? 0,
        source: row.sourceBasis ?? "blueprint_v4",
        status: row.status ?? "ready_for_generation",
        generationPrompt: obj.generationPrompt,
      });
    }
  }
  return docs;
}

async function main() {
  const raw = readFileSync(jsonPath, "utf8");
  const blueprint = JSON.parse(raw);
  const docs = flattenBlueprint(blueprint);
  console.log(
    `Loaded ${blueprint.length} blueprint concepts → ${docs.length} learning objectives`
  );

  const client = await connectMongo();
  const col = client.db("examprep").collection("concepts");

  await col.createIndex({ objectiveId: 1 }, { unique: true });
  await col.createIndex({ domain: 1, subdomain: 1 });

  const BATCH = 500;
  let upserted = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = docs.slice(i, i + BATCH);
    const ops = batch.map((doc) => ({
      updateOne: {
        filter: { objectiveId: doc.objectiveId },
        update: { $set: doc },
        upsert: true,
      },
    }));
    const result = await col.bulkWrite(ops, { ordered: false });
    upserted +=
      (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);
    console.log(`  batch ${i / BATCH + 1}: ${batch.length} rows`);
  }

  const total = await col.countDocuments();
  console.log(`Done. Upserted/updated ~${upserted} rows. Collection total: ${total}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
