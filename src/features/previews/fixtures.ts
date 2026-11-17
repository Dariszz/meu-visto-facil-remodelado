// DADOS DE EXEMPLO — usados somente nas rotas /preview para validar a
// interface antes das fases de questionário, recomendação e checklist.
// Não representam conta, perfil ou análise real. Textos sobre Critical Skills
// reaproveitam a consulta editorial de 10/09/2026 (prisma/seed-data); General
// Employment não tem conteúdo revisado e aparece só com critérios genéricos.
import type {
  ChecklistSourceRef,
  ProcessDetailView,
} from "@/features/checklists/types";
import { findNextChecklistItem } from "@/features/checklists/progress";
import type { DashboardView } from "@/features/dashboard/types";
import { irelandQuestions } from "@/features/questionnaire/data/ireland-questions";
import type {
  ProfileFact,
  RecommendationView,
} from "@/features/recommendations/types";

export const previewLinks = {
  index: "/preview",
  dashboard: "/preview/dashboard",
  dashboardEmpty: "/preview/dashboard?estado=vazio",
  questionnaire: "/preview/questionnaire",
  recommendations: "/preview/recommendations",
  recommendationsNoOffer: "/preview/recommendations?cenario=sem-oferta",
  process: "/preview/processes/exemplo",
  states: "/preview/estados",
  explore: "/ireland",
  criticalSkills: "/ireland/visas/critical-skills-employment-permit",
} as const;

const sources = {
  permit: {
    id: "permit",
    title: "Critical Skills Employment Permit",
    authority: "Department of Enterprise, Tourism and Employment (DETE)",
    hostname: "enterprise.gov.ie",
  },
  entry: {
    id: "entry",
    title: "Coming to work in Ireland",
    authority: "Immigration Service Delivery (ISD)",
    hostname: "www.irishimmigration.ie",
  },
  residence: {
    id: "residence",
    title: "Registering your immigration permission",
    authority: "Immigration Service Delivery (ISD)",
    hostname: "www.irishimmigration.ie",
  },
} satisfies Record<string, ChecklistSourceRef>;

export const exampleQuestions = irelandQuestions;

export const exampleProfileFacts: readonly ProfileFact[] = [
  { label: "Objetivo", value: "Trabalhar" },
  { label: "Passaporte", value: "Outro país" },
  { label: "Oferta de emprego", value: "Sim, por dois anos ou mais" },
  { label: "Área", value: "Tecnologia" },
  { label: "Formação", value: "Graduação" },
];

export const exampleProfileFactsNoOffer: readonly ProfileFact[] = [
  { label: "Objetivo", value: "Trabalhar" },
  { label: "Passaporte", value: "Outro país" },
  { label: "Oferta de emprego", value: "Ainda não" },
  { label: "Área", value: "Tecnologia" },
];

const criticalSkillsRecommendation: RecommendationView = {
  visaSlug: "critical-skills-employment-permit",
  visaName: "Critical Skills Employment Permit",
  categoryName: "Trabalho",
  summary:
    "Permissão de trabalho voltada a profissionais altamente qualificados, vinculada a uma oferta de emprego na Irlanda.",
  compatibility: "HIGH",
  matchedCriteria: [
    "Você pretende trabalhar na Irlanda.",
    "Você informou uma oferta de emprego.",
    "A oferta prevista é de dois anos ou mais.",
  ],
  missingCriteria: [
    "Se a ocupação e a remuneração estão dentro dos critérios vigentes.",
    "Se suas qualificações e experiência atendem ao enquadramento.",
    "Se o empregador atende às condições oficiais.",
  ],
  blockers: [],
  sources: [sources.permit],
  detailsHref: previewLinks.criticalSkills,
  startProcessHref: previewLinks.process,
};

export const exampleRecommendations: readonly RecommendationView[] = [
  {
    visaSlug: "general-employment-permit",
    visaName: "General Employment Permit",
    categoryName: "Trabalho",
    summary:
      "Outro caminho de trabalho com oferta de emprego. O conteúdo detalhado ainda está em revisão pela plataforma.",
    compatibility: "MEDIUM",
    matchedCriteria: [
      "Você pretende trabalhar na Irlanda.",
      "Você informou uma oferta de emprego.",
    ],
    missingCriteria: [
      "Requisitos detalhados ainda em revisão pela plataforma.",
    ],
    blockers: [],
    sources: [],
    detailsHref: null,
    startProcessHref: null,
  },
  criticalSkillsRecommendation,
];

export const exampleRecommendationsNoOffer: readonly RecommendationView[] = [
  {
    ...criticalSkillsRecommendation,
    compatibility: "LOW",
    matchedCriteria: ["Você pretende trabalhar na Irlanda."],
    missingCriteria: [
      "Se a ocupação e a remuneração de uma futura oferta estariam dentro dos critérios vigentes.",
    ],
    blockers: [
      "Este caminho depende de uma oferta de emprego de empregador na Irlanda, e você informou que ainda não tem uma.",
    ],
    startProcessHref: null,
  },
];

export const pendingCategories = ["Estudo", "Família"] as const;

export const exampleProcess: ProcessDetailView = {
  id: "exemplo",
  title: "Minha mudança com Critical Skills",
  visaName: "Critical Skills Employment Permit",
  visaHref: previewLinks.criticalSkills,
  countryName: "Irlanda",
  status: "ACTIVE",
  startedAt: "2026-10-02T00:00:00.000Z",
  referenceDate: "2026-09-10T00:00:00.000Z",
  sources: Object.values(sources),
  categories: [
    {
      id: "requirements",
      title: "Requisitos",
      items: [
        {
          id: "offer",
          title: "Conferir a oferta de emprego",
          description:
            "Oferta por pelo menos dois anos, de empregador estabelecido e em atividade na Irlanda.",
          status: "COMPLETED",
          priority: "CRITICAL",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["permit"],
        },
        {
          id: "occupation",
          title: "Conferir ocupação e remuneração",
          description:
            "O enquadramento depende da ocupação e da remuneração proposta. Confira as listas e os limites vigentes na fonte oficial.",
          status: "IN_PROGRESS",
          priority: "CRITICAL",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["permit"],
        },
        {
          id: "qualifications",
          title: "Reunir comprovantes de qualificação e experiência",
          description:
            "São exigidas qualificações, habilidades e experiência pertinentes. A exigência de diploma depende do enquadramento.",
          status: "PENDING",
          priority: "HIGH",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["permit"],
        },
        {
          id: "employer",
          title: "Confirmar as condições do empregador",
          description:
            "O empregador também deve atender aos critérios oficiais de registro e composição de sua equipe, sujeitos a exceções.",
          status: "PENDING",
          priority: "HIGH",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["permit"],
        },
      ],
    },
    {
      id: "application",
      title: "Solicitação",
      items: [
        {
          id: "folder",
          title: "Separar os documentos em uma pasta",
          description:
            "Item pessoal de organização. Não faz parte dos requisitos oficiais.",
          status: "COMPLETED",
          priority: "LOW",
          isMandatory: false,
          isOfficial: false,
          sourceIds: [],
        },
        {
          id: "apply",
          title: "Preparar e enviar a solicitação",
          description:
            "Consulte a documentação exigida. Profissional ou empregador pode solicitar pelo Employment Permits Online, sujeito à análise oficial.",
          status: "PENDING",
          priority: "CRITICAL",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["permit"],
        },
      ],
    },
    {
      id: "entry",
      title: "Entrada no país",
      items: [
        {
          id: "entry-visa",
          title: "Verificar a necessidade de visto de entrada",
          description:
            "Após obter a permissão de trabalho, confira com o ISD se precisa de visto de entrada e quais condições se aplicam à viagem.",
          status: "PENDING",
          priority: "HIGH",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["entry"],
        },
      ],
    },
    {
      id: "after-arrival",
      title: "Após a chegada",
      items: [
        {
          id: "register",
          title: "Registrar a permissão de residência",
          description:
            "Após a chegada, siga as orientações do ISD para registrar a permissão de residência quando exigido.",
          status: "PENDING",
          priority: "HIGH",
          isMandatory: true,
          isOfficial: true,
          sourceIds: ["residence"],
        },
      ],
    },
  ],
};

const processItems = exampleProcess.categories.flatMap(
  (category) => category.items,
);

export const exampleDashboard: DashboardView = {
  displayName: "Marina",
  hasCompletedQuestionnaire: true,
  processes: [
    {
      id: exampleProcess.id,
      title: exampleProcess.title,
      visaName: exampleProcess.visaName,
      countryName: exampleProcess.countryName,
      status: "ACTIVE",
      itemStatuses: processItems.map((item) => item.status),
      nextStep: findNextChecklistItem(processItems)?.title ?? null,
      updatedAt: "2026-11-14T00:00:00.000Z",
      href: previewLinks.process,
    },
    {
      id: "pausado",
      title: "Plano alternativo: General Employment",
      visaName: "General Employment Permit",
      countryName: "Irlanda",
      status: "PAUSED",
      itemStatuses: [
        "COMPLETED",
        "PENDING",
        "PENDING",
        "PENDING",
        "PENDING",
        "PENDING",
      ],
      nextStep: null,
      updatedAt: "2026-10-20T00:00:00.000Z",
      href: previewLinks.process,
    },
  ],
};

export const emptyDashboard: DashboardView = {
  displayName: "Marina",
  hasCompletedQuestionnaire: false,
  processes: [],
};
