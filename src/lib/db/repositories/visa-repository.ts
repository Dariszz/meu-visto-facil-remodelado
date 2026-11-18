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
        country: { select: { code: true, slug: true, name: true } },
        requirements: {
          // Só conteúdo revisado chega à página pública (ADR 0001). As etapas
          // (ACTION) aparecem no checklist; a página já as mostra em "Etapas".
          where: {
            reviewStatus: "REVIEWED",
            requirementType: { not: "ACTION" },
          },
          orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
          take: 201,
          select: {
            code: true,
            title: true,
            description: true,
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
    return {
      ...visa,
      requirements: visa.requirements.map(({ description, ...item }) => ({
        ...item,
        text: description,
      })),
    };
  });
}
