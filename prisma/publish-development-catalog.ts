import "server-only";
import type { Prisma } from "../src/lib/db/generated/client";
import {
  criticalSkills,
  criticalSkillsSources,
} from "./seed-data/critical-skills";

// This CLI-only operation deliberately does not overwrite editorial changes.
export async function publishDevelopmentCatalog(tx: Prisma.TransactionClient) {
  const visa = await tx.visa.findUnique({
    where: { id: "seed-visa-ie-critical-skills" },
    include: {
      country: true,
      category: true,
      requirements: {
        orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
        include: { sources: true },
      },
      sources: { include: { source: true } },
    },
  });
  const approvedSummary =
    "Entenda os principais requisitos, as etapas gerais e as fontes oficiais deste caminho de trabalho na Irlanda.";
  if (
    !visa ||
    visa.country.slug !== "ireland" ||
    visa.country.code !== "IE" ||
    visa.country.status !== "ACTIVE" ||
    visa.category.slug !== "work" ||
    visa.category.name !== "Trabalho" ||
    visa.slug !== "critical-skills-employment-permit" ||
    !["DRAFT", "ACTIVE"].includes(visa.status) ||
    visa.name !== criticalSkills.name ||
    visa.description !== criticalSkills.description ||
    ![criticalSkills.description, approvedSummary].includes(
      visa.shortDescription,
    ) ||
    visa.requirements.length !== 4 ||
    visa.sources.length !== 3 ||
    visa.requirements.some(
      (item, index) =>
        item.title !== criticalSkills.requirements[index].title ||
        item.description !== criticalSkills.requirements[index].text ||
        !item.isMandatory ||
        !item.sourceControlled ||
        item.sources.length !== 1 ||
        item.sources[0].sourceId !== "seed-source-ie-permit" ||
        item.sources[0].relationType !== "PRIMARY",
    ) ||
    Object.entries(criticalSkillsSources).some(
      ([key, expected]) =>
        !visa.sources.some((link) => {
          const source = link.source;
          return (
            source.id === `seed-source-ie-${key}` &&
            source.countryId === visa.countryId &&
            source.status === "ACTIVE" &&
            source.url === expected.url &&
            source.hostname === new URL(expected.url).hostname &&
            source.title === expected.title &&
            source.authority === expected.authority &&
            source.editorialConsultedAt?.toISOString() ===
              "2026-09-10T00:00:00.000Z" &&
            link.relationType ===
              (key === "permit" ? "OVERVIEW" : "OFFICIAL_GUIDE")
          );
        }),
    )
  )
    throw new Error("CATALOG_PUBLICATION_REVIEW_REQUIRED");
  if (visa.status === "ACTIVE") return "ALREADY_ACTIVE";
  await tx.visa.update({
    where: { id: visa.id, status: "DRAFT", updatedAt: visa.updatedAt },
    data: { status: "ACTIVE", shortDescription: approvedSummary },
  });
  return "DRAFT_TO_ACTIVE";
}
