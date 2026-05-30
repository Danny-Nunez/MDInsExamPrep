/**
 * MongoDB connection diagnostics (no secrets printed).
 * Usage: npm run mongo:diagnose
 */
import { connectMongo } from "./lib/mongo-connect.mjs";

function parseCreds(uri) {
  const m = uri?.match(/^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@/);
  return m ? { user: m[1], password: m[2] } : null;
}

const srv = process.env.MONGO_URI?.trim();
const std = process.env.MONGO_URI_STANDARD?.trim();
const a = parseCreds(srv);
const b = parseCreds(std);

console.log("--- MongoDB diagnose ---");
console.log("MONGO_URI set:", !!srv);
console.log("MONGO_URI_STANDARD set:", !!std);
if (a && b) {
  console.log("Users match:", a.user === b.user, `(${a.user})`);
  console.log("Passwords match:", a.password === b.password);
  if (a.password !== b.password) {
    console.log(
      "\nFIX: Use the same password in both lines (the one from Atlas → Database Access → Edit user → Show/reset password)."
    );
    process.exit(1);
  }
}

try {
  const client = await connectMongo();
  const ping = await client.db("examprep").command({ ping: 1 });
  const concepts = await client.db("examprep").collection("concepts").countDocuments();
  console.log("\nConnection: OK");
  console.log("Ping:", ping.ok);
  console.log("Concepts in DB:", concepts);
  await client.close();
} catch (e) {
  console.log("\nConnection: FAILED");
  console.log(e.message);
  console.log(`
If passwords match in .env but auth still fails:
  1. Atlas → Database Access → danny_db_user → Edit → Reset Password
  2. Copy the password Atlas shows (or you type) into BOTH .env lines + Vercel MONGO_URI
  3. Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0) for dev
  4. Wait 60 seconds, run again
`);
  process.exit(1);
}
