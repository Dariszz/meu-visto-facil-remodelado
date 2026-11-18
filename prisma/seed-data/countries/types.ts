// Conteúdo editorial de um destino: só fontes oficiais, resumo em português
// com as palavras do projeto. Tudo aqui é publicado como REVIEWED; a data de
// consulta fica registrada em cada fonte e no visto.

export type CategorySlug =
  "work" | "study" | "family" | "remote-work" | "residence" | "job-search";

export type ContentRequirement = {
  code: string;
  title: string;
  description: string;
  category:
    | "IDENTITY"
    | "FINANCIAL"
    | "EDUCATION"
    | "EMPLOYMENT"
    | "FAMILY"
    | "HEALTH"
    | "OTHER";
  importance?: "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
  // Chave de `sources` do destino.
  source: string;
};

export type ContentStep = {
  code: string;
  title: string;
  description: string;
  category: "APPLICATION" | "ENTRY" | "AFTER_ARRIVAL";
  importance?: "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
  source: string;
};

export type ContentVisa = {
  slug: string;
  name: string;
  officialName?: string;
  authority: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  // Fonte principal da visão geral (OVERVIEW) e demais fontes citadas.
  overviewSource: string;
  requirements: ContentRequirement[];
  steps: ContentStep[];
};

export type ContentSource = {
  title: string;
  authority: string;
  url: string;
};

export type CountryContent = {
  code: string;
  slug: string;
  name: string;
  // Data da consulta editorial às fontes (AAAA-MM-DD).
  consultedAt: string;
  coverageLevel: "FULL" | "PARTIAL";
  sources: Record<string, ContentSource>;
  visas: ContentVisa[];
};
