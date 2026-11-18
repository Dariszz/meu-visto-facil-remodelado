import { beforeEach, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { deleteMyAccount, redirect } = vi.hoisted(() => ({
  deleteMyAccount: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { to });
  }),
}));
vi.mock("./delete-account", () => ({ deleteMyAccount }));
vi.mock("next/navigation", () => ({ redirect }));

const { deleteAccountAction } = await import("./actions");
const form = (confirmation: string) => {
  const data = new FormData();
  data.set("confirmation", confirmation);
  return data;
};

beforeEach(() => vi.clearAllMocks());

test("sem a palavra de confirmação, não exclui", async () => {
  await expect(
    deleteAccountAction({ status: "idle" }, form("sim")),
  ).resolves.toEqual({
    status: "error",
    message: "Digite EXCLUIR para confirmar.",
  });
  expect(deleteMyAccount).not.toHaveBeenCalled();
});

test("confirmação aceita minúsculas e leva à página de conta excluída", async () => {
  deleteMyAccount.mockResolvedValue("DELETED");
  await expect(
    deleteAccountAction({ status: "idle" }, form(" excluir ")),
  ).rejects.toMatchObject({ to: "/conta-excluida" });
});

test("acesso pendente leva à página com instruções", async () => {
  deleteMyAccount.mockResolvedValue("DATA_DELETED_ACCESS_REMAINS");
  await expect(
    deleteAccountAction({ status: "idle" }, form("EXCLUIR")),
  ).rejects.toMatchObject({ to: "/conta-excluida?acesso=pendente" });
});

test("indisponível avisa que nada foi apagado", async () => {
  deleteMyAccount.mockResolvedValue("UNAVAILABLE");
  const state = await deleteAccountAction({ status: "idle" }, form("EXCLUIR"));
  expect(state.message).toMatch(/Nada foi apagado/);
});
