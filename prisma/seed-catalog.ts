import "server-only";
import type { Prisma } from "../src/lib/db/generated/client";
import {
  criticalSkills,
  criticalSkillsSources,
} from "./seed-data/critical-skills";
import { irelandQuestions } from "../src/features/questionnaire/data/ireland-questions";

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
      coverageLevel: "PARTIAL",
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
      reviewStatus: "REVIEWED",
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
          // Conteúdo pesquisado em 10/09/2026 e aprovado nas Fases 5 a 7.
          reviewStatus: "REVIEWED",
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
  await seedQuestions(tx, country.id);
}

// Questionário da Irlanda (Fase 13). Create-only, como o restante do seed.
async function seedQuestions(tx: Prisma.TransactionClient, countryId: string) {
  for (const [index, item] of irelandQuestions.entries()) {
    const question = await tx.profileQuestion.upsert({
      where: { countryId_code: { countryId, code: item.code } },
      update: {},
      create: {
        id: `seed-question-ie-${item.code}`,
        countryId,
        code: item.code,
        question: item.question,
        shortLabel: item.shortLabel ?? null,
        description: item.description ?? null,
        type: item.type,
        required: item.required,
        sortOrder: index,
        ...(item.showIf
          ? {
              showIf: {
                questionCode: item.showIf.questionCode,
                equalsAnyOf: [...item.showIf.equalsAnyOf],
              },
            }
          : {}),
      },
    });
    for (const [optionIndex, option] of (item.options ?? []).entries()) {
      await tx.questionOption.upsert({
        where: {
          questionId_value: { questionId: question.id, value: option.value },
        },
        update: {},
        create: {
          questionId: question.id,
          value: option.value,
          label: option.label,
          description: option.description ?? null,
          sortOrder: optionIndex,
        },
      });
    }
  }
}
