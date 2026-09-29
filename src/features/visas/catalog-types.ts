import type { Country } from "./types";

export type CatalogVisaSummary = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: { slug: string; name: string };
};
export type CatalogSource = {
  id: string;
  title: string;
  authority: string;
  hostname: string;
  url: string | null;
  status: "ACTIVE" | "TEMPORARILY_UNAVAILABLE" | "BROKEN";
  consultedAt: string | null;
  lastVerifiedAt: string | null;
  lastSuccessfulVerificationAt: string | null;
};
export type CatalogVisa = CatalogVisaSummary & {
  country: Country;
  description: string | null;
  requirements: {
    code: string;
    title: string;
    text: string;
    sources: { sourceId: string; relationType: "PRIMARY" | "SUPPORTING" }[];
  }[];
  sources: {
    sourceId: string;
    relationType: "OVERVIEW" | "APPLICATION" | "FEES" | "OFFICIAL_GUIDE";
  }[];
};
