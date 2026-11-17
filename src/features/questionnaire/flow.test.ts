import { expect, test } from "vitest";
import {
  countPotentialQuestions,
  formatAnswer,
  getVisibleQuestions,
  isAnswered,
  pruneHiddenAnswers,
} from "./flow";
import type { QuestionView } from "./types";

const questions: QuestionView[] = [
  {
    code: "objective",
    question: "Objetivo",
    type: "SINGLE_SELECT",
    required: true,
    options: [
      { value: "work", label: "Trabalhar" },
      { value: "study", label: "Estudar" },
    ],
  },
  {
    code: "has_offer",
    question: "Tem oferta?",
    type: "BOOLEAN",
    required: true,
    showIf: { questionCode: "objective", equalsAnyOf: ["work"] },
  },
  {
    code: "offer_duration",
    question: "Duração",
    type: "SINGLE_SELECT",
    required: true,
    options: [{ value: "2y", label: "2 anos ou mais" }],
    showIf: { questionCode: "has_offer", equalsAnyOf: [true] },
  },
  {
    code: "education",
    question: "Formação",
    type: "MULTI_SELECT",
    required: false,
    options: [
      { value: "degree", label: "Graduação" },
      { value: "masters", label: "Mestrado" },
    ],
  },
];

const codes = (list: QuestionView[]) => list.map((question) => question.code);

test("perguntas condicionais aparecem conforme as respostas", () => {
  expect(codes(getVisibleQuestions(questions, {}))).toEqual([
    "objective",
    "education",
  ]);
  expect(
    codes(
      getVisibleQuestions(questions, { objective: "work", has_offer: true }),
    ),
  ).toEqual(["objective", "has_offer", "offer_duration", "education"]);
  expect(
    codes(
      getVisibleQuestions(questions, { objective: "work", has_offer: false }),
    ),
  ).toEqual(["objective", "has_offer", "education"]);
});

test("pergunta dependente de outra oculta também fica oculta", () => {
  expect(
    codes(
      getVisibleQuestions(questions, { objective: "study", has_offer: true }),
    ),
  ).toEqual(["objective", "education"]);
});

test("respostas de perguntas ocultas são descartadas", () => {
  expect(
    pruneHiddenAnswers(questions, {
      objective: "study",
      has_offer: true,
      offer_duration: "2y",
      education: ["degree"],
    }),
  ).toEqual({ objective: "study", education: ["degree"] });
});

test("resposta vazia não conta como respondida; false conta", () => {
  expect(isAnswered(undefined)).toBe(false);
  expect(isAnswered("")).toBe(false);
  expect(isAnswered([])).toBe(false);
  expect(isAnswered(false)).toBe(true);
});

test("respostas são formatadas com os rótulos das opções", () => {
  expect(formatAnswer(questions[1], false)).toBe("Não");
  expect(formatAnswer(questions[0], "work")).toBe("Trabalhar");
  expect(formatAnswer(questions[3], ["degree", "masters"])).toBe(
    "Graduação, Mestrado",
  );
  expect(formatAnswer(questions[3], [])).toBe("Sem resposta");
});

test("total estimado inclui perguntas que ainda podem aparecer", () => {
  expect(countPotentialQuestions(questions, {})).toBe(4);
  expect(countPotentialQuestions(questions, { objective: "study" })).toBe(2);
  expect(
    countPotentialQuestions(questions, { objective: "work", has_offer: false }),
  ).toBe(3);
});
