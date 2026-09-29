import "server-only";
import { createDatabaseClient } from "./create-client";
import { readDatabaseUrl } from "./environment";

const globalDatabase = globalThis as typeof globalThis & {
  databaseClient?: ReturnType<typeof createDatabaseClient>;
};
let client: ReturnType<typeof createDatabaseClient> | undefined;

export function getDatabaseClient() {
  client ??=
    globalDatabase.databaseClient ??
    createDatabaseClient(
      readDatabaseUrl(process.env.DATABASE_URL, "DATABASE_URL"),
    );
  if (process.env.NODE_ENV !== "production")
    globalDatabase.databaseClient = client;
  return client;
}
