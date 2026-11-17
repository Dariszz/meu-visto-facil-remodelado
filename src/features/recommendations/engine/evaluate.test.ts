import { expect, test } from "vitest";
import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import { evaluateIrelandWorkPaths, RULE_ENGINE_VERSION } from "./evaluate";

const base: ImmigrationProfile = {
  objective: "work",
  passportRegion: "other",
  hasEmploymentOffer: true,
  offerDuration: "2y_plus",
  occupationArea: "technology",
  educationLevel: "degree",
  familyInCountry: null,
};

const bySlug = (profile: ImmigrationProfile) =>
  Object.fromEntries(
    evaluateIrelandWorkPaths(profile).map((result) => [
      result.visaSlug,
      result,
    ]),
  );

test("alta compatibilidade: trabalho, fora do EEE, oferta de dois anos ou mais", () => {
  const {
    "critical-skills-employment-permit": cs,
    "general-employment-permit": ge,
  } = bySlug(base);
  expect(cs.compatibility).toBe("HIGH");
  expect(cs.blockers).toEqual([]);
  expect(cs.matchedCriteria).toHaveLength(3);
  // O que o questionário não coleta continua sempre "a confirmar".
  expect(cs.missingCriteria).toContain(
    "Se a ocupação e a remuneração estão dentro dos critérios vigentes.",
  );
  expect(cs.ruleVersion).toBe(RULE_ENGINE_VERSION);
  // Conteúdo não revisado nunca passa de média.
  expect(ge.compatibility).toBe("MEDIUM");
});

test("média compatibilidade: informação central faltando", () => {
  const { "critical-skills-employment-permit": cs } = bySlug({
    ...base,
    offerDuration: "unknown",
  });
  expect(cs.compatibility).toBe("MEDIUM");
  expect(cs.missingCriteria).toContain(
    "Se a oferta tem duração de pelo menos dois anos.",
  );
  expect(
    bySlug({ ...base, objective: "exploring" })[
      "critical-skills-employment-permit"
    ].compatibility,
  ).toBe("MEDIUM");
});

test("baixa compatibilidade: sem oferta é impedimento nos dois caminhos", () => {
  const results = evaluateIrelandWorkPaths({
    ...base,
    hasEmploymentOffer: false,
    offerDuration: null,
  });
  for (const result of results) {
    expect(result.compatibility).toBe("LOW");
    expect(result.blockers[0]).toMatch(/oferta de emprego/);
  }
});

test("oferta curta é impedimento só para o Critical Skills", () => {
  const {
    "critical-skills-employment-permit": cs,
    "general-employment-permit": ge,
  } = bySlug({ ...base, offerDuration: "under_2y" });
  expect(cs.compatibility).toBe("LOW");
  expect(cs.blockers).toEqual([
    "O Critical Skills pede oferta de pelo menos dois anos, e a sua é mais curta.",
  ]);
  expect(ge.blockers).toEqual([]);
});

test("informação ausente nunca vira resposta negativa", () => {
  const results = evaluateIrelandWorkPaths({
    ...base,
    passportRegion: null,
    hasEmploymentOffer: null,
    offerDuration: null,
  });
  for (const result of results) {
    expect(result.blockers).toEqual([]);
    expect(result.compatibility).toBe("MEDIUM");
    expect(result.missingCriteria).toContain(
      "Se você já tem uma oferta de emprego na Irlanda.",
    );
  }
});

test("nacionalidade do EEE: não indicado, porque não precisa de autorização", () => {
  for (const result of evaluateIrelandWorkPaths({
    ...base,
    passportRegion: "eea",
  })) {
    expect(result.compatibility).toBe("NOT_RECOMMENDED");
    expect(result.blockers[0]).toMatch(/Espaço Econômico Europeu/);
  }
});

test("Reino Unido fica como ponto a confirmar, sem conclusão", () => {
  const { "critical-skills-employment-permit": cs } = bySlug({
    ...base,
    passportRegion: "uk",
  });
  expect(cs.compatibility).toBe("MEDIUM");
  expect(cs.missingCriteria[0]).toMatch(/Reino Unido/);
});

test("estudo e família não recebem caminhos de trabalho", () => {
  expect(evaluateIrelandWorkPaths({ ...base, objective: "study" })).toEqual([]);
  expect(evaluateIrelandWorkPaths({ ...base, objective: "family" })).toEqual(
    [],
  );
  expect(evaluateIrelandWorkPaths({ ...base, objective: null })).toEqual([]);
});

test("nenhum texto promete elegibilidade ou aprovação", () => {
  const all = [
    base,
    { ...base, hasEmploymentOffer: false },
    { ...base, passportRegion: "eea" as const },
  ].flatMap(evaluateIrelandWorkPaths);
  for (const result of all)
    for (const text of [
      ...result.matchedCriteria,
      ...result.missingCriteria,
      ...result.blockers,
    ])
      expect(text).not.toMatch(/você é elegível|aprovad|garant/i);
});
