import { describe, expect, test } from "vitest";
import {
  emptyProfile,
  objectives,
  type ImmigrationProfile,
} from "@/features/questionnaire/immigration-profile";
import {
  recommendationDestinations,
  type RecommendationDestination,
} from "@/features/destinations/registry";
import { evaluateDestination, ruleVersionFor } from "./evaluate";
import { irelandContent } from "../../../../prisma/seed-data/countries/ireland";
import { destinationContents } from "../../../../prisma/seed-data/countries";

const destinations = Object.keys(
  recommendationDestinations,
) as RecommendationDestination[];

const results = (
  destination: RecommendationDestination,
  profile: Partial<ImmigrationProfile>,
) =>
  Object.fromEntries(
    evaluateDestination(destination, { ...emptyProfile, ...profile }).map(
      (result) => [result.visaSlug, result],
    ),
  );

const worker: Partial<ImmigrationProfile> = {
  objective: "work",
  passportRegion: "other",
  hasEmploymentOffer: true,
  occupationArea: "technology",
  educationLevel: "degree",
  experienceYears: "3_5",
  englishLevel: "advanced",
  germanLevel: "a1_a2",
  ageRange: "30_39",
};

describe("todos os destinos", () => {
  test("só recomendam vistos que existem no conteúdo revisado", () => {
    const contentSlugs = new Map<string, Set<string>>([
      [
        "ireland",
        new Set([
          "critical-skills-employment-permit",
          ...irelandContent.visas.map((visa) => visa.slug),
        ]),
      ],
      ...destinationContents.map(
        (content) =>
          [content.slug, new Set(content.visas.map((visa) => visa.slug))] as [
            string,
            Set<string>,
          ],
      ),
    ]);
    for (const destination of destinations) {
      const all = evaluateDestination(destination, {
        ...emptyProfile,
        objective: "exploring",
      });
      expect(all.length).toBeGreaterThan(0);
      for (const result of all)
        expect(contentSlugs.get(destination)?.has(result.visaSlug)).toBe(true);
      // Explorando, cada visto revisado aparece.
      expect(all).toHaveLength(contentSlugs.get(destination)!.size);
    }
  });

  test("perfil vazio nunca vira impedimento nem alta compatibilidade", () => {
    for (const destination of destinations)
      for (const result of evaluateDestination(destination, {
        ...emptyProfile,
        objective: "exploring",
      })) {
        expect(result.blockers).toEqual([]);
        expect(result.compatibility).toBe("MEDIUM");
        expect(result.ruleVersion).toBe(ruleVersionFor(destination));
      }
  });

  test("nenhum texto promete elegibilidade ou aprovação", () => {
    for (const destination of destinations)
      for (const objective of objectives)
        for (const profile of [
          { ...worker, objective },
          { objective, hasEmploymentOffer: false, hasFunds: false },
        ])
          for (const result of evaluateDestination(destination, {
            ...emptyProfile,
            ...profile,
          }))
            for (const text of [
              ...result.matchedCriteria,
              ...result.missingCriteria,
              ...result.blockers,
            ])
              expect(text).not.toMatch(/você é elegível|aprovad|garant/i);
  });
});

test("Portugal: nômade digital depende da faixa de renda", () => {
  const remote = {
    objective: "remote_work" as const,
    passportRegion: "other" as const,
    worksRemotely: true,
  };
  expect(
    results("portugal", { ...remote, remoteIncome: "3700_plus" })[
      "nomada-digital"
    ].compatibility,
  ).toBe("HIGH");
  expect(
    results("portugal", { ...remote, remoteIncome: "2450_3700" })[
      "nomada-digital"
    ].compatibility,
  ).toBe("MEDIUM");
  const low = results("portugal", { ...remote, remoteIncome: "under_2200" })[
    "nomada-digital"
  ];
  expect(low.compatibility).toBe("LOW");
  expect(low.blockers[0]).toMatch(/3\.680/);
});

test("União Europeia: cidadão do EEE não precisa de visto", () => {
  for (const destination of [
    "portugal",
    "spain",
    "italy",
    "germany",
    "netherlands",
  ] as const)
    for (const result of evaluateDestination(destination, {
      ...emptyProfile,
      ...worker,
      passportRegion: "eea",
    }))
      expect(result.compatibility).toBe("NOT_RECOMMENDED");
});

test("Espanha: trabalho com contrato fica no máximo em média (mercado de trabalho)", () => {
  expect(results("spain", worker)["trabalho-conta-alheia"].compatibility).toBe(
    "MEDIUM",
  );
});

test("Itália: nômade digital aceita experiência em TI no lugar do diploma", () => {
  const profile = {
    objective: "remote_work" as const,
    passportRegion: "other" as const,
    worksRemotely: true,
    remoteIncome: "2450_3700" as const,
    remoteMonths: "6_plus" as const,
    educationLevel: "secondary" as const,
    occupationArea: "technology" as const,
    experienceYears: "3_5" as const,
  };
  expect(results("italy", profile)["nomade-digital"].compatibility).toBe(
    "HIGH",
  );
  expect(
    results("italy", { ...profile, remoteMonths: "3_6" })["nomade-digital"]
      .compatibility,
  ).toBe("LOW");
  expect(
    results("italy", { ...profile, occupationArea: "other" })["nomade-digital"]
      .blockers[0],
  ).toMatch(/alta qualificação/);
});

test("Alemanha: Cartão Azul aceita TI sem diploma; reunião exige casamento", () => {
  expect(
    results("germany", { ...worker, educationLevel: "secondary" })[
      "cartao-azul-ue"
    ].compatibility,
  ).toBe("HIGH");
  expect(
    results("germany", {
      ...worker,
      educationLevel: "secondary",
      occupationArea: "healthcare",
    })["cartao-azul-ue"].compatibility,
  ).toBe("LOW");
  const partner = results("germany", {
    objective: "family",
    passportRegion: "other",
    familyInCountry: true,
    familyRelationship: "partner",
    familySponsorStatus: "citizen",
    germanLevel: "a1_a2",
  })["reuniao-com-conjuge"];
  expect(partner.compatibility).toBe("LOW");
  expect(partner.blockers[0]).toMatch(/união estável/);
});

test("Alemanha: cartão de oportunidades aceita inglês B2 sem alemão", () => {
  const seeker = {
    objective: "job_search" as const,
    passportRegion: "other" as const,
    educationLevel: "degree" as const,
    hasFunds: true,
    germanLevel: "none" as const,
  };
  expect(
    results("germany", { ...seeker, englishLevel: "upper" })[
      "cartao-de-oportunidades"
    ].compatibility,
  ).toBe("HIGH");
  expect(
    results("germany", { ...seeker, englishLevel: "basic" })[
      "cartao-de-oportunidades"
    ].compatibility,
  ).toBe("LOW");
});

test("Holanda: parceiro com menos de 21 anos é impedimento em geral", () => {
  expect(
    results("netherlands", {
      objective: "family",
      passportRegion: "other",
      familyInCountry: true,
      familyRelationship: "partner",
      familySponsorStatus: "citizen",
      ageRange: "under_21",
    }).parceiro.compatibility,
  ).toBe("LOW");
});

test("Reino Unido: britânicos e irlandeses não precisam; inglês B2 no Skilled Worker", () => {
  for (const region of ["uk", "ie"] as const)
    expect(
      results("united-kingdom", { ...worker, passportRegion: region })[
        "skilled-worker"
      ].compatibility,
    ).toBe("NOT_RECOMMENDED");
  expect(
    results("united-kingdom", { ...worker, englishLevel: "intermediate" })[
      "skilled-worker"
    ].compatibility,
  ).toBe("LOW");
  expect(results("united-kingdom", worker)["global-talent"].compatibility).toBe(
    "MEDIUM",
  );
});

test("Canadá, EUA e Austrália: caminhos por sorteio ou convite ficam em média", () => {
  expect(
    results("canada", worker)["express-entry-federal-skilled-worker"]
      .compatibility,
  ).toBe("MEDIUM");
  expect(results("united-states", worker)["h-1b"].compatibility).toBe("MEDIUM");
  expect(
    results("australia", worker)["skilled-independent-189"].compatibility,
  ).toBe("MEDIUM");
  expect(
    results("australia", { ...worker, ageRange: "45_plus" })[
      "skilled-independent-189"
    ].blockers[0],
  ).toMatch(/45 anos/);
});

test("Patrocínio familiar exige cidadão ou residente permanente onde a regra pede", () => {
  const family = {
    objective: "family" as const,
    passportRegion: "other" as const,
    familyInCountry: true,
    familyRelationship: "spouse" as const,
  };
  for (const [destination, slug] of [
    ["canada", "spouse-sponsorship"],
    ["united-states", "spouse-green-card"],
    ["australia", "partner-309-100"],
    ["united-kingdom", "family-partner"],
  ] as const) {
    expect(
      results(destination, { ...family, familySponsorStatus: "citizen" })[slug]
        .compatibility,
    ).toBe("HIGH");
    expect(
      results(destination, { ...family, familySponsorStatus: "temporary" })[
        slug
      ].compatibility,
    ).toBe("LOW");
  }
  expect(
    results("united-states", {
      ...family,
      familyRelationship: "partner",
      familySponsorStatus: "citizen",
    })["spouse-green-card"].blockers[0],
  ).toMatch(/casamento civil/);
});

test("Quem já é cidadão do destino não precisa dos caminhos", () => {
  for (const destination of ["canada", "united-states", "australia"] as const)
    for (const result of evaluateDestination(destination, {
      ...emptyProfile,
      ...worker,
      objective: "exploring",
      passportRegion: "local",
    }))
      expect(result.compatibility).toBe("NOT_RECOMMENDED");
});
