import "server-only";
import { createDatabaseClient } from "./create-client";
import { readDatabaseUrl } from "./environment";

const globalProfileDatabase = globalThis as typeof globalThis & {
  profileDatabaseClient?: ReturnType<typeof createDatabaseClient>;
};
let client: ReturnType<typeof createDatabaseClient> | undefined;

export function getProfileDatabaseClient() {
  client ??=
    globalProfileDatabase.profileDatabaseClient ??
    createDatabaseClient(
      readDatabaseUrl(process.env.PROFILE_DATABASE_URL, "PROFILE_DATABASE_URL"),
    );
  if (process.env.NODE_ENV !== "production")
    globalProfileDatabase.profileDatabaseClient = client;
  return client;
}
