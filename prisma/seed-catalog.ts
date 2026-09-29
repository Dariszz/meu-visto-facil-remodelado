import "server-only";
import type { Prisma } from "../src/lib/db/generated/client";
import {
  criticalSkills,
  criticalSkillsSources,
} from "./seed-data/critical-skills";

const requirementCodes = [
  "employment-offer",
  "occupation-remuneration",
  "qualifications",
  "employer-conditions",
] as const;

// Create-only upserts preserve subsequent editorial edits and verification metadata.
export async function seedCatalog(tx: Prisma.TransactionClient) {
  const country = await tx.country.upsert({
    where: { code: "IE" },
    update: {},
    create: {
      id: "seed-country-ie",
      code: "IE",
      slug: "ireland",
      name: "Irlanda",
      status: "ACTIVE",
    },
  });
  const category = await tx.visaCategory.upsert({
    where: { slug: "work" },
    update: {},
    create: { id: "seed-category-work", slug: "work", name: "Trabalho" },
  });
  const visa = await tx.visa.upsert({
    where: {
      countryId_slug: {
        countryId: country.id,
        slug: "critical-skills-employment-permit",
      },
    },
    update: {},
    create: {
      id: "seed-visa-ie-critical-skills",
      countryId: country.id,
      categoryId: category.id,
      slug: "critical-skills-employment-permit",
      name: criticalSkills.name,
      officialName: criticalSkills.name,
      authorityName: criticalSkillsSources.permit.authority,
      shortDescription: criticalSkills.description,
      description: criticalSkills.description,
      status: "DRAFT",
      lastReviewedAt: new Date(`${criticalSkills.consultedAt}T00:00:00Z`),
    },
  });
  for (const [key, source] of Object.entries(criticalSkillsSources)) {
    const record = await tx.officialSource.upsert({
      where: { countryId_url: { countryId: country.id, url: source.url } },
      update: {},
      create: {
        id: `seed-source-ie-${key}`,
        countryId: country.id,
        ...source,
        hostname: new URL(source.url).hostname,
        editorialConsultedAt: new Date(
          `${criticalSkills.consultedAt}T00:00:00Z`,
        ),
      },
    });
    await tx.visaSource.upsert({
      where: { visaId_sourceId: { visaId: visa.id, sourceId: record.id } },
      update: {},
      create: {
        visaId: visa.id,
        sourceId: record.id,
        relationType: key === "permit" ? "OVERVIEW" : "OFFICIAL_GUIDE",
      },
    });
    for (const [index, item] of criticalSkills.requirements.entries()) {
      if (item.source !== key) continue;
      const code = requirementCodes[index];
      if (!code) throw new Error("SEED_MAPPING_INVALID");
      const requirement = await tx.visaRequirement.upsert({
        where: { visaId_code: { visaId: visa.id, code } },
        update: {},
        create: {
          id: `seed-requirement-ie-${code}`,
          visaId: visa.id,
          code,
          title: item.title,
          description: item.text,
          category: code === "qualifications" ? "EDUCATION" : "EMPLOYMENT",
          requirementType: "CONDITION",
          importance: "HIGH",
          isMandatory: true,
          sourceControlled: true,
          sortOrder: index,
        },
      });
      await tx.requirementSource.upsert({
        where: {
          requirementId_sourceId: {
            requirementId: requirement.id,
            sourceId: record.id,
          },
        },
        update: {},
        create: {
          requirementId: requirement.id,
          sourceId: record.id,
          relationType: "PRIMARY",
        },
      });
    }
  }
}
