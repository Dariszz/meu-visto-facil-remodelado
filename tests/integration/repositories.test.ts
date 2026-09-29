import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import { findPublicCountry } from "../../src/lib/db/repositories/country-repository";
import {
  findPublicVisa,
  listPublicVisas,
} from "../../src/lib/db/repositories/visa-repository";
import { listPublicVisaSources } from "../../src/lib/db/repositories/official-source-repository";
import { presentCriticalSkills } from "../../src/features/visas/catalog-presentation";
import { seedCatalog } from "../../prisma/seed-catalog";
import { publishDevelopmentCatalog } from "../../prisma/publish-development-catalog";

test("public repositories: publication, country isolation, ordering, source relations and presentation", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_REPOSITORY_FIXTURES");
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          const country = await tx.country.create({
            data: {
              code: "XA",
              slug: "repository-country-a",
              name: "Database country",
              status: "ACTIVE",
            },
          });
          const other = await tx.country.create({
            data: {
              code: "XB",
              slug: "repository-country-b",
              name: "Other",
              status: "ACTIVE",
            },
          });
          const category = await tx.visaCategory.create({
            data: { slug: "repository-category", name: "Database category" },
          });
          const base = {
            countryId: country.id,
            categoryId: category.id,
            slug: "shared-slug",
            name: "Database visa",
            shortDescription: "Database summary",
            description: "Database description",
            status: "ACTIVE" as const,
          };
          const visa = await tx.visa.create({ data: base });
          const otherVisa = await tx.visa.create({
            data: { ...base, countryId: other.id, name: "Other country visa" },
          });
          await tx.visa.create({
            data: { ...base, slug: "draft", status: "DRAFT" },
          });
          await tx.visa.create({
            data: { ...base, slug: "archived", status: "ARCHIVED" },
          });
          await tx.visa.create({
            data: { ...base, slug: "first", name: "A first" },
          });
          const source = await tx.officialSource.create({
            data: {
              countryId: country.id,
              title: "Database source",
              authority: "Database authority",
              url: "https://enterprise.gov.ie/repository-fixture",
              hostname: "enterprise.gov.ie",
              editorialConsultedAt: new Date("2026-08-01T00:00:00Z"),
              lastVerifiedAt: new Date("2026-09-20T18:45:12.123Z"),
              lastSuccessfulVerificationAt: new Date(
                "2026-09-18T06:15:30.456Z",
              ),
            },
          });
          const requirementOnly = await tx.officialSource.create({
            data: {
              countryId: country.id,
              title: "A requirement source",
              authority: "Authority",
              url: "https://enterprise.gov.ie/requirement-fixture",
              hostname: "enterprise.gov.ie",
            },
          });
          const foreignSource = await tx.officialSource.create({
            data: {
              countryId: other.id,
              title: "Foreign source",
              authority: "Other",
              url: "https://enterprise.gov.ie/foreign-fixture",
              hostname: "enterprise.gov.ie",
            },
          });
          for (const [code, sortOrder] of [
            ["z-last", 9],
            ["b-tie", 1],
            ["a-tie", 1],
          ] as const) {
            await tx.visaRequirement.create({
              data: {
                visaId: visa.id,
                code,
                sortOrder,
                title: `Database requirement ${code}`,
                description: "Text from PostgreSQL",
                category: "OTHER",
                requirementType: "INFORMATION",
                sources: {
                  create: {
                    sourceId: requirementOnly.id,
                    relationType: "SUPPORTING",
                  },
                },
              },
            });
          }
          await tx.visaSource.createMany({
            data: [source.id, foreignSource.id].map((sourceId) => ({
              visaId: visa.id,
              sourceId,
              relationType: "OVERVIEW",
            })),
          });
          assert.equal(
            (await findPublicCountry(country.slug, tx))?.name,
            "Database country",
          );
          assert.equal(await findPublicCountry("missing", tx), null);
          assert.equal(await findPublicVisa(country.slug, "missing", tx), null);
          assert.equal(await findPublicVisa(country.slug, "draft", tx), null);
          assert.equal(
            await findPublicVisa(country.slug, "archived", tx),
            null,
          );
          assert.deepEqual(
            await listPublicVisaSources(country.slug, "draft", tx),
            [],
          );
          assert.deepEqual(
            (await listPublicVisas(country.slug, category.slug, tx)).map(
              (item) => item.slug,
            ),
            ["first", "shared-slug"],
          );
          assert.equal(
            (await findPublicVisa(other.slug, "shared-slug", tx))?.id,
            otherVisa.id,
          );
          const detail = await findPublicVisa(country.slug, "shared-slug", tx);
          assert.ok(detail);
          assert.deepEqual(
            detail.requirements.map((item) => item.code),
            ["a-tie", "b-tie", "z-last"],
          );
          assert.deepEqual(detail.sources, [
            { sourceId: source.id, relationType: "OVERVIEW" },
          ]);
          assert.deepEqual(detail.requirements[0].sources, [
            { sourceId: requirementOnly.id, relationType: "SUPPORTING" },
          ]);
          const sources = await listPublicVisaSources(
            country.slug,
            "shared-slug",
            tx,
          );
          assert.deepEqual(
            sources.map((item) => item.id),
            [requirementOnly.id, source.id],
          );
          assert.deepEqual(
            sources.find((item) => item.id === source.id),
            {
              id: source.id,
              title: "Database source",
              authority: "Database authority",
              url: "https://enterprise.gov.ie/repository-fixture",
              hostname: "enterprise.gov.ie",
              status: "ACTIVE",
              consultedAt: "2026-08-01",
              lastVerifiedAt: "2026-09-20T18:45:12.123Z",
              lastSuccessfulVerificationAt: "2026-09-18T06:15:30.456Z",
            },
          );
          const unverified = sources.find(
            (item) => item.id === requirementOnly.id,
          );
          assert.equal(unverified?.consultedAt, null);
          assert.equal(unverified?.lastVerifiedAt, null);
          assert.equal(unverified?.lastSuccessfulVerificationAt, null);
          // Real database projections travel through the same mapper used by the Server Component.
          const presentation = presentCriticalSkills(detail, sources);
          assert.equal(presentation.name, "Database visa");
          assert.equal(presentation.description, "Database description");
          assert.equal(presentation.countryName, "Database country");
          assert.equal(
            presentation.requirements[0].text,
            "Text from PostgreSQL",
          );
          assert.equal(
            presentation.sources[source.id].authority,
            "Database authority",
          );
          for (const status of ["TEMPORARILY_UNAVAILABLE", "BROKEN"] as const) {
            await tx.officialSource.update({
              where: { id: source.id },
              data: { status },
            });
            const unavailable = (
              await listPublicVisaSources(country.slug, "shared-slug", tx)
            ).find((item) => item.id === source.id);
            assert.equal(unavailable?.url, null);
            assert.equal(unavailable?.status, status);
            assert.equal(
              unavailable?.lastVerifiedAt,
              "2026-09-20T18:45:12.123Z",
            );
            assert.equal(
              unavailable?.lastSuccessfulVerificationAt,
              "2026-09-18T06:15:30.456Z",
            );
          }
          await tx.officialSource.update({
            where: { id: source.id },
            data: { status: "ACTIVE", url: "javascript:alert(1)" },
          });
          assert.equal(
            (await listPublicVisaSources(country.slug, "shared-slug", tx)).find(
              (item) => item.id === source.id,
            )?.url,
            null,
          );
          await tx.officialSource.updateMany({
            where: { countryId: country.id },
            data: { status: "ARCHIVED" },
          });
          assert.deepEqual(
            await listPublicVisaSources(country.slug, "shared-slug", tx),
            [],
          );
          assert.deepEqual(
            (await findPublicVisa(country.slug, "shared-slug", tx))
              ?.requirements[0].sources,
            [],
          );
          await tx.visaRequirement.createMany({
            data: Array.from({ length: 198 }, (_, index) => ({
              visaId: visa.id,
              code: `limit-${index}`,
              title: "Limit fixture",
              description: "Must never be silently truncated",
              category: "OTHER" as const,
              requirementType: "INFORMATION" as const,
            })),
          });
          await assert.rejects(
            findPublicVisa(country.slug, "shared-slug", tx),
            /CATALOG_UNAVAILABLE/,
          );
          for (const status of ["COMING_SOON", "DISABLED"] as const) {
            await tx.country.update({
              where: { id: country.id },
              data: { status },
            });
            assert.equal(await findPublicCountry(country.slug, tx), null);
            assert.equal(
              await findPublicVisa(country.slug, "shared-slug", tx),
              null,
            );
            assert.deepEqual(
              await listPublicVisas(country.slug, category.slug, tx),
              [],
            );
            assert.deepEqual(
              await listPublicVisaSources(country.slug, "shared-slug", tx),
              [],
            );
          }
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

test("development publication is limited, repeatable and rejects editorial divergence", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_PUBLICATION_FIXTURES");
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          await seedCatalog(tx);
          assert.equal(
            await findPublicVisa(
              "ireland",
              "critical-skills-employment-permit",
              tx,
            ),
            null,
          );
          assert.equal(await publishDevelopmentCatalog(tx), "DRAFT_TO_ACTIVE");
          assert.equal(await publishDevelopmentCatalog(tx), "ALREADY_ACTIVE");
          assert.ok(
            await findPublicVisa(
              "ireland",
              "critical-skills-employment-permit",
              tx,
            ),
          );
          await tx.visa.update({
            where: { id: "seed-visa-ie-critical-skills" },
            data: { description: "Unreviewed edit" },
          });
          await assert.rejects(
            publishDevelopmentCatalog(tx),
            /CATALOG_PUBLICATION_REVIEW_REQUIRED/,
          );
          await tx.visa.update({
            where: { id: "seed-visa-ie-critical-skills" },
            data: { status: "ARCHIVED" },
          });
          await assert.rejects(
            publishDevelopmentCatalog(tx),
            /CATALOG_PUBLICATION_REVIEW_REQUIRED/,
          );
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
