import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL || "",
  },
});
