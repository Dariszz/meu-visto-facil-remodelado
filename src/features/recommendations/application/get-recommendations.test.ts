import { beforeEach, expect, test, vi } from "vitest";
import { irelandQuestions } from "@/features/questionnaire/data/ireland-questions";
import { normalizeProfile } from "@/features/questionnaire/immigration-profile";
import { getRecommendations } from "./get-recommendations";

vi.mock("server-only", () => ({}));
const { getQuestionnaire } = vi.hoisted(() => ({ getQuestionnaire: vi.fn() }));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaire,
}));
const { listChecklistReadyVisaSlugs, listMyOpenProcessesByVisa } = vi.hoisted(
  () => ({
    listChecklistReadyVisaSlugs: vi.fn(),
    listMyOpenProcessesByVisa: vi.fn(),
  }),
);
vi.mock("@/lib/db/repositories/checklist-catalog-repository", () => ({
  listChecklistReadyVisaSlugs,
}));
vi.mock("@/features/processes/application/process-service", () => ({
  listMyOpenProcessesByVisa,
}));
const { listRecommendationVisas } = vi.hoisted(() => ({
  listRecommendationVisas: vi.fn(),
}));
vi.mock("@/lib/db/repositories/visa-repository", () => ({
  listRecommendationVisas,
}));
beforeEach(() => {
  vi.clearAllMocks();
  listChecklistReadyVisaSlugs.mockResolvedValue([
    "critical-skills-employment-permit",
  ]);
  listMyOpenProcessesByVisa.mockResolvedValue(new Map());
  listRecommendationVisas.mockResolvedValue(
    ["critical-skills-employment-permit", "general-employment-permit"].map(
      (slug) => ({
        slug,
        name: slug,
        categoryName: "Trabalho",
        shortDescription: "Resumo",
        sources: [{ id: `s-${slug}`, title: "Fonte", authority: "DETE" }],
      }),
    ),
  );
});

const answers = {
  objective: "work",
  region: "other",
  has_employment_offer: true,
  offer_duration: "2y_plus",
  occupation_area: "technology",
};

test("sem perfil ou questionário incompleto não gera recomendação", async () => {
  getQuestionnaire.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  expect(await getRecommendations("ireland")).toEqual({
    kind: "PROFILE_REQUIRED",
  });
  getQuestionnaire.mockResolvedValueOnce({ kind: "READY", complete: false });
  expect(await getRecommendations("ireland")).toEqual({
    kind: "QUESTIONNAIRE_REQUIRED",
  });
  getQuestionnaire.mockResolvedValueOnce({ kind: "UNAVAILABLE_FOR_COUNTRY" });
  expect(await getRecommendations("ireland")).toEqual({
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
  const result = await getRecommendations("ireland");
  if (result.kind !== "READY") throw new Error("expected READY");
  expect(
    result.recommendations.map((r) => [r.visaSlug, r.compatibility]),
  ).toEqual([
    ["critical-skills-employment-permit", "HIGH"],
    ["general-employment-permit", "MEDIUM"],
  ]);
  // Só o visto com checklist revisado pode virar processo.
  expect(result.recommendations.map((r) => r.process)).toEqual([
    { kind: "START" },
    null,
  ]);
  expect(result.profileFacts).toContainEqual({
    label: "Área",
    value: "Tecnologia",
  });
  // Dados de apresentação vêm do catálogo revisado.
  expect(result.recommendations[1]).toMatchObject({
    detailsHref: "/destinos/ireland/general-employment-permit",
    sources: [{ id: "s-general-employment-permit" }],
  });
  expect(listMyOpenProcessesByVisa).toHaveBeenCalledWith("ireland");
});

test("com processo aberto, oferece abrir em vez de iniciar outro", async () => {
  getQuestionnaire.mockResolvedValue({
    kind: "READY",
    complete: true,
    questions: irelandQuestions,
    answers,
    profile: normalizeProfile(answers),
  });
  listMyOpenProcessesByVisa.mockResolvedValue(
    new Map([["critical-skills-employment-permit", "p-1"]]),
  );
  const result = await getRecommendations("ireland");
  if (result.kind !== "READY") throw new Error("expected READY");
  expect(result.recommendations[0].process).toEqual({
    kind: "OPEN",
    href: "/processes/p-1",
  });
});

test("não recomendado nunca oferece iniciar processo", async () => {
  const eea = { ...answers, region: "eea" };
  getQuestionnaire.mockResolvedValue({
    kind: "READY",
    complete: true,
    questions: irelandQuestions,
    answers: eea,
    profile: normalizeProfile(eea),
  });
  const result = await getRecommendations("ireland");
  if (result.kind !== "READY") throw new Error("expected READY");
  expect(
    result.recommendations.find(
      (r) => r.visaSlug === "critical-skills-employment-permit",
    )?.process,
  ).toBeNull();
});

test("visto sem conteúdo publicado não aparece", async () => {
  getQuestionnaire.mockResolvedValue({
    kind: "READY",
    complete: true,
    questions: irelandQuestions,
    answers,
    profile: normalizeProfile(answers),
  });
  listRecommendationVisas.mockResolvedValue([]);
  const result = await getRecommendations("ireland");
  if (result.kind !== "READY") throw new Error("expected READY");
  expect(result.recommendations).toEqual([]);
});
