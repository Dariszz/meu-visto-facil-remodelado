// Contratos de apresentação do resultado da Recommendation Engine (Fases 16–17).
// Os valores de compatibility seguem docs/DATA-MODEL.md; não há porcentagem.
export const compatibilityLevels = [
  "HIGH",
  "MEDIUM",
  "LOW",
  "NOT_RECOMMENDED",
] as const;

export type Compatibility = (typeof compatibilityLevels)[number];

export type RecommendationSourceRef = {
  id: string;
  title: string;
  authority: string;
};

export type RecommendationView = {
  visaSlug: string;
  visaName: string;
  categoryName: string;
  summary: string;
  compatibility: Compatibility;
  matchedCriteria: readonly string[];
  missingCriteria: readonly string[];
  blockers: readonly string[];
  sources: readonly RecommendationSourceRef[];
  detailsHref: string | null;
  // START: o visto já tem checklist revisado e pode virar processo.
  // OPEN: a pessoa já tem um processo aberto para este visto.
  process: RecommendationProcessAction | null;
};

export type RecommendationProcessAction =
  { kind: "START" } | { kind: "OPEN"; href: string };

export type ProfileFact = { label: string; value: string };
