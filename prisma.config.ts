import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import { readDatabaseUrl } from "./src/lib/db/environment";

config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --conditions=react-server --import tsx prisma/seed.ts",
  },
  // Validate/generate work without credentials; connection commands require DIRECT_URL.
  datasource: process.env.DIRECT_URL
    ? { url: readDatabaseUrl(process.env.DIRECT_URL, "DIRECT_URL") }
    : undefined,
});
