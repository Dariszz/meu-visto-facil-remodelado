import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import { seedCatalog } from "../../prisma/seed-catalog";
import { destinationContents } from "../../prisma/seed-data/countries";
import { irelandContent } from "../../prisma/seed-data/countries/ireland";
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
          // Conteúdo por país: um visto por caminho, um requisito por item e
          // uma fonte primária por requisito.
          const contents = [irelandContent, ...destinationContents];
          const visas = contents.flatMap((content) => content.visas);
          const items = visas.flatMap((visa) => [
            ...visa.requirements,
            ...visa.steps,
          ]);
          const [countries, categories, visaRows, requirements, sources] =
            first;
          // Fixture, Irlanda, Espanha (só links) e os destinos com conteúdo.
          assert.equal(countries.length, 3 + destinationContents.length);
          assert.equal(
            categories.length,
            new Set(["work", ...visas.map((visa) => visa.category)]).size,
          );
          assert.equal(visaRows.length, 1 + visas.length);
          // Critical Skills: 4 condições e 3 etapas.
          assert.equal(requirements.length, 7 + items.length);
          assert.equal(first[6].length, 7 + items.length);
          for (const content of contents)
            for (const source of Object.values(content.sources))
              assert.ok(sources.some((row) => row.url === source.url));
          await seedCatalog(tx);
          assert.deepEqual(await snapshot(tx), first);
          // Conteúdo revisado por país entra publicado, com etapas e uma fonte
          // oficial por item.
          const general = await tx.visa.findUniqueOrThrow({
            where: { id: "seed-visa-ie-general-employment-permit" },
            include: { requirements: { include: { sources: true } } },
          });
          assert.equal(general.status, "ACTIVE");
          assert.equal(general.reviewStatus, "REVIEWED");
          assert.deepEqual(
            general.requirements.map((item) => item.requirementType).sort(),
            [...Array(5).fill("CONDITION"), ...Array(4).fill("ACTION")].sort(),
          );
          assert.ok(
            general.requirements.every((item) => item.sources.length === 1),
          );
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
