import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  // Cache the connection pool across development reloads and warm serverless invocations.
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

// Create one server-only MongoDB client from Vercel's integration-provided connection string.
function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!global.mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5_000,
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    });
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}

// Use an explicit database name when supplied; otherwise respect the database encoded in MONGODB_URI.
export async function getMongoDatabase() {
  const clientPromise = getMongoClient();
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB);
}
