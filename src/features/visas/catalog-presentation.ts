import type {
  CatalogSource,
  CatalogVisa,
  CatalogVisaSummary,
} from "./catalog-types";
import {
  criticalSkills,
  type CriticalSkillsSourceId,
} from "./data/critical-skills";
import type { VisaSummary, VisaCategory } from "./types";

const editorialSourceIds: Record<CriticalSkillsSourceId, string> = {
  permit: "seed-source-ie-permit",
  entry: "seed-source-ie-entry",
  residence: "seed-source-ie-residence",
};

export function formatConsultedDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function presentVisaSummary(
  visa: CatalogVisaSummary,
  categorySlug: VisaCategory["slug"] = "work",
): VisaSummary {
  return {
    slug: visa.slug,
    countryCode: "IE",
    categorySlug,
    name: visa.name,
    shortDescription: visa.shortDescription,
    type:
      categorySlug === "work" ? "Permissão de trabalho" : "Caminho migratório",
    // Only this detail route has been implemented and editorially prepared.
    detailsHref:
      visa.slug === "critical-skills-employment-permit"
        ? `/ireland/visas/${visa.slug}`
        : undefined,
  };
}

export function presentCriticalSkills(
  record: CatalogVisa,
  sourceRecords: CatalogSource[],
) {
  const sources = Object.fromEntries(
    sourceRecords.map((source) => [source.id, source]),
  );
  const linked = new Set(record.sources.map((link) => link.sourceId));
  const editorial = (
    items: { title: string; text: string; source: CriticalSkillsSourceId }[],
  ) =>
    items.map((item) => ({
      title: item.title,
      text: item.text,
      sourceIds: linked.has(editorialSourceIds[item.source])
        ? [editorialSourceIds[item.source]]
        : [],
    }));
  return {
    name: record.name,
    category: record.category.name,
    countryName: record.country.name,
    description: record.description ?? record.shortDescription,
    audience: criticalSkills.audience,
    disclaimer: criticalSkills.disclaimer,
    overviewSourceIds: record.sources
      .filter((link) => link.relationType === "OVERVIEW")
      .map((link) => link.sourceId),
    requirements: record.requirements.map((item) => ({
      ...item,
      sourceIds: item.sources.map((link) => link.sourceId),
    })),
    attributes: editorial(criticalSkills.attributes),
    permissions: editorial(criticalSkills.permissions),
    steps: editorial(criticalSkills.steps),
    sources,
  };
}
export type CriticalSkillsPresentation = ReturnType<
  typeof presentCriticalSkills
>;
