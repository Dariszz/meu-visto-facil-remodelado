import "server-only";
import { listMyOpenProcessesByVisa } from "@/features/processes/application/process-service";
import { processHref } from "@/features/processes/presentation";
import { getQuestionnaire } from "@/features/questionnaire/application/questionnaire-service";
import { listChecklistReadyVisaSlugs } from "@/lib/db/repositories/checklist-catalog-repository";
import { evaluateIrelandWorkPaths } from "../engine/evaluate";
import { presentProfileFacts, presentRecommendation } from "../engine/present";
import type { ProfileFact, RecommendationView } from "../types";

export type RecommendationsResult =
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "QUESTIONNAIRE_REQUIRED" }
  | {
      kind: "READY";
      recommendations: RecommendationView[];
      profileFacts: ProfileFact[];
      pendingCategories: string[];
    };

// Serviço de aplicação (ADR 0004): respostas do próprio usuário, regras
// determinísticas e view models prontos. Sem IA nesta fase.
export async function getRecommendations(): Promise<RecommendationsResult> {
  const questionnaire = await getQuestionnaire("ireland");
  if (questionnaire.kind === "PROFILE_REQUIRED") return questionnaire;
  if (questionnaire.kind !== "READY" || !questionnaire.complete)
    return { kind: "QUESTIONNAIRE_REQUIRED" };
  const [readySlugs, openProcesses] = await Promise.all([
    listChecklistReadyVisaSlugs("ireland"),
    listMyOpenProcessesByVisa(),
  ]);
  return {
    kind: "READY",
    recommendations: evaluateIrelandWorkPaths(questionnaire.profile).map(
      (result) => {
        const open = openProcesses.get(result.visaSlug);
        return presentRecommendation(
          result,
          open
            ? { kind: "OPEN", href: processHref(open) }
            : readySlugs.includes(result.visaSlug)
              ? { kind: "START" }
              : null,
        );
      },
    ),
    profileFacts: presentProfileFacts(
      questionnaire.questions,
      questionnaire.answers,
    ),
    pendingCategories: ["Estudo", "Família"],
  };
}
