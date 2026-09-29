import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { readDatabaseUrl } from "./environment";

export function createDatabaseClient(connectionString: string) {
  const adapter = new PrismaPg(
    {
      connectionString: readDatabaseUrl(connectionString, "DATABASE_URL"),
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    },
    { schema: "catalog" },
  );
  return new PrismaClient({ adapter, log: [], errorFormat: "minimal" });
}
