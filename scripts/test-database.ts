import { config } from "dotenv";
import { spawnSync } from "node:child_process";

import { readTestDatabaseUrl } from "../src/lib/db/environment";

async function main() {
  config({ path: ".env.test.local", quiet: true });
  readTestDatabaseUrl(process.env);
  // migrate deploy is repeatable on an already migrated, explicitly confirmed test target.
  // Capture tool output so connection errors cannot print credentials in CI.
  const migration = spawnSync(
    process.execPath,
    [
      "node_modules/prisma/build/index.js",
      "migrate",
      "deploy",
      "--config",
      "tests/integration/prisma.config.ts",
    ],
    { env: process.env, encoding: "utf8" },
  );
  if (migration.status !== 0) throw new Error("DATABASE_TEST_MIGRATION_FAILED");
  console.info("DATABASE_TEST_MIGRATION_APPLIED");
  const tests = spawnSync(
    process.execPath,
    [
      "--conditions=react-server",
      "--import",
      "tsx",
      "--test",
      "tests/integration/catalog.test.ts",
      "tests/integration/repositories.test.ts",
      "tests/integration/source-verification.test.ts",
      "tests/integration/user-profile.test.ts",
    ],
    { env: process.env, encoding: "utf8" },
  );
  if (tests.status !== 0)
    throw new Error("DATABASE_INTEGRATION_ASSERTION_FAILED");
  console.info("DATABASE_INTEGRATION_PASSED");
}

main().catch((error: unknown) => {
  const safeCodes = [
    "DATABASE_CONFIG_INVALID: TEST_DATABASE_URL",
    "DATABASE_TEST_TARGET_REJECTED",
    "DATABASE_TEST_NOT_EMPTY",
    "DATABASE_TEST_MIGRATION_FAILED",
    "DATABASE_INTEGRATION_ASSERTION_FAILED",
  ];
  console.error(
    error instanceof Error && safeCodes.includes(error.message)
      ? error.message
      : "DATABASE_TEST_CONNECTION_FAILED",
  );
  process.exitCode = 1;
});
