import "server-only";
import { getQuestionnaire } from "@/features/questionnaire/application/questionnaire-service";
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
  return {
    kind: "READY",
    recommendations: evaluateIrelandWorkPaths(questionnaire.profile).map(
      presentRecommendation,
    ),
    profileFacts: presentProfileFacts(
      questionnaire.questions,
      questionnaire.answers,
    ),
    pendingCategories: ["Estudo", "Família"],
  };
}
