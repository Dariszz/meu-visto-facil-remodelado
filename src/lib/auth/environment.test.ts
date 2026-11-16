import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { authCookieOptions, readAuthEnvironment } from "./environment";

const valid = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
  APP_ORIGIN: "https://example.test",
};
afterEach(() => vi.unstubAllEnvs());
describe("auth configuration", () => {
  it("accepts a publishable key and trusted origins", () =>
    expect(readAuthEnvironment(valid)).toEqual(valid));
  it.each([undefined, "", "sb_secret_admin", "eyJhbGciOiJIUzI1NiJ9"])(
    "rejects privileged or unsupported keys (%#)",
    (key) => {
      expect(() =>
        readAuthEnvironment({ ...valid, SUPABASE_PUBLISHABLE_KEY: key }),
      ).toThrow(/^AUTH_CONFIG_INVALID$/);
    },
  );
  it.each([
    "http://example.test",
    "https://user:password@example.test",
    "https://example.test/path",
    "https://example.test?next=bad",
    "https://example.test#bad",
  ])("rejects unsafe origin %s", (APP_ORIGIN) => {
    expect(() => readAuthEnvironment({ ...valid, APP_ORIGIN })).toThrow(
      "AUTH_CONFIG_INVALID",
    );
  });
  it("permits local HTTP only outside production", () => {
    const local = { ...valid, APP_ORIGIN: "http://localhost:3000" };
    expect(readAuthEnvironment(local)).toEqual(local);
    vi.stubEnv("NODE_ENV", "production");
    expect(() => readAuthEnvironment(local)).toThrow("AUTH_CONFIG_INVALID");
    expect(authCookieOptions()).toMatchObject({
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  });
});
