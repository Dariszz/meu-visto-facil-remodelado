import {
  formatAnswer,
  getVisibleQuestions,
} from "@/features/questionnaire/flow";
import type { Answers, QuestionView } from "@/features/questionnaire/types";
import type { ProfileFact, RecommendationView } from "../types";
import type { RecommendationResult } from "./evaluate";

const dete = {
  authority: "Department of Enterprise, Tourism and Employment (DETE)",
};

// Metadados de apresentação por visto. Critical Skills tem conteúdo revisado
// e página própria; General Employment ainda não.
const visaMeta: Record<
  string,
  Pick<
    RecommendationView,
    "visaName" | "categoryName" | "summary" | "sources" | "detailsHref"
  >
> = {
  "critical-skills-employment-permit": {
    visaName: "Critical Skills Employment Permit",
    categoryName: "Trabalho",
    summary:
      "Permissão de trabalho voltada a profissionais altamente qualificados, vinculada a uma oferta de emprego na Irlanda.",
    sources: [
      {
        id: "dete-critical-skills",
        title: "Critical Skills Employment Permit",
        ...dete,
      },
    ],
    detailsHref: "/ireland/visas/critical-skills-employment-permit",
  },
  "general-employment-permit": {
    visaName: "General Employment Permit",
    categoryName: "Trabalho",
    summary:
      "Permissão de trabalho para uma gama mais ampla de ocupações, também vinculada a oferta de emprego. Conteúdo detalhado em revisão.",
    sources: [
      {
        id: "dete-general-employment",
        title: "General Employment Permit",
        ...dete,
      },
    ],
    detailsHref: null,
  },
};

export function presentRecommendation(
  result: RecommendationResult,
  process: RecommendationView["process"] = null,
): RecommendationView {
  const meta = visaMeta[result.visaSlug];
  if (!meta) throw new Error("RECOMMENDATION_VISA_UNKNOWN");
  return {
    visaSlug: result.visaSlug,
    ...meta,
    compatibility: result.compatibility,
    matchedCriteria: result.matchedCriteria,
    missingCriteria: result.missingCriteria,
    blockers: result.blockers,
    // Não recomendado nunca oferece iniciar processo.
    process:
      result.compatibility === "NOT_RECOMMENDED" && process?.kind === "START"
        ? null
        : process,
  };
}

export function presentProfileFacts(
  questions: readonly QuestionView[],
  answers: Answers,
): ProfileFact[] {
  return getVisibleQuestions(questions, answers).map((question) => ({
    label: question.shortLabel ?? question.question,
    value: formatAnswer(question, answers[question.code]),
  }));
}
