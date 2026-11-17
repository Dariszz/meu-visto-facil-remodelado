import { beforeEach, expect, test, vi } from "vitest";
import { irelandQuestions } from "@/features/questionnaire/data/ireland-questions";
import { normalizeProfile } from "@/features/questionnaire/immigration-profile";
import { getRecommendations } from "./get-recommendations";

vi.mock("server-only", () => ({}));
const { getQuestionnaire } = vi.hoisted(() => ({ getQuestionnaire: vi.fn() }));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaire,
}));
beforeEach(() => vi.clearAllMocks());

const answers = {
  objective: "work",
  region: "other",
  has_employment_offer: true,
  offer_duration: "2y_plus",
  occupation_area: "technology",
};

test("sem perfil ou questionário incompleto não gera recomendação", async () => {
  getQuestionnaire.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  expect(await getRecommendations()).toEqual({ kind: "PROFILE_REQUIRED" });
  getQuestionnaire.mockResolvedValueOnce({ kind: "READY", complete: false });
  expect(await getRecommendations()).toEqual({
    kind: "QUESTIONNAIRE_REQUIRED",
  });
  getQuestionnaire.mockResolvedValueOnce({ kind: "UNAVAILABLE_FOR_COUNTRY" });
  expect(await getRecommendations()).toEqual({
    kind: "QUESTIONNAIRE_REQUIRED",
  });
});

test("questionário completo gera caminhos e o resumo das respostas", async () => {
  getQuestionnaire.mockResolvedValue({
    kind: "READY",
    complete: true,
    questions: irelandQuestions,
    answers,
    profile: normalizeProfile(answers),
  });
  const result = await getRecommendations();
  if (result.kind !== "READY") throw new Error("expected READY");
  expect(
    result.recommendations.map((r) => [r.visaSlug, r.compatibility]),
  ).toEqual([
    ["critical-skills-employment-permit", "HIGH"],
    ["general-employment-permit", "MEDIUM"],
  ]);
  expect(result.recommendations.every((r) => r.startProcessHref === null)).toBe(
    true,
  );
  expect(result.profileFacts).toContainEqual({
    label: "Área",
    value: "Tecnologia",
  });
  expect(result.pendingCategories).toEqual(["Estudo", "Família"]);
});
