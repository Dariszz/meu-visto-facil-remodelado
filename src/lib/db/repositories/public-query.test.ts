import { expect, test, vi } from "vitest";
import { findPublicCountry } from "./country-repository";
import { findPublicVisa, listPublicVisas } from "./visa-repository";
import { listPublicVisaSources } from "./official-source-repository";
import { getDatabaseClient } from "../client";

vi.mock("server-only", () => ({}));
vi.mock("../client", () => ({
  getDatabaseClient: vi.fn(() => {
    throw new Error("postgresql://credential@internal");
  }),
}));

test("invalid external slugs are rejected without opening a connection", async () => {
  vi.mocked(getDatabaseClient).mockClear();
  for (const slug of [
    "../ireland",
    "",
    "x".repeat(101),
    "ireland?draft=true",
  ]) {
    expect(await findPublicCountry(slug)).toBeNull();
    expect(await findPublicVisa("ireland", slug)).toBeNull();
    expect(await listPublicVisas(slug, "work")).toEqual([]);
    expect(await listPublicVisaSources("ireland", slug)).toEqual([]);
  }
  expect(getDatabaseClient).not.toHaveBeenCalled();
});

test("infrastructure errors are sanitized before framework logging or presentation", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    await expect(findPublicCountry("ireland")).rejects.toThrow(
      "CATALOG_UNAVAILABLE",
    );
    expect(log).toHaveBeenCalledWith(
      JSON.stringify({
        event: "catalog_read_failed",
        code: "CATALOG_UNAVAILABLE",
      }),
    );
    expect(JSON.stringify(log.mock.calls)).not.toContain("credential");
  } finally {
    log.mockRestore();
  }
});
