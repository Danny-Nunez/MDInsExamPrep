import { MongoClient, ServerApiVersion } from "mongodb";

const CLIENT_OPTIONS = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  autoSelectFamily: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

/** Same shard hosts as Atlas "standard" connection for cluster0.3hubza8 */
const DEFAULT_STANDARD_HOSTS =
  "ac-xn0udlw-shard-00-00.3hubza8.mongodb.net:27017,ac-xn0udlw-shard-00-01.3hubza8.mongodb.net:27017,ac-xn0udlw-shard-00-02.3hubza8.mongodb.net:27017";

const DEFAULT_REPLICA_SET = "atlas-rzzps6-shard-0";

/**
 * Build mongodb:// URI from mongodb+srv:// using the SAME user/password as the app.
 * Fixes local querySrv ECONNREFUSED while Vercel still uses MONGO_URI SRV.
 */
function standardUriFromSrv(srvUri) {
  const match = srvUri.match(
    /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(?:\?(.*))?$/
  );
  if (!match) return null;

  const [, user, password, , query] = match;
  const hosts =
    process.env.MONGO_STANDARD_HOSTS?.trim() || DEFAULT_STANDARD_HOSTS;
  const replicaSet =
    process.env.MONGO_REPLICA_SET?.trim() || DEFAULT_REPLICA_SET;

  const params = new URLSearchParams(query ?? "");
  params.set("ssl", "true");
  params.set("authSource", "admin");
  params.set("replicaSet", replicaSet);
  if (!params.has("retryWrites")) params.set("retryWrites", "true");
  if (!params.has("w")) params.set("w", "majority");
  if (!params.has("appName")) params.set("appName", "Cluster0");

  return `mongodb://${user}:${password}@${hosts}/?${params.toString()}`;
}

function assertNoPlaceholder(uri, label) {
  if (!uri) return;
  if (uri.includes("<db_password>") || uri.includes("<password>")) {
    throw new Error(`${label} still has a placeholder password.`);
  }
}

function parseCredentials(uri) {
  if (!uri) return null;
  const m = uri.match(/^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@/);
  return m ? { user: m[1], password: m[2] } : null;
}

function warnIfPasswordMismatch(srvUri, manualStandard) {
  const a = parseCredentials(srvUri);
  const b = parseCredentials(manualStandard);
  if (a && b && a.password !== b.password) {
    console.warn(
      "WARNING: MONGO_URI and MONGO_URI_STANDARD use different passwords. After an Atlas reset, update BOTH to the same value (and Vercel MONGO_URI too)."
    );
  }
}

function resolveConnectionUris() {
  const srvUri = process.env.MONGO_URI?.trim();
  const manualStandard = process.env.MONGO_URI_STANDARD?.trim();

  assertNoPlaceholder(srvUri, "MONGO_URI");
  assertNoPlaceholder(manualStandard, "MONGO_URI_STANDARD");
  warnIfPasswordMismatch(srvUri, manualStandard);

  const uris = [];

  if (manualStandard) {
    uris.push(manualStandard);
    console.log(
      "Using MONGO_URI_STANDARD for local scripts (skipping mongodb+srv — avoids Mac SRV DNS issues)."
    );
    return uris;
  }

  if (srvUri?.startsWith("mongodb+srv://")) {
    const derived = standardUriFromSrv(srvUri);
    if (derived) {
      uris.push(derived);
      console.log(
        "Derived standard connection from MONGO_URI (same password; SRV not used locally)."
      );
    }
    uris.push(srvUri);
  } else if (srvUri) {
    uris.push(srvUri);
  }

  if (uris.length === 0) {
    throw new Error(
      "Set MONGO_URI and/or MONGO_URI_STANDARD in .env (see .env.example)."
    );
  }

  return [...new Set(uris)];
}

export async function connectMongo() {
  const uris = resolveConnectionUris();

  let lastErr;
  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    let client;
    try {
      client = new MongoClient(uri, CLIENT_OPTIONS);
      await client.connect();
      await client.db("examprep").command({ ping: 1 });
      return client;
    } catch (err) {
      lastErr = err;
      if (client) await client.close().catch(() => {});

      if (isInvalidUriError(err)) {
        throw new Error(formatInvalidUriHelp(err));
      }

      if (uris[i + 1]) {
        console.warn(
          `Connection attempt ${i + 1} failed (${err.codeName ?? err.code ?? "error"}) — trying next…`
        );
        continue;
      }
    }
  }

  if (isAuthError(lastErr)) throw new Error(formatAuthHelp());
  if (isSrvDnsError(lastErr)) throw new Error(formatSrvHelp(lastErr));
  throw lastErr;
}

function isSrvDnsError(err) {
  const msg = err?.message ?? "";
  return (
    err?.code === "ECONNREFUSED" &&
    (msg.includes("querySrv") || msg.includes("_mongodb._tcp"))
  );
}

function isAuthError(err) {
  return err?.code === 8000 || err?.message?.includes("authentication failed");
}

function isInvalidUriError(err) {
  return err?.name === "TypeError" && String(err?.message).includes("Invalid URL");
}

function formatInvalidUriHelp(err) {
  return `Invalid MongoDB URL. If the password contains @ # : / ? encode it in MONGO_URI, or reset to alphanumeric in Atlas.

${err.message}`;
}

function formatAuthHelp() {
  return `Authentication failed (bad auth).

Checklist:
  1. Atlas → Database Access → danny_db_user → password matches what is in .env
  2. MONGO_URI and MONGO_URI_STANDARD must use the SAME new password
  3. Atlas → Network Access → allow your IP (or 0.0.0.0/0 for dev)
  4. After resetting password in Atlas, wait ~1 minute, then npm run mongo:ping

Local scripts use MONGO_URI_STANDARD only (when set). Vercel uses MONGO_URI (mongodb+srv) — update both after a password change.`;
}

function formatSrvHelp(err) {
  return `SRV DNS failed and standard hosts could not connect. Set MONGO_STANDARD_HOSTS in .env if your Atlas cluster uses different shard hostnames.

${err.message}`;
}
