import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

declare global {
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

export const db =
  globalThis.__db ||
  drizzle(sql, {
    schema,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

// Re-export schema for convenience
export * from "./schema";
