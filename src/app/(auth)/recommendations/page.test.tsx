// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import { exampleRecommendations } from "@/features/previews/fixtures";
import RecommendationsPage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
const { getRecommendations, redirect } = vi.hoisted(() => ({
  getRecommendations: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/recommendations/application/get-recommendations", () => ({
  getRecommendations,
}));
vi.mock("next/navigation", () => ({ redirect }));
beforeEach(() => vi.clearAllMocks());

test("redireciona conforme o que falta", async () => {
  getRecommendations.mockRejectedValueOnce(new AuthenticationError());
  await expect(RecommendationsPage()).rejects.toThrow("REDIRECT:/login");
  getRecommendations.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  await expect(RecommendationsPage()).rejects.toThrow("REDIRECT:/profile");
  getRecommendations.mockResolvedValueOnce({ kind: "QUESTIONNAIRE_REQUIRED" });
  await expect(RecommendationsPage()).rejects.toThrow(
    "REDIRECT:/questionnaire",
  );
});

test("mostra os caminhos com links reais do painel e do questionário", async () => {
  getRecommendations.mockResolvedValue({
    kind: "READY",
    recommendations: exampleRecommendations,
    profileFacts: [{ label: "Objetivo", value: "Trabalhar" }],
    pendingCategories: ["Estudo", "Família"],
  });
  render(await RecommendationsPage());
  expect(screen.getByRole("link", { name: "Painel" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
  expect(
    screen.getByRole("link", { name: "Revisar respostas" }),
  ).toHaveAttribute("href", "/questionnaire");
});

test("falha mostra erro sem detalhes", async () => {
  getRecommendations.mockRejectedValue(new Error("db"));
  render(await RecommendationsPage());
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar as recomendações",
  );
});
