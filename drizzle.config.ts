import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  out: "./src/db",
  dbCredentials: {
    uri: process.env.DATABASE_URL ?? "",
  },
  tablesFilter: [
    "followers",
    "likes",
    "notifications",
    "reposts",
    "threads",
    "users",
  ],
  verbose: true,
  strict: true,
});
