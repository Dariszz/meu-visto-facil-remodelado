import { describe, expect, it } from "vitest";
import { readDatabaseUrl, readTestDatabaseUrl } from "./environment";

describe("database environment", () => {
  const remote =
    "postgresql://user:secret@example.test/meu_visto_facil_test?sslmode=verify-full&schema=catalog";
  it("accepts verified remote TLS and local PostgreSQL", () => {
    expect(readDatabaseUrl(remote, "DATABASE_URL")).toBe(remote);
    expect(
      readDatabaseUrl(
        "postgres://user:secret@localhost/dev?schema=catalog",
        "DIRECT_URL",
      ),
    ).toContain("localhost");
  });
  it("accepts an explicit CA without relaxing TLS verification", () => {
    const url = `${remote}&sslrootcert=C%3A%2Fcerts%2Fsupabase-ca.crt`;
    expect(readDatabaseUrl(url, "DIRECT_URL")).toBe(url);
    expect(() =>
      readDatabaseUrl(`${remote}&sslrootcert=`, "DIRECT_URL"),
    ).toThrow("DATABASE_CONFIG_INVALID");
    expect(() =>
      readDatabaseUrl(url.replace("verify-full", "require"), "DIRECT_URL"),
    ).toThrow("DATABASE_CONFIG_INVALID");
  });
  it.each([
    undefined,
    "",
    "not-a-url",
    "https://user:secret@example.test/db",
    remote.replace("verify-full", "disable"),
    remote.replace("verify-full", "require"),
    `${remote}&sslcert=secret`,
    `${remote}&sslmode=disable`,
    remote.replace("&schema=catalog", ""),
    "postgres://user:secret@example.test/db",
  ])("rejects invalid configuration without leaking values (%#)", (value) => {
    expect(() => readDatabaseUrl(value, "DATABASE_URL")).toThrow(
      /^DATABASE_CONFIG_INVALID: DATABASE_URL$/,
    );
  });
  it("requires explicit isolated test target", () => {
    expect(() => readTestDatabaseUrl({ TEST_DATABASE_URL: remote })).toThrow(
      "DATABASE_TEST_TARGET_REJECTED",
    );
    expect(() =>
      readTestDatabaseUrl({
        TEST_DATABASE_URL: remote.replace("meu_visto_facil_test", "production"),
        DB_TEST_CONFIRM: "meu_visto_facil_test",
      }),
    ).toThrow("DATABASE_TEST_TARGET_REJECTED");
    expect(() =>
      readTestDatabaseUrl({
        TEST_DATABASE_URL:
          "postgres://user:secret@localhost/meu_visto_facil_test?schema=catalog",
        DB_TEST_CONFIRM: "meu_visto_facil_test",
        NODE_ENV: "production",
      }),
    ).toThrow("DATABASE_TEST_TARGET_REJECTED");
    expect(
      readTestDatabaseUrl({
        TEST_DATABASE_URL:
          "postgres://user:secret@localhost/meu_visto_facil_test?schema=catalog",
        DB_TEST_CONFIRM: "meu_visto_facil_test",
      }),
    ).toContain("localhost");
  });
  const project = "abcdefghijklmnopqrst";
  const direct = `postgresql://postgres:secret@db.${project}.supabase.co:5432/postgres?sslmode=verify-full&schema=catalog`;
  const session = `postgresql://postgres.${project}:secret@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=verify-full&schema=catalog`;
  it.each([direct, session])(
    "accepts an explicitly confirmed Supabase test project",
    (url) => {
      expect(
        readTestDatabaseUrl({
          TEST_DATABASE_URL: url,
          DB_TEST_CONFIRM: `supabase:${project}`,
        }),
      ).toBe(url);
    },
  );
  it.each([
    [direct, undefined],
    [direct, "supabase:wrong-project"],
    [session.replace(":5432/", ":6543/"), `supabase:${project}`],
    [
      direct.replace("supabase.co", "supabase.co.attacker.test"),
      `supabase:${project}`,
    ],
    [session.replace(project, "zyxwvutsrqponmlkjihg"), `supabase:${project}`],
    [remote, "meu_visto_facil_test"],
  ])(
    "rejects unconfirmed or mismatched remote targets (%#)",
    (url, confirmation) => {
      expect(() =>
        readTestDatabaseUrl({
          TEST_DATABASE_URL: url,
          DB_TEST_CONFIRM: confirmation,
        }),
      ).toThrow("DATABASE_TEST_TARGET_REJECTED");
    },
  );
  it("rejects the confirmed Supabase target in production", () => {
    expect(() =>
      readTestDatabaseUrl({
        TEST_DATABASE_URL: direct,
        DB_TEST_CONFIRM: `supabase:${project}`,
        NODE_ENV: "production",
      }),
    ).toThrow("DATABASE_TEST_TARGET_REJECTED");
  });
});
