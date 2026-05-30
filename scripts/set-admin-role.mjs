/**
 * Grant admin role in MongoDB (works even if ADMIN_EMAILS is missing on Vercel).
 *
 * Usage:
 *   node --env-file=.env scripts/set-admin-role.mjs dnunez22@gmail.com
 */
import { connectMongo } from "./lib/mongo-connect.mjs";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node --env-file=.env scripts/set-admin-role.mjs you@example.com");
  process.exit(1);
}

const client = await connectMongo();
const db = client.db();
const result = await db.collection("users").updateOne(
  { email },
  { $set: { role: "admin" } }
);

if (result.matchedCount === 0) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`Set role=admin for ${email}. Sign out and sign in again.`);
await client.close();
