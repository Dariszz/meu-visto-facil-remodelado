import { expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const { hasSessionCookie } = await import("./session-hint");

test("reconhece o cookie de sessão do Supabase, inteiro ou dividido", () => {
  expect(hasSessionCookie(["sb-ewjcgtwpipbyxnoqrtyc-auth-token"])).toBe(true);
  expect(hasSessionCookie(["outro", "sb-abc123-auth-token.0"])).toBe(true);
});

test("ignora cookies parecidos ou de verificação de código", () => {
  expect(hasSessionCookie([])).toBe(false);
  expect(hasSessionCookie(["sb-abc-auth-token-code-verifier"])).toBe(false);
  expect(hasSessionCookie(["auth-token", "theme"])).toBe(false);
});
