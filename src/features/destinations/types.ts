import type { CatalogSource } from "@/features/visas/catalog-types";

export type CoverageLevel = "FULL" | "PARTIAL" | "LINKS_ONLY" | "NONE";

export type DestinationSummary = {
  code: string;
  slug: string;
  name: string;
  coverageLevel: CoverageLevel;
};

export type DestinationDetail = DestinationSummary & {
  sources: CatalogSource[];
};

export type DestinationVisa = {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  href: string;
};
