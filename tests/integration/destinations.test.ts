import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import {
  findPublicDestination,
  listPublicDestinations,
} from "../../src/lib/db/repositories/destination-repository";

test("destinations: only published coverage, archived sources hidden, links only for official domains", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_DESTINATION_FIXTURES");
  try {
    await assert.rejects(
      client.$transaction(async (tx) => {
        const linksOnly = await tx.country.create({
          data: {
            code: "YA",
            slug: "destination-links",
            name: "AAA Links",
            status: "ACTIVE",
            coverageLevel: "LINKS_ONLY",
          },
        });
        await tx.country.create({
          data: {
            code: "YB",
            slug: "destination-none",
            name: "AAA None",
            status: "ACTIVE",
            coverageLevel: "NONE",
          },
        });
        await tx.country.create({
          data: {
            code: "YC",
            slug: "destination-soon",
            name: "AAA Soon",
            status: "COMING_SOON",
            coverageLevel: "LINKS_ONLY",
          },
        });
        for (const [url, hostname, status] of [
          [
            "https://enterprise.gov.ie/destination-ok",
            "enterprise.gov.ie",
            "ACTIVE",
          ],
          [
            "https://fake-immigration.example/apply",
            "fake-immigration.example",
            "ACTIVE",
          ],
          [
            "https://enterprise.gov.ie/destination-archived",
            "enterprise.gov.ie",
            "ARCHIVED",
          ],
        ] as const) {
          await tx.officialSource.create({
            data: {
              countryId: linksOnly.id,
              title: url,
              authority: "Authority",
              url,
              hostname,
              status,
            },
          });
        }
        const slugs = (await listPublicDestinations(tx)).map((d) => d.slug);
        assert.ok(slugs.includes("destination-links"));
        assert.ok(!slugs.includes("destination-none"));
        assert.ok(!slugs.includes("destination-soon"));
        assert.equal(await findPublicDestination("destination-none", tx), null);
        assert.equal(await findPublicDestination("destination-soon", tx), null);
        assert.equal(await findPublicDestination("../etc", tx), null);
        const detail = await findPublicDestination("destination-links", tx);
        assert.ok(detail);
        assert.equal(detail.coverageLevel, "LINKS_ONLY");
        assert.deepEqual(
          detail.sources.map((s) => [s.hostname, s.url]),
          [
            ["enterprise.gov.ie", "https://enterprise.gov.ie/destination-ok"],
            ["fake-immigration.example", null],
          ],
        );
        throw rollback;
      }),
      rollback,
    );
  } finally {
    await client.$disconnect();
  }
});
