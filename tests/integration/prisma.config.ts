import { defineConfig } from "prisma/config";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";

export default defineConfig({
  schema: "../../prisma/schema.prisma",
  migrations: { path: "../../prisma/migrations" },
  datasource: { url: readTestDatabaseUrl(process.env) },
});
