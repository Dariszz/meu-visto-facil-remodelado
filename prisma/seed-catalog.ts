import "server-only";
import type { Prisma } from "../src/lib/db/generated/client";
import {
  criticalSkills,
  criticalSkillsSources,
} from "./seed-data/critical-skills";
import { seedCountryContent } from "./seed-countries";
import { destinationContents } from "./seed-data/countries";
import { irelandContent } from "./seed-data/countries/ireland";
import {
  irelandQuestions,
  questionsForDestination,
  seedQuestions,
} from "./seed-questions";

const requirementCodes = [
  "employment-offer",
  "occupation-remuneration",
  "qualifications",
  "employer-conditions",
] as const;

// Etapas do caminho (Fase 21): mesmo texto das etapas aprovadas na Fase 5,
// agora também como requisitos de ação para compor o checklist.
const stepRequirements = [
  {
    code: "submit-application",
    step: 1,
    title: "Preparar e enviar a solicitação",
    category: "APPLICATION",
    importance: "CRITICAL",
  },
  {
    code: "entry-visa-check",
    step: 2,
    title: "Verificar a necessidade de visto de entrada",
    category: "ENTRY",
    importance: "HIGH",
  },
  {
    code: "register-residence",
    step: 3,
    title: "Registrar a permissão de residência",
    category: "AFTER_ARRIVAL",
    importance: "HIGH",
  },
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
    for (const step of stepRequirements) {
      const editorial = criticalSkills.steps[step.step];
      if (!editorial) throw new Error("SEED_MAPPING_INVALID");
      if (editorial.source !== key) continue;
      const requirement = await tx.visaRequirement.upsert({
        where: { visaId_code: { visaId: visa.id, code: step.code } },
        update: {},
        create: {
          id: `seed-requirement-ie-${step.code}`,
          visaId: visa.id,
          code: step.code,
          title: step.title,
          description: editorial.text,
          category: step.category,
          requirementType: "ACTION",
          importance: step.importance,
          isMandatory: true,
          sourceControlled: true,
          reviewStatus: "REVIEWED",
          sortOrder: requirementCodes.length + step.step,
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
  await seedQuestions(tx, country.id, "IE", irelandQuestions);
  await seedCountryContent(tx, irelandContent, { keepCountryStatus: true });
  for (const content of destinationContents) {
    await seedCountryContent(tx, content);
    const destination = await tx.country.findUniqueOrThrow({
      where: { code: content.code },
      select: { id: true },
    });
    await seedQuestions(
      tx,
      destination.id,
      content.code,
      questionsForDestination(content),
    );
  }
}
