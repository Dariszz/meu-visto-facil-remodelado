import "server-only";
import type { RecommendationDestination } from "@/features/destinations/registry";
import { listMyOpenProcessesByVisa } from "@/features/processes/application/process-service";
import { processHref } from "@/features/processes/presentation";
import { getQuestionnaire } from "@/features/questionnaire/application/questionnaire-service";
import { listChecklistReadyVisaSlugs } from "@/lib/db/repositories/checklist-catalog-repository";
import { listRecommendationVisas } from "@/lib/db/repositories/visa-repository";
import { evaluateDestination } from "../engine/evaluate";
import { presentProfileFacts, presentRecommendation } from "../engine/present";
import type { ProfileFact, RecommendationView } from "../types";

export type RecommendationsResult =
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "QUESTIONNAIRE_REQUIRED" }
  | {
      kind: "READY";
      recommendations: RecommendationView[];
      profileFacts: ProfileFact[];
    };

// Serviço de aplicação (ADR 0004): respostas do próprio usuário, regras
// determinísticas e view models prontos. Sem IA nesta etapa.
export async function getRecommendations(
  destination: RecommendationDestination,
): Promise<RecommendationsResult> {
  const questionnaire = await getQuestionnaire(destination);
  if (questionnaire.kind === "PROFILE_REQUIRED") return questionnaire;
  if (questionnaire.kind !== "READY" || !questionnaire.complete)
    return { kind: "QUESTIONNAIRE_REQUIRED" };
  const [visas, readySlugs, openProcesses] = await Promise.all([
    listRecommendationVisas(destination),
    listChecklistReadyVisaSlugs(destination),
    listMyOpenProcessesByVisa(destination),
  ]);
  const metaBySlug = new Map(visas.map((visa) => [visa.slug, visa]));
  return {
    kind: "READY",
    recommendations: evaluateDestination(
      destination,
      questionnaire.profile,
    ).flatMap((result) => {
      const open = openProcesses.get(result.visaSlug);
      const view = presentRecommendation(
        destination,
        result,
        metaBySlug.get(result.visaSlug),
        open
          ? { kind: "OPEN", href: processHref(open) }
          : readySlugs.includes(result.visaSlug)
            ? { kind: "START" }
            : null,
      );
      return view ? [view] : [];
    }),
    profileFacts: presentProfileFacts(
      questionnaire.questions,
      questionnaire.answers,
    ),
  };
}
