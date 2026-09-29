import "server-only";
import type { CatalogSource } from "@/features/visas/catalog-types";
import { safeSourceLink } from "@/features/sources/source-link-policy";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import { catalogSlug, publicQuery } from "./public-query";

export async function listPublicVisaSources(
  countrySlug: string,
  visaSlug: string,
  db?: Prisma.TransactionClient,
): Promise<CatalogSource[]> {
  if (
    ![countrySlug, visaSlug].every(
      (value) => catalogSlug.safeParse(value).success,
    )
  )
    return [];
  return publicQuery(async () => {
    const visa = {
      slug: visaSlug,
      status: "ACTIVE" as const,
      country: { slug: countrySlug, status: "ACTIVE" as const },
    };
    const sources = await (db ?? getDatabaseClient()).officialSource.findMany({
      where: {
        country: { slug: countrySlug, status: "ACTIVE" },
        status: { not: "ARCHIVED" },
        OR: [
          { visas: { some: { visa } } },
          { requirements: { some: { requirement: { visa } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        authority: true,
        url: true,
        hostname: true,
        status: true,
        editorialConsultedAt: true,
        lastVerifiedAt: true,
        lastSuccessfulVerificationAt: true,
      },
      orderBy: [{ title: "asc" }, { id: "asc" }],
      take: 101,
    });
    if (sources.length > 100) throw new Error("CATALOG_SOURCE_LIMIT_EXCEEDED");
    return sources.flatMap((source) =>
      source.status === "ARCHIVED"
        ? []
        : [
            {
              id: source.id,
              title: source.title,
              authority: source.authority,
              hostname: source.hostname,
              status: source.status,
              url:
                source.status === "ACTIVE"
                  ? safeSourceLink(source.url, source.hostname)
                  : null,
              consultedAt:
                source.editorialConsultedAt?.toISOString().slice(0, 10) ?? null,
              lastVerifiedAt: source.lastVerifiedAt?.toISOString() ?? null,
              lastSuccessfulVerificationAt:
                source.lastSuccessfulVerificationAt?.toISOString() ?? null,
            },
          ],
    );
  });
}
