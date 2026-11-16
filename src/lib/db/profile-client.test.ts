import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { createDatabaseClient } = vi.hoisted(() => ({
  createDatabaseClient: vi.fn(() => ({ kind: "profile-client" })),
}));
vi.mock("./create-client", () => ({ createDatabaseClient }));

describe("profile database connection", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "production");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("fails closed when the dedicated URL is absent despite other database credentials", async () => {
    vi.stubEnv("PROFILE_DATABASE_URL", "");
    vi.stubEnv(
      "DATABASE_URL",
      "postgres://reader:secret@localhost/app?schema=catalog",
    );
    vi.stubEnv(
      "DIRECT_URL",
      "postgres://owner:secret@localhost/app?schema=catalog",
    );
    const { getProfileDatabaseClient } = await import("./profile-client");
    expect(() => getProfileDatabaseClient()).toThrow(
      /^DATABASE_CONFIG_INVALID: PROFILE_DATABASE_URL$/,
    );
    expect(createDatabaseClient).not.toHaveBeenCalled();
  });

  it("creates and reuses a client from the dedicated validated URL", async () => {
    const url = "postgres://profile:secret@localhost/app?schema=catalog";
    vi.stubEnv("PROFILE_DATABASE_URL", url);
    const { getProfileDatabaseClient } = await import("./profile-client");
    expect(getProfileDatabaseClient()).toBe(getProfileDatabaseClient());
    expect(createDatabaseClient).toHaveBeenCalledExactlyOnceWith(url);
  });
});
