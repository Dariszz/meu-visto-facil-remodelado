import { config } from "dotenv";
import { createDatabaseClient } from "../src/lib/db/create-client";
import { readDatabaseUrl } from "../src/lib/db/environment";
import { publishDevelopmentCatalog } from "../prisma/publish-development-catalog";

async function main() {
  config({ path: ".env.local", quiet: true });
  if (
    process.env.NODE_ENV === "production" ||
    process.env.DB_SEED_CONFIRM !== "development" ||
    process.argv[2] !== "--confirm-development"
  )
    throw new Error("PUBLICATION_TARGET_REJECTED");
  const client = createDatabaseClient(
    readDatabaseUrl(process.env.DIRECT_URL, "DIRECT_URL"),
  );
  try {
    const result = await client.$transaction(publishDevelopmentCatalog, {
      timeout: 30_000,
      isolationLevel: "Serializable",
    });
    console.info(`DEVELOPMENT_CATALOG: ${result}`);
  } finally {
    await client.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "CATALOG_PUBLICATION_FAILED: confira o alvo, a conexão e a consistência editorial localmente",
  );
  process.exitCode = 1;
});
