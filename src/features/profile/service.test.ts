import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError, requireUser } from "@/lib/auth/require-user";
import {
  createUserProfileIfAbsent,
  findUserProfileByAuthUserId,
} from "@/lib/db/repositories/user-profile-repository";
import { createCurrentUserProfile, getCurrentUserProfile } from "./service";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/require-user", async (original) => ({
  ...(await original<typeof import("@/lib/auth/require-user")>()),
  requireUser: vi.fn(),
}));
vi.mock("@/lib/db/repositories/user-profile-repository", () => ({
  createUserProfileIfAbsent: vi.fn(),
  findUserProfileByAuthUserId: vi.fn(),
}));
const userA = "00000000-0000-4000-8000-000000000001";
const userB = "00000000-0000-4000-8000-000000000002";
const input = { displayName: "  Maria  ", preferredLocale: "pt-BR" };
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireUser).mockResolvedValue({ id: userA });
});

test("usuário ausente não lê nem cria perfil", async () => {
  vi.mocked(requireUser).mockRejectedValue(new AuthenticationError());
  await expect(getCurrentUserProfile()).rejects.toMatchObject({
    code: "AUTH_REQUIRED",
  });
  await expect(createCurrentUserProfile(input)).rejects.toMatchObject({
    code: "AUTH_REQUIRED",
  });
  expect(findUserProfileByAuthUserId).not.toHaveBeenCalled();
  expect(createUserProfileIfAbsent).not.toHaveBeenCalled();
});
test("lookup usa exclusivamente identidade atual e distingue ausência", async () => {
  vi.mocked(findUserProfileByAuthUserId).mockResolvedValue(null);
  expect(await getCurrentUserProfile()).toBeNull();
  expect(findUserProfileByAuthUserId).toHaveBeenLastCalledWith(userA);
  vi.mocked(requireUser).mockResolvedValue({ id: userB });
  await getCurrentUserProfile();
  expect(findUserProfileByAuthUserId).toHaveBeenLastCalledWith(userB);
});
test("cria com nome normalizado e identidade autenticada", async () => {
  await createCurrentUserProfile(input);
  expect(createUserProfileIfAbsent).toHaveBeenCalledWith({
    authUserId: userA,
    displayName: "Maria",
    preferredLocale: "pt-BR",
  });
});
test.each([
  { ...input, authUserId: userB },
  { ...input, id: userB },
  { ...input, preferredLocale: "en-US" },
  { ...input, displayName: "a".repeat(101) },
  { ...input, displayName: "a\u0000b" },
])("rejeita campos internos e entrada inválida", async (value) => {
  await expect(createCurrentUserProfile(value)).rejects.toThrow();
  expect(createUserProfileIfAbsent).not.toHaveBeenCalled();
});
test("nome vazio é opcional", async () => {
  await createCurrentUserProfile({ ...input, displayName: "   " });
  expect(createUserProfileIfAbsent).toHaveBeenCalledWith({
    authUserId: userA,
    displayName: null,
    preferredLocale: "pt-BR",
  });
});
test("falhas de infraestrutura não expõem detalhes nem identidade em logs", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(findUserProfileByAuthUserId).mockRejectedValueOnce(
    new Error("postgresql://secret:password@host"),
  );
  await expect(getCurrentUserProfile()).rejects.toMatchObject({
    code: "PROFILE_UNAVAILABLE",
    message: "PROFILE_UNAVAILABLE",
  });
  expect(log).toHaveBeenCalledWith(
    JSON.stringify({
      event: "profile_operation_failed",
      code: "PROFILE_UNAVAILABLE",
    }),
  );
  log.mockRestore();
});
