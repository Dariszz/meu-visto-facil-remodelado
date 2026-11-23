import "server-only";
import { cache } from "react";
import { z } from "zod";
import type { ChecklistItemStatus } from "@/features/checklists/types";
import type { ProcessDetailView } from "@/features/checklists/types";
import type { ProcessSummaryView } from "@/features/dashboard/types";
import { getCurrentUserProfile } from "@/features/profile/service";
import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import { Prisma } from "@/lib/db/generated/client";
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
  addPersonalItemForProfile,
  deletePersonalItemForProfile,
  setProcessStatusForProfile,
  updateItemStatusForProfile,
} from "@/lib/db/repositories/process-repository";
import {
  buildBaseChecklist,
  CHECKLIST_GENERATOR_VERSION,
} from "../checklist/build-base-checklist";
import { presentProcessDetail, presentProcessSummary } from "../presentation";

const emptyProfile: ImmigrationProfile = {
  objective: null,
  passportRegion: null,
  hasEmploymentOffer: null,
  offerDuration: null,
  occupationArea: null,
  educationLevel: null,
  familyInCountry: null,
};

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

type VisaForProcess = NonNullable<
  Awaited<ReturnType<typeof findVisaForChecklist>>
>;

// Cria processo, snapshot e checklist a partir de um visto já validado.
async function createFromVisa(input: {
  userProfileId: string;
  visa: VisaForProcess;
  profile: ImmigrationProfile | null;
  ruleEngineVersion: string;
  recommendation: Prisma.InputJsonValue | null;
}): Promise<StartProcessResult> {
  const { visa } = input;
  const items = buildBaseChecklist(
    visa.requirements,
    input.profile ?? emptyProfile,
  );
  if (!items.length) return { kind: "NOT_AVAILABLE" };
  const result = await createProcessWithChecklist({
    userProfileId: input.userProfileId,
    visaId: visa.id,
    title: `Minha mudança: ${visa.name}`,
    snapshot: {
      ruleEngineVersion: input.ruleEngineVersion,
      profile: input.profile ?? {},
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
      recommendation: input.recommendation ?? Prisma.JsonNull,
    },
    checklist: {
      generatorVersion: CHECKLIST_GENERATOR_VERSION,
      referenceDate: visa.lastReviewedAt,
      items,
    },
  });
  return { kind: "STARTED", processId: result.id, created: result.created };
}

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
    return createFromVisa({
      userProfileId: profile.id,
      visa,
      profile: questionnaire.profile,
      ruleEngineVersion: RULE_ENGINE_VERSION,
      recommendation: {
        compatibility: recommendation.compatibility,
        matchedCriteria: recommendation.matchedCriteria,
        missingCriteria: recommendation.missingCriteria,
        blockers: recommendation.blockers,
      },
    });
  });
}

// Checklist escolhido direto na página do visto, sem passar pelas
// recomendações. A pessoa decide o caminho; não há compatibilidade calculada.
export const DIRECT_START_VERSION = "direct-v1";

export async function startProcessForVisa(
  countrySlug: string,
  visaSlug: string,
): Promise<StartProcessResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  return guarded(async () => {
    const visa = await findVisaForChecklist(countrySlug, visaSlug);
    if (!visa) return { kind: "NOT_AVAILABLE" as const };
    return createFromVisa({
      userProfileId: profile.id,
      visa,
      profile: null,
      ruleEngineVersion: DIRECT_START_VERSION,
      recommendation: null,
    });
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

// Itens pessoais: texto livre da pessoa, sem fonte oficial.
const noControlChars = (value: string) =>
  !/[\u0000-\u0008\u000b-\u001f\u007f]/.test(value);
export const personalItemSchema = z.strictObject({
  stage: z.enum(["REQUIREMENTS", "APPLICATION", "ENTRY", "AFTER_ARRIVAL"]),
  title: z
    .string()
    .trim()
    .min(1, "Escreva o item.")
    .max(120, "Use até 120 caracteres.")
    .refine(noControlChars, "Remova caracteres especiais."),
  description: z
    .string()
    .trim()
    .max(500, "Use até 500 caracteres.")
    .refine(noControlChars, "Remova caracteres especiais."),
});

export type PersonalItemResult =
  | { kind: "ADDED" }
  | {
      kind: "INVALID";
      fieldErrors: Partial<Record<"title" | "description" | "stage", string>>;
    }
  | { kind: "NOT_FOUND" | "PROFILE_REQUIRED" | "LIMIT_OR_NOT_FOUND" };

export async function addPersonalItem(
  id: string,
  input: unknown,
): Promise<PersonalItemResult> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  if (!processId.safeParse(id).success) return { kind: "NOT_FOUND" };
  const parsed = personalItemSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<
      Record<"title" | "description" | "stage", string>
    > = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "title" || field === "description" || field === "stage")
        fieldErrors[field] ??= issue.message;
    }
    return { kind: "INVALID", fieldErrors };
  }
  return guarded(async () =>
    (await addPersonalItemForProfile({
      userProfileId: profile.id,
      processId: id,
      ...parsed.data,
    }))
      ? { kind: "ADDED" as const }
      : { kind: "LIMIT_OR_NOT_FOUND" as const },
  );
}

export async function deletePersonalItem(
  id: string,
  itemId: string,
): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  if (!processId.safeParse(id).success || !processId.safeParse(itemId).success)
    return false;
  return guarded(() =>
    deletePersonalItemForProfile({
      userProfileId: profile.id,
      processId: id,
      itemId,
    }),
  );
}

const processStatusInput = z.enum([
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
]);

export async function setProcessStatus(
  id: string,
  status: unknown,
): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;
  const parsed = processStatusInput.safeParse(status);
  if (!parsed.success || !processId.safeParse(id).success) return false;
  return guarded(() =>
    setProcessStatusForProfile({
      userProfileId: profile.id,
      processId: id,
      status: parsed.data,
    }),
  );
}
