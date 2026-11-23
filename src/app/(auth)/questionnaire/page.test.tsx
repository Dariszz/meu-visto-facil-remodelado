// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import QuestionnaireOverviewPage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
const { getQuestionnaireOverview, redirect } = vi.hoisted(() => ({
  getQuestionnaireOverview: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaireOverview,
}));
vi.mock("next/navigation", () => ({ redirect }));
beforeEach(() => vi.clearAllMocks());

test("lista os destinos com a situação e a próxima ação de cada um", async () => {
  getQuestionnaireOverview.mockResolvedValue({
    kind: "READY",
    destinations: [
      { slug: "ireland", name: "Irlanda", status: "COMPLETE" },
      { slug: "portugal", name: "Portugal", status: "STARTED" },
      { slug: "canada", name: "Canadá", status: "NOT_STARTED" },
    ],
  });
  render(await QuestionnaireOverviewPage());
  expect(
    screen.getByRole("link", { name: "Ver recomendações para Irlanda" }),
  ).toHaveAttribute("href", "/recommendations/ireland");
  expect(
    screen.getByRole("link", { name: "Continuar sobre Portugal" }),
  ).toHaveAttribute("href", "/questionnaire/portugal");
  expect(
    screen.getByRole("link", { name: "Responder sobre Canadá" }),
  ).toHaveAttribute("href", "/questionnaire/canada");
  expect(screen.getByText("Respondido")).toBeInTheDocument();
});

test("sem sessão vai ao login; sem perfil cria o perfil; falha avisa", async () => {
  getQuestionnaireOverview.mockRejectedValueOnce(new AuthenticationError());
  await expect(QuestionnaireOverviewPage()).rejects.toThrow("REDIRECT:/login");
  getQuestionnaireOverview.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  await expect(QuestionnaireOverviewPage()).rejects.toThrow(
    "REDIRECT:/profile",
  );
  getQuestionnaireOverview.mockRejectedValueOnce(new Error("db"));
  render(await QuestionnaireOverviewPage());
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar os destinos",
  );
});
