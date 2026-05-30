/**
 * Test MongoDB connectivity (SRV then MONGO_URI_STANDARD fallback).
 * Usage: npm run mongo:ping
 */
import { connectMongo } from "./lib/mongo-connect.mjs";

const client = await connectMongo();
const result = await client.db("examprep").command({ ping: 1 });
console.log("MongoDB OK — ping:", result.ok);
const concepts = await client.db("examprep").collection("concepts").countDocuments();
const questions = await client.db("examprep").collection("questions").countDocuments();
console.log(`  concepts: ${concepts}, questions: ${questions}`);
await client.close();
