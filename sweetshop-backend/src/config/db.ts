// src/config/db.ts
import mongoose from "mongoose";
import { seedSweets } from "./seedSweets";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment (.env). Add MONGO_URI and restart.");
  process.exit(1);
}

export default async function connectDB() {
  try {
    console.log("Connecting to MongoDB…");
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      family: 4,
    } as any);
    console.log("✅ MongoDB Connected");

    await seedSweets();
  } catch (err: any) {
    console.error("❌ MongoDB Connection Error:", err);
    console.error("  - MONGO_URI (first 80 chars):", MONGO_URI.slice(0, 80));
    console.error("  - Check network access / IP whitelist in Atlas");
    process.exit(1);
  }
}
