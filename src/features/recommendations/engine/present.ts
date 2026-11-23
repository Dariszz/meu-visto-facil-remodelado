import {
  formatAnswer,
  getVisibleQuestions,
} from "@/features/questionnaire/flow";
import type { Answers, QuestionView } from "@/features/questionnaire/types";
import { visaPageHref } from "@/features/visas/visa-routes";
import type { ProfileFact, RecommendationView } from "../types";
import type { RecommendationResult } from "./evaluate";

export type RecommendationVisaMeta = {
  slug: string;
  name: string;
  categoryName: string;
  shortDescription: string;
  sources: { id: string; title: string; authority: string }[];
};

// Junta o resultado das regras com os dados públicos do visto revisado.
// Visto sem conteúdo publicado não aparece (devolve null).
export function presentRecommendation(
  countrySlug: string,
  result: RecommendationResult,
  meta: RecommendationVisaMeta | undefined,
  process: RecommendationView["process"] = null,
): RecommendationView | null {
  if (!meta) return null;
  return {
    visaSlug: result.visaSlug,
    visaName: meta.name,
    categoryName: meta.categoryName,
    summary: meta.shortDescription,
    sources: meta.sources,
    detailsHref: visaPageHref(countrySlug, result.visaSlug),
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
