import { config } from "dotenv";
import { createDatabaseClient } from "../src/lib/db/create-client";
import { readDatabaseUrl } from "../src/lib/db/environment";
import { seedCatalog } from "./seed-catalog";

async function main() {
  config({ path: ".env.local", quiet: true });
  if (
    process.env.NODE_ENV === "production" ||
    process.env.DB_SEED_CONFIRM !== "development"
  ) {
    throw new Error("SEED_ENVIRONMENT_REJECTED");
  }
  const client = createDatabaseClient(
    readDatabaseUrl(process.env.DIRECT_URL, "DIRECT_URL"),
  );
  try {
    await client.$transaction(seedCatalog, {
      maxWait: 30_000,
      timeout: 600_000,
    });
  } finally {
    await client.$disconnect();
  }
}

main()
  .then(() => console.info("SEED_COMPLETE: development catalog"))
  .catch(() => {
    console.error("SEED_FAILED: confira ambiente e conexão localmente");
    process.exitCode = 1;
  });
