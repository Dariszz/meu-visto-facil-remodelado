import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import {
  createUserProfileIfAbsent,
  findUserProfileByAuthUserId,
} from "../../src/lib/db/repositories/user-profile-repository";

test("profiles preserve existing data, isolate lookups and expose only the profile DTO", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_PROFILE_FIXTURES");
  const authUserId = "00000000-0000-4000-8000-000000000011";
  const otherAuthUserId = "00000000-0000-4000-8000-000000000012";
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          assert.equal(await findUserProfileByAuthUserId(authUserId, tx), null);
          const first = await createUserProfileIfAbsent(
            {
              authUserId,
              displayName: "Pessoa de teste",
              preferredLocale: "pt-BR",
            },
            tx,
          );
          const stored = await tx.userProfile.findUniqueOrThrow({
            where: { authUserId },
          });
          const repeated = await createUserProfileIfAbsent(
            {
              authUserId,
              displayName: "Nome substituído",
              preferredLocale: "en",
            },
            tx,
          );
          assert.deepEqual(repeated, first);
          assert.deepEqual(
            await tx.userProfile.findUniqueOrThrow({ where: { authUserId } }),
            stored,
          );
          assert.deepEqual(Object.keys(first).sort(), [
            "displayName",
            "id",
            "preferredLocale",
          ]);
          assert.equal(
            await findUserProfileByAuthUserId(otherAuthUserId, tx),
            null,
          );
          const other = await createUserProfileIfAbsent(
            {
              authUserId: otherAuthUserId,
              displayName: null,
              preferredLocale: "pt-BR",
            },
            tx,
          );
          assert.notEqual(other.id, first.id);
          assert.equal(other.displayName, null);
          assert.deepEqual(
            await findUserProfileByAuthUserId(authUserId, tx),
            first,
          );
          assert.deepEqual(
            await findUserProfileByAuthUserId(otherAuthUserId, tx),
            other,
          );
          assert.equal(
            await tx.userProfile.count({ where: { authUserId } }),
            1,
          );
          throw rollback;
        },
        { timeout: 30_000 },
      ),
      (error: unknown) => error === rollback,
    );
  } finally {
    await client.$disconnect();
  }
});

test("profile table has no public or Data API grants", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  try {
    const exposed = await client.$queryRaw<{ grantee: string }[]>`
      SELECT CASE WHEN acl.grantee = 0 THEN 'PUBLIC' ELSE roles.rolname END AS grantee
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) acl
      LEFT JOIN pg_roles roles ON roles.oid = acl.grantee
      WHERE n.nspname = 'catalog' AND c.relname = 'UserProfile'
        AND (acl.grantee = 0 OR roles.rolname IN ('mvf_catalog_reader', 'anon', 'authenticated', 'service_role'))
    `;
    assert.deepEqual(exposed, []);
  } finally {
    await client.$disconnect();
  }
});
