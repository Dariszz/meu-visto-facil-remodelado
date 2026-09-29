import { expect, test, vi } from "vitest";
import type { VerificationSource } from "@/lib/db/repositories/source-verification-repository";
import type { SourceVerificationResult } from "./validate-official-source-url";
import { verifyOfficialSource } from "./verify-official-source";

vi.mock("server-only", () => ({}));

const source: VerificationSource = {
  id: "source-test",
  url: "https://enterprise.gov.ie/test",
  hostname: "enterprise.gov.ie",
  status: "ACTIVE",
  updatedAt: new Date("2026-09-01T00:00:00Z"),
  lastVerifiedAt: null,
};
const result: SourceVerificationResult = {
  status: "ACTIVE",
  reason: "HTTP_OK",
  httpStatus: 200,
  resolvedUrl: source.url,
  checkedAt: new Date("2026-09-29T10:00:00Z"),
  durationMs: 50,
};
function dependencies() {
  return {
    findSource: vi.fn().mockResolvedValue(source),
    save: vi.fn().mockResolvedValue(true),
    validate: vi.fn().mockResolvedValue(result),
  };
}

test.each([
  undefined,
  null,
  1,
  "",
  "https://enterprise.gov.ie/",
  "../source",
  "x".repeat(129),
])("rejects invalid ID %s before lookup or network", async (id) => {
  const deps = dependencies();
  await expect(verifyOfficialSource(id, deps)).rejects.toThrow(
    "SOURCE_ID_INVALID",
  );
  expect(deps.findSource).not.toHaveBeenCalled();
  expect(deps.validate).not.toHaveBeenCalled();
  expect(deps.save).not.toHaveBeenCalled();
});
test.each([null, { ...source, status: "ARCHIVED" }])(
  "missing or archived source never reaches network",
  async (record) => {
    const deps = dependencies();
    deps.findSource.mockResolvedValue(record);
    await expect(verifyOfficialSource(source.id, deps)).rejects.toThrow(
      "SOURCE_NOT_FOUND",
    );
    expect(deps.validate).not.toHaveBeenCalled();
    expect(deps.save).not.toHaveBeenCalled();
  },
);
test("verifies persisted URL and saves against the loaded snapshot", async () => {
  const deps = dependencies();
  expect(await verifyOfficialSource(source.id, deps)).toEqual(result);
  expect(deps.validate).toHaveBeenCalledWith({
    url: source.url,
    hostname: source.hostname,
  });
  expect(deps.save).toHaveBeenCalledWith(source, result);
});
test("reports a discarded stale result as conflict", async () => {
  const deps = dependencies();
  deps.save.mockResolvedValue(false);
  await expect(verifyOfficialSource(source.id, deps)).rejects.toThrow(
    "SOURCE_VERIFICATION_CONFLICT",
  );
});
