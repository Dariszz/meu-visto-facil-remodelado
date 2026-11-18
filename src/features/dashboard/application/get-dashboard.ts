import "server-only";
import { getCurrentUserProfile } from "@/features/profile/service";
import { listMyProcesses } from "@/features/processes/application/process-service";
import { getQuestionnaire } from "@/features/questionnaire/application/questionnaire-service";
import type { DashboardView } from "../types";

export type DashboardResult =
  { kind: "READY"; view: DashboardView } | { kind: "PROFILE_REQUIRED" };

// Serviço de aplicação do painel (ADR 0004): resolve a identidade no servidor
// e devolve o view model pronto para a tela, com processos e questionário.
export async function getDashboard(): Promise<DashboardResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  const [questionnaire, processes] = await Promise.all([
    getQuestionnaire("ireland"),
    listMyProcesses(),
  ]);
  return {
    kind: "READY",
    view: {
      displayName: profile.displayName,
      processes: processes ?? [],
      hasCompletedQuestionnaire:
        questionnaire.kind === "READY" && questionnaire.complete,
    },
  };
}
