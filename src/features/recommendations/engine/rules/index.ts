import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import type { RecommendationDestination } from "@/features/destinations/registry";
import type { RecommendationResult } from "../kit";
import { AUSTRALIA_RULES, evaluateAustralia } from "./australia";
import { CANADA_RULES, evaluateCanada } from "./canada";
import { evaluateGermany, GERMANY_RULES } from "./germany";
import { evaluateIreland, IRELAND_RULES } from "./ireland";
import { evaluateItaly, ITALY_RULES } from "./italy";
import { evaluateNetherlands, NETHERLANDS_RULES } from "./netherlands";
import { evaluatePortugal, PORTUGAL_RULES } from "./portugal";
import { evaluateSpain, SPAIN_RULES } from "./spain";
import { evaluateUnitedKingdom, UNITED_KINGDOM_RULES } from "./united-kingdom";
import { evaluateUnitedStates, UNITED_STATES_RULES } from "./united-states";

// Regras determinísticas por destino (Recommendation Engine V2). Sem IA.
export const destinationRules: Record<
  RecommendationDestination,
  {
    version: string;
    evaluate: (profile: ImmigrationProfile) => RecommendationResult[];
  }
> = {
  ireland: { version: IRELAND_RULES, evaluate: evaluateIreland },
  portugal: { version: PORTUGAL_RULES, evaluate: evaluatePortugal },
  spain: { version: SPAIN_RULES, evaluate: evaluateSpain },
  italy: { version: ITALY_RULES, evaluate: evaluateItaly },
  germany: { version: GERMANY_RULES, evaluate: evaluateGermany },
  netherlands: { version: NETHERLANDS_RULES, evaluate: evaluateNetherlands },
  "united-kingdom": {
    version: UNITED_KINGDOM_RULES,
    evaluate: evaluateUnitedKingdom,
  },
  canada: { version: CANADA_RULES, evaluate: evaluateCanada },
  "united-states": {
    version: UNITED_STATES_RULES,
    evaluate: evaluateUnitedStates,
  },
  australia: { version: AUSTRALIA_RULES, evaluate: evaluateAustralia },
};
