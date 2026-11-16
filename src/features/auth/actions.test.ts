import { beforeEach, expect, test, vi } from "vitest";
import {
  loginAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordAction,
  logoutAction,
  confirmEmailAction,
} from "./actions";
import * as operations from "@/lib/auth/operations";

vi.mock("@/lib/auth/operations", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  requestPasswordReset: vi.fn(),
  updatePassword: vi.fn(),
  signOut: vi.fn(),
  confirmEmail: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const initial = { status: "idle" as const };
function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}
const valid = {
  email: "person@example.com",
  password: "test-password",
  confirmPassword: "test-password",
};
beforeEach(() => {
  vi.resetAllMocks();
  Object.values(operations).forEach((op) =>
    vi.mocked(op).mockResolvedValue({ error: false }),
  );
});

test("rejeita dados inválidos antes de consultar o provider", async () => {
  expect(
    (await loginAction(initial, form({ email: "bad", password: "" }))).status,
  ).toBe("error");
  expect(operations.signIn).not.toHaveBeenCalled();
  expect(
    (
      await registerAction(
        initial,
        form({ ...valid, confirmPassword: "different" }),
      )
    ).fieldErrors?.confirmPassword,
  ).toBeTruthy();
  expect(operations.signUp).not.toHaveBeenCalled();
});
test("login usa credenciais validadas e ignora redirect externo", async () => {
  await expect(
    loginAction(initial, form({ ...valid, next: "https://evil.example" })),
  ).rejects.toThrow("REDIRECT:/login");
  expect(operations.signIn).toHaveBeenCalledWith(valid.email, valid.password);
});
test("não expõe erro do provider nem senha", async () => {
  vi.mocked(operations.signIn).mockRejectedValue(new Error("private-token"));
  const result = await loginAction(initial, form(valid));
  expect(result.status).toBe("error");
  expect(JSON.stringify(result)).not.toMatch(/private-token|test-password/);
});
test("cadastro e recuperação retornam mensagens neutras", async () => {
  expect((await registerAction(initial, form(valid))).message).toMatch(
    /Se o cadastro/,
  );
  expect((await forgotPasswordAction(initial, form(valid))).message).toMatch(
    /Se houver uma conta/,
  );
});
test("falha de configuração ou transporte não finge envio de e-mail", async () => {
  vi.mocked(operations.signUp).mockResolvedValue({ error: true });
  vi.mocked(operations.requestPasswordReset).mockResolvedValue({ error: true });
  expect((await registerAction(initial, form(valid))).status).toBe("error");
  expect((await forgotPasswordAction(initial, form(valid))).status).toBe(
    "error",
  );
});
test("nova senha valida confirmação e propaga falha de autenticação", async () => {
  await resetPasswordAction(
    initial,
    form({ ...valid, confirmPassword: "different" }),
  );
  expect(operations.updatePassword).not.toHaveBeenCalled();
  vi.mocked(operations.updatePassword).mockResolvedValue({ error: true });
  expect((await resetPasswordAction(initial, form(valid))).status).toBe(
    "error",
  );
});
test("logout só redireciona após sucesso", async () => {
  vi.mocked(operations.signOut).mockResolvedValueOnce({ error: true });
  expect((await logoutAction(initial, form({}))).status).toBe("error");
  await expect(logoutAction(initial, form({}))).rejects.toThrow(
    "REDIRECT:/login",
  );
});
test("confirmação rejeita tipo desconhecido antes do provider", async () => {
  expect(
    (
      await confirmEmailAction(
        initial,
        form({ token_hash: "token", type: "magiclink" }),
      )
    ).status,
  ).toBe("error");
  expect(operations.confirmEmail).not.toHaveBeenCalled();
});
test.each([
  ["signup", "/login"],
  ["recovery", "/reset-password"],
])("confirma %s para destino fixo", async (type, destination) => {
  await expect(
    confirmEmailAction(
      initial,
      form({ token_hash: "token", type, next: "//evil.example" }),
    ),
  ).rejects.toThrow(`REDIRECT:${destination}`);
});
test("token expirado não redireciona", async () => {
  vi.mocked(operations.confirmEmail).mockResolvedValue({ error: true });
  expect(
    (
      await confirmEmailAction(
        initial,
        form({ token_hash: "token", type: "recovery" }),
      )
    ).message,
  ).toMatch(/expirou/);
});
