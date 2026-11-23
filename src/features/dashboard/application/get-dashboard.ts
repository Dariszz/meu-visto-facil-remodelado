import "server-only";
import { getCurrentUserProfile } from "@/features/profile/service";
import { listMyProcesses } from "@/features/processes/application/process-service";
import { getQuestionnaireOverview } from "@/features/questionnaire/application/questionnaire-service";
import type { DashboardView } from "../types";

export type DashboardResult =
  { kind: "READY"; view: DashboardView } | { kind: "PROFILE_REQUIRED" };

// Serviço de aplicação do painel (ADR 0004): resolve a identidade no servidor
// e devolve o view model pronto para a tela, com processos e questionário.
export async function getDashboard(): Promise<DashboardResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  const [questionnaire, processes] = await Promise.all([
    getQuestionnaireOverview(),
    listMyProcesses(),
  ]);
  return {
    kind: "READY",
    view: {
      displayName: profile.displayName,
      processes: processes ?? [],
      // Basta um destino respondido para haver recomendações.
      hasCompletedQuestionnaire:
        questionnaire.kind === "READY" &&
        questionnaire.destinations.some(
          (destination) => destination.status === "COMPLETE",
        ),
    },
  };
}
