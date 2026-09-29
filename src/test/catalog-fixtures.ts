import {
  criticalSkills,
  criticalSkillsSources,
} from "../../prisma/seed-data/critical-skills";
import type {
  CatalogSource,
  CatalogVisa,
} from "../features/visas/catalog-types";

export const catalogVisaFixture: CatalogVisa = {
  id: "seed-visa-ie-critical-skills",
  slug: "critical-skills-employment-permit",
  name: criticalSkills.name,
  shortDescription: criticalSkills.description,
  description: criticalSkills.description,
  category: { slug: "work", name: "Trabalho" },
  country: { code: "IE", slug: "ireland", name: "Irlanda" },
  requirements: criticalSkills.requirements.map((item, index) => ({
    code: `requirement-${index}`,
    title: item.title,
    text: item.text,
    sources: [{ sourceId: "seed-source-ie-permit", relationType: "PRIMARY" }],
  })),
  sources: Object.keys(criticalSkillsSources).map((key) => ({
    sourceId: `seed-source-ie-${key}`,
    relationType: key === "permit" ? "OVERVIEW" : "OFFICIAL_GUIDE",
  })),
};
export const catalogSourceFixtures: CatalogSource[] = Object.entries(
  criticalSkillsSources,
).map(([key, source]) => ({
  ...source,
  id: `seed-source-ie-${key}`,
  status: "ACTIVE",
  consultedAt: "2026-09-10",
}));
