import { MongoClient, Db, ServerApiVersion } from "mongodb";

/**
 * Serverless-friendly MongoDB client (Vercel + Atlas).
 * @see https://www.mongodb.com/docs/drivers/node/current/integrations/nextjs/
 */
const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Fixes TLS "alert internal error" (80) on some Node/Vercel + Atlas combinations
  autoSelectFamily: false,
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

function getUri(): string {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  const uri = getUri();
  return new MongoClient(uri, clientOptions).connect();
}

/** Reuse one client per serverless instance (dev + production). */
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? connect();

if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise;
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("examprep");
}
