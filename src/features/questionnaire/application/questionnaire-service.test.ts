import { beforeEach, expect, test, vi } from "vitest";
import { irelandQuestions } from "../data/ireland-questions";
import { AnswersInvalidError } from "../answers";
import {
  getQuestionnaire,
  QuestionnaireUnavailableError,
  saveQuestionnaire,
} from "./questionnaire-service";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  getCurrentUserProfile: vi.fn(),
  listActiveQuestions: vi.fn(),
  findAnswers: vi.fn(),
  replaceAnswers: vi.fn(),
}));
vi.mock("@/features/profile/service", () => ({
  getCurrentUserProfile: mocks.getCurrentUserProfile,
}));
vi.mock("@/lib/db/repositories/question-repository", async () => ({
  listActiveQuestions: mocks.listActiveQuestions,
  toQuestionView: (
    await vi.importActual<
      typeof import("@/lib/db/repositories/question-repository")
    >("@/lib/db/repositories/question-repository")
  ).toQuestionView,
}));
vi.mock("@/lib/db/repositories/answer-repository", () => ({
  findAnswers: mocks.findAnswers,
  replaceAnswers: mocks.replaceAnswers,
}));

const records = irelandQuestions.map((question) => ({
  ...question,
  id: `q-${question.code}`,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.getCurrentUserProfile.mockResolvedValue({
    id: "profile-1",
    displayName: null,
    preferredLocale: "pt-BR",
  });
  mocks.listActiveQuestions.mockResolvedValue(records);
  mocks.findAnswers.mockResolvedValue([]);
});

test("sem perfil, pede a criação antes do questionário", async () => {
  mocks.getCurrentUserProfile.mockResolvedValue(null);
  expect(await getQuestionnaire("ireland")).toEqual({
    kind: "PROFILE_REQUIRED",
  });
  expect(await saveQuestionnaire("ireland", {})).toBe("PROFILE_REQUIRED");
  expect(mocks.replaceAnswers).not.toHaveBeenCalled();
});

test("carrega respostas do próprio perfil e normaliza o perfil migratório", async () => {
  mocks.findAnswers.mockResolvedValue([
    { questionId: "q-objective", value: "work" },
    { questionId: "q-has_employment_offer", value: false },
    { questionId: "q-region", value: "valor-antigo" },
  ]);
  const state = await getQuestionnaire("ireland");
  expect(mocks.findAnswers).toHaveBeenCalledWith(
    "profile-1",
    records.map((record) => record.id),
  );
  expect(state).toMatchObject({
    kind: "READY",
    answers: { objective: "work", has_employment_offer: false },
    complete: false,
    profile: { objective: "work", hasEmploymentOffer: false },
  });
});

test("país sem perguntas publicadas", async () => {
  mocks.listActiveQuestions.mockResolvedValue([]);
  expect(await getQuestionnaire("ireland")).toEqual({
    kind: "UNAVAILABLE_FOR_COUNTRY",
  });
});

test("salva só respostas válidas e visíveis, com o perfil do servidor", async () => {
  await expect(
    saveQuestionnaire("ireland", {
      objective: "study",
      region: "other",
      has_admission: true,
      has_funds: true,
      has_employment_offer: true,
    }),
  ).resolves.toBe("SAVED");
  expect(mocks.replaceAnswers).toHaveBeenCalledWith({
    userProfileId: "profile-1",
    countryQuestionIds: records.map((record) => record.id),
    answers: [
      { questionId: "q-objective", value: "study" },
      { questionId: "q-region", value: "other" },
      { questionId: "q-has_admission", value: true },
      { questionId: "q-has_funds", value: true },
    ],
  });
});

test("respostas inválidas não chegam ao banco", async () => {
  await expect(
    saveQuestionnaire("ireland", { objective: "work", userProfileId: "outro" }),
  ).rejects.toBeInstanceOf(AnswersInvalidError);
  expect(mocks.replaceAnswers).not.toHaveBeenCalled();
});

test("falhas de banco viram erro estável sem detalhes", async () => {
  mocks.listActiveQuestions.mockRejectedValue(
    new Error("connection refused 10.0.0.1"),
  );
  await expect(getQuestionnaire("ireland")).rejects.toBeInstanceOf(
    QuestionnaireUnavailableError,
  );
});
