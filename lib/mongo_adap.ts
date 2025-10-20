import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI!;
const options: Record<string, unknown> = {};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env");
}

// Extend the global type to include our cached MongoClientPromise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse the client in development to prevent too many connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Create a new client in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
