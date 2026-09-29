import { config } from "dotenv";
import { createDatabaseClient } from "../src/lib/db/create-client";
import { readDatabaseUrl } from "../src/lib/db/environment";
import {
  findSourceForVerification,
  saveSourceVerification,
} from "../src/lib/db/repositories/source-verification-repository";
import { verifyOfficialSource } from "../src/features/sources/server/verify-official-source";
import { parseVerificationCommand } from "../src/features/sources/server/verification-command";

async function main() {
  config({ path: ".env.local", quiet: true });
  const sourceId = parseVerificationCommand(process.argv.slice(2), process.env);
  const db = createDatabaseClient(
    readDatabaseUrl(process.env.DIRECT_URL, "DIRECT_URL"),
  );
  try {
    const result = await verifyOfficialSource(sourceId, {
      findSource: (id) => findSourceForVerification(db, id),
      save: (source, verification) =>
        saveSourceVerification(db, source, verification),
    });
    console.info(
      JSON.stringify({
        event: "official_source_verified",
        status: result.status,
        reason: result.reason,
        httpStatus: result.httpStatus,
        checkedAt: result.checkedAt.toISOString(),
        durationMs: result.durationMs,
      }),
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch(() => {
  console.error(
    JSON.stringify({
      event: "official_source_verification_failed",
      code: "SOURCE_VERIFICATION_FAILED",
    }),
  );
  process.exitCode = 1;
});
