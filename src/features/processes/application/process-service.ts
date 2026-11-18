import "server-only";
import { cache } from "react";
import { z } from "zod";
import type { ChecklistItemStatus } from "@/features/checklists/types";
import type { ProcessDetailView } from "@/features/checklists/types";
import type { ProcessSummaryView } from "@/features/dashboard/types";
import { getCurrentUserProfile } from "@/features/profile/service";
import { getQuestionnaire } from "@/features/questionnaire/application/questionnaire-service";
import {
  evaluateIrelandWorkPaths,
  RULE_ENGINE_VERSION,
} from "@/features/recommendations/engine/evaluate";
import {
  findVisaForChecklist,
  listSourcesByIds,
} from "@/lib/db/repositories/checklist-catalog-repository";
import {
  createProcessWithChecklist,
  findProcessForProfile,
  listProcessesForProfile,
  updateItemStatusForProfile,
} from "@/lib/db/repositories/process-repository";
import {
  buildBaseChecklist,
  CHECKLIST_GENERATOR_VERSION,
} from "../checklist/build-base-checklist";
import { presentProcessDetail, presentProcessSummary } from "../presentation";

export class ProcessUnavailableError extends Error {
  readonly code = "PROCESS_UNAVAILABLE";
  constructor() {
    super("PROCESS_UNAVAILABLE");
    this.name = "ProcessUnavailableError";
  }
}

// Falha de infraestrutura vira erro genérico; falta de sessão segue adiante
// para a página redirecionar ao login.
async function guarded<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if ((error as { code?: string } | null)?.code === "AUTH_REQUIRED")
      throw error;
    console.error(
      JSON.stringify({
        event: "process_operation_failed",
        code: "PROCESS_UNAVAILABLE",
      }),
    );
    throw new ProcessUnavailableError();
  }
}

const processId = z.string().uuid();
const itemStatus = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "NOT_APPLICABLE",
]);

export type StartProcessResult =
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "QUESTIONNAIRE_REQUIRED" }
  | { kind: "NOT_AVAILABLE" }
  | { kind: "STARTED"; processId: string; created: boolean };

// Fase 19: o navegador só informa qual visto. Perfil, respostas,
// compatibilidade e requisitos são recalculados no servidor.
export async function startProcess(
  countrySlug: string,
  visaSlug: string,
): Promise<StartProcessResult> {
  const questionnaire = await getQuestionnaire(countrySlug);
  if (questionnaire.kind === "PROFILE_REQUIRED")
    return { kind: "PROFILE_REQUIRED" };
  if (questionnaire.kind !== "READY" || !questionnaire.complete)
    return { kind: "QUESTIONNAIRE_REQUIRED" };
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  return guarded(async () => {
    const recommendation = evaluateIrelandWorkPaths(questionnaire.profile).find(
      (result) => result.visaSlug === visaSlug,
    );
    if (!recommendation || recommendation.compatibility === "NOT_RECOMMENDED")
      return { kind: "NOT_AVAILABLE" as const };
    const visa = await findVisaForChecklist(countrySlug, visaSlug);
    if (!visa) return { kind: "NOT_AVAILABLE" as const };
    const items = buildBaseChecklist(visa.requirements, questionnaire.profile);
    if (!items.length) return { kind: "NOT_AVAILABLE" as const };
    const result = await createProcessWithChecklist({
      userProfileId: profile.id,
      visaId: visa.id,
      title: `Minha mudança: ${visa.name}`,
      snapshot: {
        ruleEngineVersion: RULE_ENGINE_VERSION,
        profile: questionnaire.profile,
        visa: {
          id: visa.id,
          slug: visa.slug,
          name: visa.name,
          countryCode: visa.country.code,
          lastReviewedAt: visa.lastReviewedAt?.toISOString() ?? null,
        },
        requirements: visa.requirements.map((requirement) => ({
          ...requirement,
          sourceIds: [...requirement.sourceIds],
        })),
        recommendation: {
          compatibility: recommendation.compatibility,
          matchedCriteria: recommendation.matchedCriteria,
          missingCriteria: recommendation.missingCriteria,
          blockers: recommendation.blockers,
        },
      },
      checklist: {
        generatorVersion: CHECKLIST_GENERATOR_VERSION,
        referenceDate: visa.lastReviewedAt,
        items,
      },
    });
    return {
      kind: "STARTED" as const,
      processId: result.id,
      created: result.created,
    };
  });
}

export type ProcessDetailResult =
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "NOT_FOUND" }
  | { kind: "READY"; process: ProcessDetailView };

export async function getProcessDetail(
  id: string,
): Promise<ProcessDetailResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  if (!processId.safeParse(id).success) return { kind: "NOT_FOUND" };
  return guarded(async () => {
    const record = await findProcessForProfile(profile.id, id);
    if (!record) return { kind: "NOT_FOUND" as const };
    const sources = await listSourcesByIds(
      (record.checklist?.items ?? []).flatMap((item) =>
        item.sources.map((link) => link.sourceId),
      ),
    );
    return {
      kind: "READY" as const,
      process: presentProcessDetail(record, sources),
    };
  });
}

// Memorizado por requisição: painel e recomendações usam a mesma consulta.
const loadMyProcessRecords = cache(async () => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  return guarded(() => listProcessesForProfile(profile.id));
});

export async function listMyProcesses(): Promise<ProcessSummaryView[] | null> {
  const records = await loadMyProcessRecords();
  return records ? records.map(presentProcessSummary) : null;
}

// Visto -> id do processo aberto, para trocar "Iniciar" por "Abrir".
export async function listMyOpenProcessesByVisa(): Promise<
  Map<string, string>
> {
  const records = await loadMyProcessRecords();
  return new Map(
    (records ?? []).map((record) => [record.visa.slug, record.id]),
  );
}

export async function updateChecklistItemStatus(
  id: string,
  itemId: string,
  status: unknown,
): Promise<"UPDATED" | "NOT_FOUND" | "PROFILE_REQUIRED"> {
  const profile = await getCurrentUserProfile();
  if (!profile) return "PROFILE_REQUIRED";
  const parsed = itemStatus.safeParse(status);
  if (
    !parsed.success ||
    !processId.safeParse(id).success ||
    !processId.safeParse(itemId).success
  )
    return "NOT_FOUND";
  return guarded(async () =>
    (await updateItemStatusForProfile({
      userProfileId: profile.id,
      processId: id,
      itemId,
      status: parsed.data as ChecklistItemStatus,
    }))
      ? "UPDATED"
      : "NOT_FOUND",
  );
}
