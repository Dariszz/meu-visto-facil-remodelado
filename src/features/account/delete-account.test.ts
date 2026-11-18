import { beforeEach, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  isAccountDeletionConfigured: vi.fn(),
  deleteAuthUser: vi.fn(),
  signOut: vi.fn(),
  deleteUserProfileByAuthUserId: vi.fn(),
}));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/auth/admin", () => ({
  isAccountDeletionConfigured: mocks.isAccountDeletionConfigured,
  deleteAuthUser: mocks.deleteAuthUser,
}));
vi.mock("@/lib/auth/operations", () => ({ signOut: mocks.signOut }));
vi.mock("@/lib/db/repositories/user-profile-repository", () => ({
  deleteUserProfileByAuthUserId: mocks.deleteUserProfileByAuthUserId,
}));

const { deleteMyAccount } = await import("./delete-account");
const calls: string[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  calls.length = 0;
  mocks.requireUser.mockResolvedValue({ id: "auth-1" });
  mocks.isAccountDeletionConfigured.mockReturnValue(true);
  mocks.deleteUserProfileByAuthUserId.mockImplementation(async () => {
    calls.push("profile");
    return 1;
  });
  mocks.signOut.mockImplementation(async () => {
    calls.push("signOut");
    return {};
  });
  mocks.deleteAuthUser.mockImplementation(async () => {
    calls.push("auth");
    return { error: false };
  });
});

test("apaga dados, encerra a sessão e por último remove o acesso", async () => {
  await expect(deleteMyAccount()).resolves.toBe("DELETED");
  expect(calls).toEqual(["profile", "signOut", "auth"]);
  expect(mocks.deleteUserProfileByAuthUserId).toHaveBeenCalledWith("auth-1");
  expect(mocks.deleteAuthUser).toHaveBeenCalledWith("auth-1");
});

test("sem a chave configurada, não apaga nada", async () => {
  mocks.isAccountDeletionConfigured.mockReturnValue(false);
  await expect(deleteMyAccount()).resolves.toBe("UNAVAILABLE");
  expect(calls).toEqual([]);
});

test("falha ao apagar dados não remove o acesso", async () => {
  mocks.deleteUserProfileByAuthUserId.mockRejectedValue(new Error("db"));
  await expect(deleteMyAccount()).resolves.toBe("UNAVAILABLE");
  expect(mocks.deleteAuthUser).not.toHaveBeenCalled();
});

test("falha só no acesso informa que os dados já foram apagados", async () => {
  mocks.deleteAuthUser.mockResolvedValue({ error: true });
  await expect(deleteMyAccount()).resolves.toBe("DATA_DELETED_ACCESS_REMAINS");
});

test("sem sessão, a exclusão nem começa", async () => {
  mocks.requireUser.mockRejectedValue(
    Object.assign(new Error("AUTH_REQUIRED"), { code: "AUTH_REQUIRED" }),
  );
  await expect(deleteMyAccount()).rejects.toThrow("AUTH_REQUIRED");
  expect(calls).toEqual([]);
});
