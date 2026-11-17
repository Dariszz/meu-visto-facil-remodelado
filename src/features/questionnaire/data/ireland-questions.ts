import type { QuestionView } from "../types";

// Perguntas do perfil migratório para a Irlanda. Fonte única para o seed do
// banco e para as prévias. Os códigos são contrato com normalizeProfile().
export const irelandQuestions: readonly QuestionView[] = [
  {
    code: "objective",
    shortLabel: "Objetivo",
    question: "Qual é o seu principal objetivo na Irlanda?",
    description: "Isso define quais caminhos vamos analisar primeiro.",
    type: "SINGLE_SELECT",
    required: true,
    options: [
      {
        value: "work",
        label: "Trabalhar",
        description: "Emprego ou mudança de carreira.",
      },
      {
        value: "study",
        label: "Estudar",
        description: "Cursos, graduação ou pós.",
      },
      {
        value: "family",
        label: "Morar com familiares",
        description: "Reunião ou acompanhamento familiar.",
      },
      {
        value: "exploring",
        label: "Ainda estou explorando",
        description: "Quero entender as possibilidades.",
      },
    ],
  },
  {
    code: "region",
    shortLabel: "Passaporte",
    question: "De onde é o seu passaporte?",
    description:
      "Algumas exigências de entrada mudam conforme a nacionalidade. Não pedimos o número do documento.",
    type: "SINGLE_SELECT",
    required: true,
    options: [
      {
        value: "eea",
        label: "União Europeia, Espaço Econômico Europeu ou Suíça",
      },
      { value: "uk", label: "Reino Unido" },
      {
        value: "other",
        label: "Outro país",
        description: "Por exemplo, Brasil.",
      },
    ],
  },
  {
    code: "has_employment_offer",
    shortLabel: "Oferta de emprego",
    question: "Você já tem uma oferta de emprego na Irlanda?",
    type: "BOOLEAN",
    required: true,
    showIf: { questionCode: "objective", equalsAnyOf: ["work", "exploring"] },
  },
  {
    code: "offer_duration",
    shortLabel: "Duração da oferta",
    question: "Qual é a duração prevista da oferta?",
    type: "SINGLE_SELECT",
    required: true,
    options: [
      { value: "under_2y", label: "Menos de dois anos" },
      { value: "2y_plus", label: "Dois anos ou mais" },
      { value: "unknown", label: "Ainda não sei" },
    ],
    showIf: { questionCode: "has_employment_offer", equalsAnyOf: [true] },
  },
  {
    code: "occupation_area",
    shortLabel: "Área",
    question: "Em qual área você atua?",
    type: "SINGLE_SELECT",
    required: true,
    options: [
      { value: "technology", label: "Tecnologia" },
      { value: "engineering", label: "Engenharia" },
      { value: "healthcare", label: "Saúde" },
      { value: "education", label: "Educação" },
      { value: "other", label: "Outra área" },
    ],
    showIf: { questionCode: "objective", equalsAnyOf: ["work", "exploring"] },
  },
  {
    code: "education_level",
    shortLabel: "Formação",
    question: "Qual é a sua formação mais alta?",
    type: "SINGLE_SELECT",
    required: false,
    options: [
      { value: "secondary", label: "Ensino médio" },
      { value: "technical", label: "Curso técnico" },
      { value: "degree", label: "Graduação" },
      { value: "postgraduate", label: "Pós-graduação, mestrado ou doutorado" },
    ],
  },
  {
    code: "family_in_country",
    shortLabel: "Familiares na Irlanda",
    question: "Você tem familiares morando legalmente na Irlanda?",
    type: "BOOLEAN",
    required: true,
    showIf: { questionCode: "objective", equalsAnyOf: ["family", "exploring"] },
  },
];
