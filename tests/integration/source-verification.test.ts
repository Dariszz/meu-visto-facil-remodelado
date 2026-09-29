import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import {
  findSourceForVerification,
  saveSourceVerification,
} from "../../src/lib/db/repositories/source-verification-repository";
import { verifyOfficialSource } from "../../src/features/sources/server/verify-official-source";
import type { SourceVerificationResult } from "../../src/features/sources/server/validate-official-source-url";
import type { Prisma } from "../../src/lib/db/generated/client";

test("source verification persists technical metadata while preserving editorial data and rejecting stale writes", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_SOURCE_VERIFICATION");
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          const country = await tx.country.create({
            data: {
              code: "XV",
              slug: "verification-fixture",
              name: "Verification fixture",
            },
          });
          const initial = await tx.officialSource.create({
            data: {
              countryId: country.id,
              title: "Fixture source",
              authority: "Fixture authority",
              url: "https://enterprise.gov.ie/verification-fixture",
              hostname: "enterprise.gov.ie",
              editorialConsultedAt: new Date("2026-08-01T00:00:00Z"),
            },
          });
          assert.equal(initial.verificationResolvedUrl, null);
          assert.equal(initial.verificationDurationMs, null);
          assert.equal(initial.lastVerifiedAt, null);
          assert.equal(initial.lastSuccessfulVerificationAt, null);
          const success: SourceVerificationResult = {
            status: "ACTIVE",
            reason: "HTTP_OK",
            httpStatus: 200,
            resolvedUrl: "https://enterprise.gov.ie/resolved-fixture",
            checkedAt: new Date("2026-09-29T10:00:00.123Z"),
            durationMs: 42,
          };
          let calls = 0;
          let nextResult = success;
          const dependencies = {
            findSource: (id: string) => findSourceForVerification(tx, id),
            save: (
              source: NonNullable<
                Awaited<ReturnType<typeof findSourceForVerification>>
              >,
              result: SourceVerificationResult,
            ) => saveSourceVerification(tx, source, result),
            validate: async () => {
              calls++;
              return nextResult;
            },
          };
          await verifyOfficialSource(initial.id, dependencies);
          let persisted = await tx.officialSource.findUniqueOrThrow({
            where: { id: initial.id },
          });
          assert.equal(persisted.status, "ACTIVE");
          assert.equal(persisted.verificationStatusCode, 200);
          assert.equal(persisted.verificationResolvedUrl, success.resolvedUrl);
          assert.equal(persisted.verificationDurationMs, 42);
          assert.deepEqual(persisted.lastVerifiedAt, success.checkedAt);
          assert.deepEqual(
            persisted.lastSuccessfulVerificationAt,
            success.checkedAt,
          );

          for (const failure of [
            {
              status: "TEMPORARILY_UNAVAILABLE",
              reason: "TIMEOUT",
              httpStatus: null,
            },
            { status: "BROKEN", reason: "HTTP_NOT_FOUND", httpStatus: 404 },
          ] as const) {
            nextResult = {
              ...success,
              ...failure,
              checkedAt: new Date(success.checkedAt.getTime() + calls * 1000),
              resolvedUrl: null,
              durationMs: 100,
            };
            await verifyOfficialSource(initial.id, dependencies);
            persisted = await tx.officialSource.findUniqueOrThrow({
              where: { id: initial.id },
            });
            assert.equal(persisted.status, failure.status);
            assert.equal(persisted.verificationStatusCode, failure.httpStatus);
            assert.equal(persisted.verificationResolvedUrl, null);
            assert.equal(persisted.verificationDurationMs, 100);
            assert.deepEqual(persisted.lastVerifiedAt, nextResult.checkedAt);
            assert.deepEqual(
              persisted.lastSuccessfulVerificationAt,
              success.checkedAt,
            );
            assert.equal(persisted.url, initial.url);
            assert.equal(persisted.hostname, initial.hostname);
            assert.deepEqual(
              persisted.editorialConsultedAt,
              initial.editorialConsultedAt,
            );
          }

          const concurrentChanges: Prisma.OfficialSourceUpdateInput[] = [
            { url: "https://enterprise.gov.ie/editorial-new-fixture" },
            { hostname: "www.irishimmigration.ie" },
            { updatedAt: new Date("2030-01-01T00:00:00Z") },
            { lastVerifiedAt: new Date("2031-01-01T00:00:00Z") },
            { status: "ARCHIVED" },
          ];
          for (const data of concurrentChanges) {
            const snapshot = await findSourceForVerification(tx, initial.id);
            assert.ok(snapshot);
            await tx.officialSource.update({ where: { id: initial.id }, data });
            const concurrentRecord = await tx.officialSource.findUniqueOrThrow({
              where: { id: initial.id },
            });
            assert.equal(
              await saveSourceVerification(tx, snapshot, success),
              false,
            );
            assert.deepEqual(
              await tx.officialSource.findUniqueOrThrow({
                where: { id: initial.id },
              }),
              concurrentRecord,
            );
          }
          const archived = await tx.officialSource.findUniqueOrThrow({
            where: { id: initial.id },
          });
          assert.equal(
            await saveSourceVerification(tx, archived, success),
            false,
          );
          assert.equal(await findSourceForVerification(tx, initial.id), null);
          for (const id of ["missing", initial.id]) {
            await assert.rejects(
              verifyOfficialSource(id, dependencies),
              /SOURCE_NOT_FOUND/,
            );
          }
          assert.equal(calls, 3);
          throw rollback;
        },
        { timeout: 60_000 },
      ),
      (error) => error === rollback,
    );
  } finally {
    await client.$disconnect();
  }
});
