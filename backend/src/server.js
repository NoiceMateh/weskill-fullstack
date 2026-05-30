import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initMemoryStore } from "./data/memoryStore.js";
import mongoose from "mongoose";

async function bootstrap() {
  await initMemoryStore();
  await connectDb();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`WeSkill API listening on http://localhost:${env.port}/v1`);
  });

  server.on("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the old server or change PORT in .env.`);
    } else {
      console.error(error);
    }
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down WeSkill API.`);
    server.close(async () => {
      await mongoose.disconnect().catch(() => {});
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
