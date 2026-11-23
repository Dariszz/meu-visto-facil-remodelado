import { expect, test } from "vitest";
import {
  AnswersInvalidError,
  isQuestionnaireComplete,
  readStoredAnswers,
  validateAnswers,
} from "./answers";
import { irelandQuestions } from "./data/ireland-questions";
import { emptyProfile, normalizeProfile } from "./immigration-profile";

const workAnswers = {
  objective: "work",
  region: "other",
  has_employment_offer: true,
  offer_duration: "2y_plus",
  occupation_area: "technology",
};

function issuesOf(input: unknown) {
  try {
    validateAnswers(irelandQuestions, input);
    return [];
  } catch (error) {
    if (error instanceof AnswersInvalidError) return error.issues;
    throw error;
  }
}

test("aceita respostas completas e válidas", () => {
  expect(validateAnswers(irelandQuestions, workAnswers)).toEqual(workAnswers);
});

test("rejeita formato, pergunta desconhecida e valor fora das opções", () => {
  expect(issuesOf("texto")).toEqual(["SHAPE"]);
  expect(issuesOf(["objective"])).toEqual(["SHAPE"]);
  expect(issuesOf({ ...workAnswers, userProfileId: "outro" })).toContain(
    "UNKNOWN_QUESTION:userProfileId",
  );
  expect(issuesOf({ ...workAnswers, objective: "invadir" })).toContain(
    "INVALID_VALUE:objective",
  );
  expect(issuesOf({ ...workAnswers, has_employment_offer: "true" })).toContain(
    "INVALID_VALUE:has_employment_offer",
  );
});

test("multi seleção não aceita opção repetida", () => {
  const questions = [
    {
      code: "langs",
      question: "Idiomas",
      type: "MULTI_SELECT" as const,
      required: true,
      options: [
        { value: "en", label: "Inglês" },
        { value: "pt", label: "Português" },
      ],
    },
  ];
  expect(validateAnswers(questions, { langs: ["en", "pt"] })).toEqual({
    langs: ["en", "pt"],
  });
  expect(() => validateAnswers(questions, { langs: ["en", "en"] })).toThrow(
    AnswersInvalidError,
  );
});

test("exige obrigatórias visíveis e ignora as ocultas", () => {
  expect(issuesOf({ objective: "work", region: "other" })).toEqual([
    "REQUIRED:has_employment_offer",
    "REQUIRED:occupation_area",
  ]);
  // Estudo esconde as perguntas de trabalho: respostas delas são descartadas.
  expect(
    validateAnswers(irelandQuestions, {
      objective: "study",
      region: "other",
      has_admission: false,
      has_funds: true,
      has_employment_offer: true,
      offer_duration: "2y_plus",
    }),
  ).toEqual({
    objective: "study",
    region: "other",
    has_admission: false,
    has_funds: true,
  });
});

test("respostas guardadas inválidas ou órfãs são ignoradas na leitura", () => {
  expect(
    readStoredAnswers(irelandQuestions, [
      { questionCode: "objective", value: "work" },
      { questionCode: "region", value: "marte" },
      { questionCode: "removida", value: true },
      { questionCode: "family_in_country", value: true },
    ]),
  ).toEqual({ objective: "work" });
});

test("questionário completo só com todas as obrigatórias visíveis", () => {
  expect(isQuestionnaireComplete(irelandQuestions, workAnswers)).toBe(true);
  expect(isQuestionnaireComplete(irelandQuestions, { objective: "work" })).toBe(
    false,
  );
  expect(isQuestionnaireComplete([], {})).toBe(false);
});

test("normalização produz o perfil de domínio", () => {
  expect(
    normalizeProfile({ ...workAnswers, education_level: "degree" }),
  ).toEqual({
    ...emptyProfile,
    objective: "work",
    passportRegion: "other",
    hasEmploymentOffer: true,
    offerDuration: "2y_plus",
    occupationArea: "technology",
    educationLevel: "degree",
  });
});

test("falta de informação vira null, nunca resposta negativa", () => {
  const profile = normalizeProfile({ objective: "exploring" });
  expect(profile.hasEmploymentOffer).toBeNull();
  expect(profile.familyInCountry).toBeNull();
  expect(normalizeProfile({ objective: "voar" }).objective).toBeNull();
});

test("duração da oferta só vale com oferta confirmada", () => {
  expect(
    normalizeProfile({ has_employment_offer: false, offer_duration: "2y_plus" })
      .offerDuration,
  ).toBeNull();
});
