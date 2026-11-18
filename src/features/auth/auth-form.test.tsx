// @vitest-environment jsdom
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import type { AuthActionState } from "./types";
import { AuthForm } from "./auth-form";

const actions = vi.hoisted(() => ({
  loginAction: vi.fn(),
  registerAction: vi.fn(),
  forgotPasswordAction: vi.fn(),
  resetPasswordAction: vi.fn(),
  logoutAction: vi.fn(),
  confirmEmailAction: vi.fn(),
}));
vi.mock("./actions", () => actions);
beforeEach(() => {
  vi.resetAllMocks();
});

test("cadastro apresenta campos rotulados e instruções de senha", () => {
  render(<AuthForm mode="register" />);
  expect(screen.getByLabelText("E-mail")).toHaveAttribute(
    "autocomplete",
    "email",
  );
  expect(screen.getByLabelText("Senha")).toHaveAccessibleDescription(
    "Use pelo menos 8 caracteres.",
  );
  expect(screen.getByLabelText("Confirmar senha")).toHaveAttribute(
    "autocomplete",
    "new-password",
  );
});

test("login envia credenciais e associa erro ao campo", async () => {
  actions.loginAction.mockResolvedValue({
    status: "error",
    message: "Confira os campos.",
    fieldErrors: { email: "Informe um e-mail válido." },
  });
  render(<AuthForm mode="login" />);
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: "pessoa@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Senha"), {
    target: { value: "senha-de-teste" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: "Entrar" }).closest("form")!,
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Confira os campos.",
  );
  expect(screen.getByLabelText("E-mail")).toBeInvalid();
  expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription(
    "Informe um e-mail válido.",
  );
  const submitted = actions.loginAction.mock.calls[0][1] as FormData;
  expect(submitted.get("email")).toBe("pessoa@example.com");
  expect(submitted.get("password")).toBe("senha-de-teste");
});

test("recuperação desabilita campos durante envio e anuncia sucesso", async () => {
  let resolve!: (state: AuthActionState) => void;
  actions.forgotPasswordAction.mockReturnValue(
    new Promise<AuthActionState>((done) => {
      resolve = done;
    }),
  );
  render(<AuthForm mode="forgot-password" />);
  fireEvent.submit(screen.getByRole("button").closest("form")!);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Aguarde…" })).toBeDisabled(),
  );
  expect(screen.getByLabelText("E-mail")).toBeDisabled();
  await act(async () =>
    resolve({ status: "success", message: "Confira seu e-mail." }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("Confira seu e-mail.");
  expect(screen.getByRole("button")).toBeEnabled();
});

test("confirmação só envia o token depois da ação explícita", async () => {
  actions.confirmEmailAction.mockResolvedValue({
    status: "error",
    message: "Link expirado.",
  });
  render(
    <AuthForm
      mode="confirm"
      confirmation={{ token_hash: "test-token", type: "recovery" }}
    />,
  );
  expect(actions.confirmEmailAction).not.toHaveBeenCalled();
  expect(screen.queryByText("test-token")).not.toBeInTheDocument();
  fireEvent.submit(
    screen.getByRole("button", { name: "Continuar" }).closest("form")!,
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("Link expirado.");
  const submitted = actions.confirmEmailAction.mock.calls[0][1] as FormData;
  expect(submitted.get("token_hash")).toBe("test-token");
  expect(submitted.get("type")).toBe("recovery");
});

test("logout é uma submissão explícita sem credenciais no formulário", () => {
  render(<AuthForm mode="logout" />);
  expect(screen.getByRole("button", { name: "Sair da conta" })).toHaveAttribute(
    "type",
    "submit",
  );
  expect(screen.queryByLabelText("Senha")).not.toBeInTheDocument();
  expect(actions.logoutAction).not.toHaveBeenCalled();
});

test("cadastro mostra concordância com termos e privacidade", () => {
  render(<AuthForm mode="register" />);
  expect(screen.getByRole("link", { name: "Termos de uso" })).toHaveAttribute(
    "href",
    "/termos",
  );
  expect(
    screen.getByRole("link", { name: "Política de privacidade" }),
  ).toHaveAttribute("href", "/privacidade");
});
