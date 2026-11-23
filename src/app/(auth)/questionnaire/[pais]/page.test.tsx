// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import { irelandQuestions } from "@/features/questionnaire/data/ireland-questions";
import Page from "./page";

const QuestionnairePage = (pais = "ireland") =>
  Page({ params: Promise.resolve({ pais }) });

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/features/questionnaire/actions", () => ({
  saveQuestionnaireAction: { bind: vi.fn() },
}));
const { getQuestionnaire, redirect, notFound } = vi.hoisted(() => ({
  getQuestionnaire: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaire,
}));
vi.mock("next/navigation", () => ({ redirect, notFound }));
beforeEach(() => vi.clearAllMocks());

test("sem sessão vai ao login e sem perfil vai criar o perfil", async () => {
  getQuestionnaire.mockRejectedValueOnce(new AuthenticationError());
  await expect(QuestionnairePage()).rejects.toThrow("REDIRECT:/login");
  getQuestionnaire.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  await expect(QuestionnairePage()).rejects.toThrow("REDIRECT:/profile");
});

test("retoma respostas salvas e avisa que pode revisar", async () => {
  getQuestionnaire.mockResolvedValue({
    kind: "READY",
    questions: irelandQuestions,
    answers: { objective: "study" },
    complete: false,
    profile: {},
  });
  render(await QuestionnairePage());
  expect(screen.getByRole("radio", { name: /Estudar/ })).toBeChecked();
  expect(screen.getByText("Pergunta 1 de 5")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 1, name: "Seus planos na Irlanda" }),
  ).toBeInTheDocument();
});

test("questionário indisponível e falha têm estados próprios", async () => {
  getQuestionnaire.mockResolvedValueOnce({ kind: "UNAVAILABLE_FOR_COUNTRY" });
  render(await QuestionnairePage());
  expect(
    screen.getByRole("heading", { name: "Questionário em preparação" }),
  ).toBeInTheDocument();
  getQuestionnaire.mockRejectedValueOnce(new Error("x"));
  render(await QuestionnairePage());
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar o questionário",
  );
});

test("destino sem questionário responde 404 sem consultar o banco", async () => {
  await expect(QuestionnairePage("marte")).rejects.toThrow("NOT_FOUND");
  expect(getQuestionnaire).not.toHaveBeenCalled();
});
