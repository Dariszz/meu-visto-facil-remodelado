import { expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { isAccountDeletionConfigured } = await import("./admin");

test("exclusão só fica disponível com chave secreta no formato novo", () => {
  expect(isAccountDeletionConfigured({})).toBe(false);
  expect(isAccountDeletionConfigured({ SUPABASE_SECRET_KEY: "eyJhbGci" })).toBe(
    false,
  );
  expect(
    isAccountDeletionConfigured({ SUPABASE_SECRET_KEY: "sb_publishable_abc" }),
  ).toBe(false);
  expect(
    isAccountDeletionConfigured({ SUPABASE_SECRET_KEY: "sb_secret_abc_123" }),
  ).toBe(true);
});
