import "server-only";
import { getCurrentUserProfile } from "@/features/profile/service";
import type { DashboardView } from "../types";

export type DashboardResult =
  { kind: "READY"; view: DashboardView } | { kind: "PROFILE_REQUIRED" };

// Serviço de aplicação do painel (ADR 0004): resolve a identidade no servidor
// e devolve o view model pronto para a tela. Processos e questionário entram
// quando as fases correspondentes existirem; até lá, listas vazias reais.
export async function getDashboard(): Promise<DashboardResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  return {
    kind: "READY",
    view: {
      displayName: profile.displayName,
      processes: [],
      hasCompletedQuestionnaire: false,
    },
  };
}
