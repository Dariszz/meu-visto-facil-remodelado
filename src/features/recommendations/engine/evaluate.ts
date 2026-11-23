import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import type { RecommendationDestination } from "@/features/destinations/registry";
import type { RecommendationResult } from "./kit";
import { destinationRules } from "./rules";

export type { RecommendationResult } from "./kit";

// Recommendation Engine (Fases 16 a 18, ampliada para todos os destinos):
// regras determinísticas, sem IA. Nunca afirma elegibilidade.
export function evaluateDestination(
  destination: RecommendationDestination,
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return destinationRules[destination].evaluate(profile);
}

export function ruleVersionFor(destination: RecommendationDestination) {
  return destinationRules[destination].version;
}
