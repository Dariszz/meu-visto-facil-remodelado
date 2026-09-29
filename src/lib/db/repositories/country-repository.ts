import "server-only";
import type { Country } from "@/features/visas/types";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import { catalogSlug, publicQuery } from "./public-query";

export async function findPublicCountry(
  slug: string,
  db?: Prisma.TransactionClient,
): Promise<Country | null> {
  if (!catalogSlug.safeParse(slug).success) return null;
  return publicQuery(() =>
    (db ?? getDatabaseClient()).country.findFirst({
      where: { slug, status: "ACTIVE" },
      select: { code: true, slug: true, name: true },
    }),
  );
}
