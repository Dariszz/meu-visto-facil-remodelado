import type { VisaCategory, VisaSummary } from "../types";

// Introduções editoriais e caminhos ainda em preparação. Fatos publicados vêm do banco.

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

export const editorialVisaPreviews: readonly VisaSummary[] = [
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
