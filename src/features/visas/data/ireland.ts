import type { VisaCategory, VisaSummary } from "../types";

// Introduções editoriais e caminhos ainda em preparação. Fatos publicados vêm do banco.

export const irelandCategories = {
  work: {
    slug: "work",
    name: "Trabalho",
    description:
      "Autorizações de trabalho ligadas a uma oferta de emprego na Irlanda.",
  },
  study: {
    slug: "study",
    name: "Estudo",
    description:
      "Permissão para estudar em tempo integral, com regras de cursos, recursos e trabalho limitado.",
  },
  family: {
    slug: "family",
    name: "Família",
    description:
      "Reunião com cônjuge, parceiro ou pais que já vivem legalmente na Irlanda.",
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
