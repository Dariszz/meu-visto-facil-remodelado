// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import LoginPage from "./login/page";
import ResetPasswordPage from "./reset-password/page";
import ConfirmPage from "./auth/confirm/page";

const { currentUser, redirect } = vi.hoisted(() => ({
  currentUser: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: currentUser }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/features/auth/auth-form", () => ({
  AuthForm: ({ mode }: { mode: string }) => (
    <div data-testid="auth-mode">{mode}</div>
  ),
}));
beforeEach(() => {
  vi.clearAllMocks();
});

test("login com sessão verificada apresenta a identidade e logout", async () => {
  currentUser.mockResolvedValue({ id: "user-id", email: "pessoa@example.com" });
  render(await LoginPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByText("pessoa@example.com")).toBeInTheDocument();
  expect(screen.getByTestId("auth-mode")).toHaveTextContent("logout");
});
test("login sem sessão apresenta formulário", async () => {
  currentUser.mockResolvedValue(null);
  render(await LoginPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByTestId("auth-mode")).toHaveTextContent("login");
});
test("nova senha requer sessão validada no servidor", async () => {
  currentUser.mockResolvedValue(null);
  await expect(ResetPasswordPage()).rejects.toThrow("REDIRECT:/login");
  currentUser.mockResolvedValue({ id: "user-id" });
  render(await ResetPasswordPage());
  expect(screen.getByTestId("auth-mode")).toHaveTextContent("reset-password");
});
test.each([
  { type: "recovery" },
  { token_hash: "test", type: "invite" },
  { token_hash: ["a", "b"], type: "signup" },
])("confirmação rejeita query inválida %#", async (query) => {
  render(await ConfirmPage({ searchParams: Promise.resolve(query) }));
  expect(
    screen.getByRole("heading", { name: "Link inválido" }),
  ).toBeInTheDocument();
  expect(screen.queryByTestId("auth-mode")).not.toBeInTheDocument();
});
test("confirmação válida apenas apresenta a ação", async () => {
  render(
    await ConfirmPage({
      searchParams: Promise.resolve({ token_hash: "test", type: "signup" }),
    }),
  );
  expect(screen.getByTestId("auth-mode")).toHaveTextContent("confirm");
  expect(currentUser).not.toHaveBeenCalled();
});
