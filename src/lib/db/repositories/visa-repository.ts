import "server-only";
import type {
  CatalogVisa,
  CatalogVisaSummary,
} from "@/features/visas/catalog-types";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import { catalogSlug, publicQuery } from "./public-query";

const summarySelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  category: { select: { slug: true, name: true } },
} satisfies Prisma.VisaSelect;

// Todos os vistos publicados de um destino, para a página do país.
export async function listPublicVisasForCountry(
  countrySlug: string,
  db?: Prisma.TransactionClient,
): Promise<CatalogVisaSummary[]> {
  if (!catalogSlug.safeParse(countrySlug).success) return [];
  return publicQuery(() =>
    (db ?? getDatabaseClient()).visa.findMany({
      where: {
        status: "ACTIVE",
        reviewStatus: "REVIEWED",
        country: { slug: countrySlug, status: "ACTIVE" },
      },
      select: summarySelect,
      orderBy: [
        { category: { slug: "asc" } },
        { name: "asc" },
        { slug: "asc" },
      ],
      take: 100,
    }),
  );
}

export async function listPublicVisas(
  countrySlug: string,
  categorySlug: string,
  db?: Prisma.TransactionClient,
): Promise<CatalogVisaSummary[]> {
  if (
    ![countrySlug, categorySlug].every(
      (value) => catalogSlug.safeParse(value).success,
    )
  )
    return [];
  return publicQuery(() =>
    (db ?? getDatabaseClient()).visa.findMany({
      where: {
        status: "ACTIVE",
        country: { slug: countrySlug, status: "ACTIVE" },
        category: { slug: categorySlug },
      },
      select: summarySelect,
      orderBy: [{ name: "asc" }, { slug: "asc" }],
      take: 50,
    }),
  );
}

export async function findPublicVisa(
  countrySlug: string,
  slug: string,
  db?: Prisma.TransactionClient,
): Promise<CatalogVisa | null> {
  if (
    ![countrySlug, slug].every((value) => catalogSlug.safeParse(value).success)
  )
    return null;
  return publicQuery(async () => {
    const sourceWhere = {
      status: { not: "ARCHIVED" as const },
      country: { slug: countrySlug, status: "ACTIVE" as const },
    };
    const visa = await (db ?? getDatabaseClient()).visa.findFirst({
      where: {
        slug,
        status: "ACTIVE",
        country: { slug: countrySlug, status: "ACTIVE" },
      },
      select: {
        ...summarySelect,
        description: true,
        officialName: true,
        authorityName: true,
        country: { select: { code: true, slug: true, name: true } },
        requirements: {
          // Só conteúdo revisado chega à página pública (ADR 0001). Condições
          // viram "Principais requisitos"; ações (ACTION) viram "Etapas".
          where: { reviewStatus: "REVIEWED" },
          orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
          take: 201,
          select: {
            code: true,
            title: true,
            description: true,
            requirementType: true,
            sources: {
              where: { source: sourceWhere },
              orderBy: { sourceId: "asc" },
              take: 21,
              select: { sourceId: true, relationType: true },
            },
          },
        },
        sources: {
          where: { source: sourceWhere },
          orderBy: { sourceId: "asc" },
          take: 51,
          select: { sourceId: true, relationType: true },
        },
      },
    });
    if (!visa) return null;
    // Never silently truncate official requirements or their references.
    if (
      visa.requirements.length > 200 ||
      visa.sources.length > 50 ||
      visa.requirements.some((item) => item.sources.length > 20)
    ) {
      throw new Error("CATALOG_DETAIL_LIMIT_EXCEEDED");
    }
    const items = visa.requirements.map(
      ({ description, requirementType, ...item }) => ({
        ...item,
        text: description,
        isStep: requirementType === "ACTION",
      }),
    );
    const pick = (step: boolean) =>
      items
        .filter((item) => item.isStep === step)
        .map((item) => ({
          code: item.code,
          title: item.title,
          text: item.text,
          sources: item.sources,
        }));
    return { ...visa, requirements: pick(false), steps: pick(true) };
  });
}

export type RecommendationVisa = {
  slug: string;
  name: string;
  categoryName: string;
  shortDescription: string;
  sources: { id: string; title: string; authority: string }[];
};

// Dados públicos dos vistos revisados de um destino, para apresentar as
// recomendações (nome, categoria, resumo e fontes oficiais citadas).
export async function listRecommendationVisas(
  countrySlug: string,
  db?: Prisma.TransactionClient,
): Promise<RecommendationVisa[]> {
  if (!catalogSlug.safeParse(countrySlug).success) return [];
  return publicQuery(async () => {
    const rows = await (db ?? getDatabaseClient()).visa.findMany({
      where: {
        status: "ACTIVE",
        reviewStatus: "REVIEWED",
        country: { slug: countrySlug, status: "ACTIVE" },
      },
      select: {
        slug: true,
        name: true,
        shortDescription: true,
        category: { select: { name: true } },
        sources: {
          where: { source: { status: { not: "ARCHIVED" } } },
          select: {
            source: { select: { id: true, title: true, authority: true } },
          },
          orderBy: { sourceId: "asc" },
          take: 20,
        },
      },
      orderBy: [{ name: "asc" }, { slug: "asc" }],
      take: 100,
    });
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      categoryName: row.category.name,
      shortDescription: row.shortDescription,
      sources: row.sources.map((link) => link.source),
    }));
  });
}
