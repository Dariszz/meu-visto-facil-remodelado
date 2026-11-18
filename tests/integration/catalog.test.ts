import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import { seedCatalog } from "../../prisma/seed-catalog";
import type { Prisma } from "../../src/lib/db/generated/client";

test("real PostgreSQL catalog: seed, relations, constraints and conservative deletion", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_FIXTURES");
  async function snapshot(tx: Prisma.TransactionClient) {
    return Promise.all([
      tx.country.findMany({ orderBy: { id: "asc" } }),
      tx.visaCategory.findMany(),
      tx.visa.findMany(),
      tx.visaRequirement.findMany({ orderBy: { code: "asc" } }),
      tx.officialSource.findMany({ orderBy: { id: "asc" } }),
      tx.visaSource.findMany({ orderBy: { sourceId: "asc" } }),
      tx.requirementSource.findMany({ orderBy: { requirementId: "asc" } }),
    ]);
  }
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          await tx.country.create({
            data: {
              id: "external-fixture",
              code: "ZZ",
              slug: "external-fixture",
              name: "Test fixture",
            },
          });
          await seedCatalog(tx);
          const first = await snapshot(tx);
          assert.deepEqual(
            first.map((rows) => rows.length),
            // Países: fixture, Irlanda, Portugal e Espanha; fontes: 3 da Irlanda e 3 de PT/ES;
            // requisitos: 4 condições e 3 etapas da Critical Skills.
            [4, 1, 1, 7, 6, 3, 7],
          );
          await seedCatalog(tx);
          assert.deepEqual(await snapshot(tx), first);
          const visa = await tx.visa.findUniqueOrThrow({
            where: { id: "seed-visa-ie-critical-skills" },
            include: {
              country: true,
              category: true,
              requirements: {
                include: { sources: { include: { source: true } } },
              },
            },
          });
          assert.equal(visa.status, "DRAFT");
          assert.equal(visa.country.code, "IE");
          assert.equal(visa.category.slug, "work");
          for (const requirement of visa.requirements) {
            assert.equal(requirement.sources.length, 1);
            assert.equal(requirement.sources[0].relationType, "PRIMARY");
            assert.equal(requirement.sources[0].source.lastVerifiedAt, null);
            assert.equal(
              requirement.sources[0].source.editorialConsultedAt?.toISOString(),
              "2026-09-10T00:00:00.000Z",
            );
          }
          await tx.visa.update({
            where: { id: visa.id },
            data: { name: "Editorial update" },
          });
          await seedCatalog(tx);
          assert.equal(
            (await tx.visa.findUniqueOrThrow({ where: { id: visa.id } })).name,
            "Editorial update",
          );
          // Savepoints allow checking rejected SQL without aborting the fixture transaction.
          async function rejectsConstraint(
            operation: () => Promise<unknown>,
            code: string,
          ) {
            await tx.$executeRaw`SAVEPOINT constraint_check`;
            await assert.rejects(
              operation(),
              (error: unknown) =>
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === code,
            );
            await tx.$executeRaw`ROLLBACK TO SAVEPOINT constraint_check`;
          }
          await rejectsConstraint(
            () =>
              tx.country.create({
                data: { code: "IE", slug: "duplicate", name: "Duplicate" },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.country.create({
                data: { code: "XY", slug: "ireland", name: "Duplicate slug" },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.visaCategory.create({
                data: { slug: "work", name: "Duplicate" },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.visa.create({
                data: {
                  countryId: visa.countryId,
                  categoryId: visa.categoryId,
                  slug: visa.slug,
                  name: "Duplicate",
                  shortDescription: "test",
                },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.visaRequirement.create({
                data: {
                  visaId: visa.id,
                  code: visa.requirements[0].code,
                  title: "Duplicate",
                  description: "test",
                  category: "OTHER",
                  requirementType: "INFORMATION",
                },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.visaSource.create({
                data: {
                  visaId: visa.id,
                  sourceId: "missing",
                  relationType: "OVERVIEW",
                },
              }),
            "P2003",
          );
          await rejectsConstraint(
            () =>
              tx.visaSource.create({
                data: {
                  visaId: visa.id,
                  sourceId: "seed-source-ie-permit",
                  relationType: "OVERVIEW",
                },
              }),
            "P2002",
          );
          const source = visa.requirements[0].sources[0].source;
          await rejectsConstraint(
            () =>
              tx.officialSource.create({
                data: {
                  countryId: visa.countryId,
                  url: source.url,
                  hostname: source.hostname,
                  title: source.title,
                  authority: source.authority,
                },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.requirementSource.create({
                data: {
                  requirementId: visa.requirements[0].id,
                  sourceId: source.id,
                  relationType: "PRIMARY",
                },
              }),
            "P2002",
          );
          await rejectsConstraint(
            () =>
              tx.requirementSource.create({
                data: {
                  requirementId: "missing",
                  sourceId: source.id,
                  relationType: "PRIMARY",
                },
              }),
            "P2003",
          );
          await rejectsConstraint(
            () => tx.country.delete({ where: { id: visa.countryId } }),
            "P2003",
          );
          await rejectsConstraint(
            () => tx.visa.delete({ where: { id: visa.id } }),
            "P2003",
          );
          await rejectsConstraint(
            () =>
              tx.officialSource.delete({
                where: { id: "seed-source-ie-permit" },
              }),
            "P2003",
          );
          throw rollback;
        },
        { timeout: 60_000 },
      ),
      (error) => error === rollback,
    );
    assert.equal(await client.country.count(), 0);
  } finally {
    await client.$disconnect();
  }
});
