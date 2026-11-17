// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import DashboardPage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
const { getDashboard, redirect } = vi.hoisted(() => ({
  getDashboard: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/dashboard/application/get-dashboard", () => ({
  getDashboard,
}));
vi.mock("next/navigation", () => ({ redirect }));
beforeEach(() => vi.clearAllMocks());

test("sem sessão, volta para o login", async () => {
  getDashboard.mockRejectedValue(new AuthenticationError());
  await expect(DashboardPage()).rejects.toThrow("REDIRECT:/login");
});

test("sem perfil, leva à criação do perfil", async () => {
  getDashboard.mockResolvedValue({ kind: "PROFILE_REQUIRED" });
  await expect(DashboardPage()).rejects.toThrow("REDIRECT:/profile");
});

test("painel real sem processos orienta a explorar, sem atalhos inexistentes", async () => {
  getDashboard.mockResolvedValue({
    kind: "READY",
    view: {
      displayName: "Marina",
      processes: [],
      hasCompletedQuestionnaire: false,
    },
  });
  render(await DashboardPage());
  expect(
    screen.getByRole("heading", { level: 1, name: "Olá, Marina" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Nenhum processo salvo" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Explorar Irlanda" }),
  ).toHaveAttribute("href", "/ireland");
  expect(
    screen.queryByRole("link", { name: /questionário/i }),
  ).not.toBeInTheDocument();
});

test("falha de banco mostra erro com nova tentativa, sem detalhes técnicos", async () => {
  getDashboard.mockRejectedValue(new Error("PROFILE_UNAVAILABLE"));
  render(await DashboardPage());
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar seu painel",
  );
  expect(screen.queryByText(/PROFILE_UNAVAILABLE/)).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Tentar novamente" }),
  ).toHaveAttribute("href", "/dashboard");
});
