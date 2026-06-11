// ============================================================
//  Reusable MongoDB connection (Mongoose)
//  Caches the connection on the Node global so that Next.js
//  hot-reloads in development don't open a new connection on
//  every request / file change.
// ============================================================
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to .env.local (see .env.example)."
  );
}

// Reuse a single cached connection across hot reloads / lambda invocations.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow a retry on the next request
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;
