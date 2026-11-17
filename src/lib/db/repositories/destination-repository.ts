import "server-only";
import type {
  DestinationDetail,
  DestinationSummary,
} from "@/features/destinations/types";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import {
  publicSourceSelect,
  toCatalogSource,
} from "./official-source-repository";
import { catalogSlug, publicQuery } from "./public-query";

const publishedDestination = {
  status: "ACTIVE",
  coverageLevel: { not: "NONE" },
} satisfies Prisma.CountryWhereInput;

const destinationSelect = {
  code: true,
  slug: true,
  name: true,
  coverageLevel: true,
} satisfies Prisma.CountrySelect;

export async function listPublicDestinations(
  db?: Prisma.TransactionClient,
): Promise<DestinationSummary[]> {
  return publicQuery(() =>
    (db ?? getDatabaseClient()).country.findMany({
      where: publishedDestination,
      select: destinationSelect,
      orderBy: [{ name: "asc" }, { code: "asc" }],
      take: 300,
    }),
  );
}

export async function findPublicDestination(
  slug: string,
  db?: Prisma.TransactionClient,
): Promise<DestinationDetail | null> {
  if (!catalogSlug.safeParse(slug).success) return null;
  return publicQuery(async () => {
    const country = await (db ?? getDatabaseClient()).country.findFirst({
      where: { ...publishedDestination, slug },
      select: {
        ...destinationSelect,
        sources: {
          where: { status: { not: "ARCHIVED" } },
          select: publicSourceSelect,
          orderBy: [{ authority: "asc" }, { title: "asc" }, { id: "asc" }],
          take: 101,
        },
      },
    });
    if (!country) return null;
    // Nunca cortar fontes oficiais em silêncio.
    if (country.sources.length > 100)
      throw new Error("CATALOG_SOURCE_LIMIT_EXCEEDED");
    return { ...country, sources: country.sources.flatMap(toCatalogSource) };
  });
}
