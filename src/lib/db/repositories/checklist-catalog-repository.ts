import "server-only";
import type { RequirementForChecklist } from "@/features/processes/checklist/build-base-checklist";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import { catalogSlug, publicQuery } from "./public-query";

export type VisaForChecklist = {
  id: string;
  slug: string;
  name: string;
  lastReviewedAt: Date | null;
  country: { code: string; slug: string; name: string };
  requirements: RequirementForChecklist[];
};

// Só um visto publicado e revisado pode gerar checklist (ADR 0001).
const readyVisaWhere = (countrySlug: string) =>
  ({
    status: "ACTIVE",
    reviewStatus: "REVIEWED",
    country: { slug: countrySlug, status: "ACTIVE" },
    requirements: { some: { reviewStatus: "REVIEWED" } },
  }) satisfies Prisma.VisaWhereInput;

export async function listChecklistReadyVisaSlugs(
  countrySlug: string,
  db?: Prisma.TransactionClient,
): Promise<string[]> {
  if (!catalogSlug.safeParse(countrySlug).success) return [];
  return publicQuery(async () => {
    const rows = await (db ?? getDatabaseClient()).visa.findMany({
      where: readyVisaWhere(countrySlug),
      select: { slug: true },
      orderBy: { slug: "asc" },
      take: 100,
    });
    return rows.map((row) => row.slug);
  });
}

export async function findVisaForChecklist(
  countrySlug: string,
  visaSlug: string,
  db?: Prisma.TransactionClient,
): Promise<VisaForChecklist | null> {
  if (
    ![countrySlug, visaSlug].every(
      (value) => catalogSlug.safeParse(value).success,
    )
  )
    return null;
  return publicQuery(async () => {
    const visa = await (db ?? getDatabaseClient()).visa.findFirst({
      where: { ...readyVisaWhere(countrySlug), slug: visaSlug },
      select: {
        id: true,
        slug: true,
        name: true,
        lastReviewedAt: true,
        country: { select: { code: true, slug: true, name: true } },
        requirements: {
          where: { reviewStatus: "REVIEWED" },
          orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
          take: 200,
          select: {
            id: true,
            code: true,
            title: true,
            description: true,
            category: true,
            importance: true,
            isMandatory: true,
            sortOrder: true,
            sources: {
              // Fonte arquivada não sustenta item novo.
              where: { source: { status: { not: "ARCHIVED" } } },
              orderBy: { sourceId: "asc" },
              select: { sourceId: true },
              take: 20,
            },
          },
        },
      },
    });
    if (!visa) return null;
    return {
      ...visa,
      requirements: visa.requirements.map(({ sources, ...requirement }) => ({
        ...requirement,
        sourceIds: sources.map((link) => link.sourceId),
      })),
    };
  });
}

export type ChecklistSource = {
  id: string;
  title: string;
  authority: string;
  hostname: string;
};

// Dados públicos das fontes citadas por um checklist. Inclui fontes já
// arquivadas para que o histórico do processo continue legível.
export async function listSourcesByIds(
  ids: readonly string[],
  db?: Prisma.TransactionClient,
): Promise<ChecklistSource[]> {
  const unique = [...new Set(ids)].slice(0, 200);
  if (!unique.length) return [];
  return publicQuery(() =>
    (db ?? getDatabaseClient()).officialSource.findMany({
      where: { id: { in: unique } },
      select: { id: true, title: true, authority: true, hostname: true },
      orderBy: { id: "asc" },
    }),
  );
}
