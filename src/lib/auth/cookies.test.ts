import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
vi.mock("server-only", () => ({}));
type Options = {
  cookies: {
    getAll: () => unknown;
    setAll: (
      values: { name: string; value: string; options: CookieOptions }[],
    ) => void;
  };
};
const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  getUser: vi.fn(),
  set: vi.fn(),
}));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.create }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [], set: mocks.set }),
}));
import { createAuthClient } from "./server-client";
import { proxy } from "../../proxy";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  vi.stubEnv("APP_ORIGIN", "https://example.test");
  mocks.create.mockReturnValue({ auth: { getUser: mocks.getUser } });
});
afterEach(() => vi.unstubAllEnvs());
const refreshed = [
  {
    name: "sb-session",
    value: "refreshed",
    options: { httpOnly: false, secure: false },
  },
];
describe("auth cookies", () => {
  it("persists hardened cookies for mutations", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await createAuthClient();
    const options = mocks.create.mock.calls[0][2] as Options;
    options.cookies.setAll(refreshed);
    expect(mocks.set).toHaveBeenCalledWith(
      "sb-session",
      "refreshed",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      }),
    );
  });
  it("does not try to mutate cookies from a Server Component", async () => {
    await createAuthClient({ readOnly: true });
    (mocks.create.mock.calls[0][2] as Options).cookies.setAll(refreshed);
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it("refreshes request and response cookies and prevents caching", async () => {
    mocks.getUser.mockImplementation(async () => {
      (mocks.create.mock.calls[0][2] as Options).cookies.setAll(refreshed);
      return { data: { user: null }, error: null };
    });
    const request = new NextRequest("https://example.test/login");
    const response = await proxy(request);
    expect(request.cookies.get("sb-session")?.value).toBe("refreshed");
    expect(response.cookies.get("sb-session")).toMatchObject({
      value: "refreshed",
      httpOnly: true,
      sameSite: "lax",
    });
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(mocks.getUser).toHaveBeenCalledOnce();
  });
  it("allows rendering without configuration or with unavailable auth", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    expect(
      (await proxy(new NextRequest("https://example.test/login"))).status,
    ).toBe(200);
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
