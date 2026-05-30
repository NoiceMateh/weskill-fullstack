import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is empty. Backend is running with in-memory data.");
    return false;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
  });

  console.log("MongoDB connected");
  return true;
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}
