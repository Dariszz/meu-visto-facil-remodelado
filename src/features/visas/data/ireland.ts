import type { Country, VisaCategory, VisaSummary } from "../types";

// Conteúdo editorial local da Fase 4. Substituir pela leitura do catálogo nas
// Fases 6/7; não reutilizar como seed de conteúdo oficial revisado.
export const ireland: Country = {
  code: "IE",
  slug: "ireland",
  name: "Irlanda",
};

export const irelandCategories = {
  work: {
    slug: "work",
    name: "Trabalho",
    description:
      "Comece a explorar os caminhos de trabalho que estamos organizando para a Irlanda.",
  },
  study: {
    slug: "study",
    name: "Estudo",
    description:
      "Um ponto de partida para quem deseja incluir os estudos nos planos para a Irlanda.",
  },
  family: {
    slug: "family",
    name: "Família",
    description:
      "Um espaço para explorar, no futuro, caminhos relacionados a estar perto da família na Irlanda.",
  },
} satisfies Record<VisaCategory["slug"], VisaCategory>;

export const irelandVisaSummaries: readonly VisaSummary[] = [
  {
    slug: "critical-skills-employment-permit",
    countryCode: "IE",
    categorySlug: "work",
    name: "Critical Skills Employment Permit",
    shortDescription:
      "Conheça o nome de um dos caminhos de trabalho previstos no catálogo inicial. A apresentação do Critical Skills será ampliada em breve.",
    type: "Permissão de trabalho",
  },
  {
    slug: "general-employment-permit",
    countryCode: "IE",
    categorySlug: "work",
    name: "General Employment Permit",
    shortDescription:
      "Outra opção prevista na organização inicial dos caminhos de trabalho. A apresentação do General Employment será ampliada em breve.",
    type: "Permissão de trabalho",
  },
];
