import "server-only";
import type { BaseChecklistItem } from "@/features/processes/checklist/build-base-checklist";
import { Prisma } from "../generated/client";
import { getProfileDatabaseClient } from "../profile-client";

// Processos são dados pessoais: sempre pela credencial de perfil e sempre
// filtrados pelo dono. Nenhuma função aceita só o id do processo.

const itemSelect = {
  id: true,
  code: true,
  stage: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  isMandatory: true,
  isOfficial: true,
  sortOrder: true,
  updatedAt: true,
  sources: { select: { sourceId: true }, orderBy: { sourceId: "asc" } },
} satisfies Prisma.ChecklistItemSelect;

const processSelect = {
  id: true,
  title: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  visa: {
    select: {
      slug: true,
      name: true,
      country: { select: { slug: true, name: true } },
    },
  },
  checklist: {
    select: {
      referenceDate: true,
      items: {
        select: itemSelect,
        orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
        take: 300,
      },
    },
  },
} satisfies Prisma.ImmigrationProcessSelect;

export type ProcessRecord = Prisma.ImmigrationProcessGetPayload<{
  select: typeof processSelect;
}>;

export type NewProcess = {
  userProfileId: string;
  visaId: string;
  title: string;
  snapshot: {
    ruleEngineVersion: string;
    profile: Prisma.InputJsonValue;
    visa: Prisma.InputJsonValue;
    requirements: Prisma.InputJsonValue;
    recommendation: Prisma.InputJsonValue | typeof Prisma.JsonNull;
  };
  checklist: {
    generatorVersion: string;
    referenceDate: Date | null;
    items: readonly BaseChecklistItem[];
  };
};

export async function findOpenProcessIdForVisa(
  userProfileId: string,
  visaId: string,
  db?: Prisma.TransactionClient,
): Promise<string | null> {
  const row = await (
    db ?? getProfileDatabaseClient()
  ).immigrationProcess.findFirst({
    where: { userProfileId, visaId, status: { not: "ARCHIVED" } },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  return row?.id ?? null;
}

// Cria processo, snapshot, checklist e itens numa transação. Se já existir um
// processo aberto para o mesmo visto, devolve esse em vez de duplicar.
export async function createProcessWithChecklist(
  input: NewProcess,
  db?: Prisma.TransactionClient,
): Promise<{ id: string; created: boolean }> {
  const run = async (tx: Prisma.TransactionClient) => {
    const existing = await findOpenProcessIdForVisa(
      input.userProfileId,
      input.visaId,
      tx,
    );
    if (existing) return { id: existing, created: false };
    const process = await tx.immigrationProcess.create({
      data: {
        userProfileId: input.userProfileId,
        visaId: input.visaId,
        title: input.title,
        snapshot: { create: input.snapshot },
        checklist: {
          create: {
            generatorVersion: input.checklist.generatorVersion,
            referenceDate: input.checklist.referenceDate,
            items: {
              create: input.checklist.items.map((item) => ({
                requirementId: item.requirementId,
                code: item.code,
                stage: item.stage,
                title: item.title,
                description: item.description,
                priority: item.priority,
                isMandatory: item.isMandatory,
                isOfficial: true,
                sortOrder: item.sortOrder,
                sources: {
                  create: item.sourceIds.map((sourceId) => ({ sourceId })),
                },
              })),
            },
          },
        },
      },
      select: { id: true },
    });
    return { id: process.id, created: true };
  };
  if (db) return run(db);
  return getProfileDatabaseClient().$transaction(run, {
    isolationLevel: "Serializable",
    timeout: 15_000,
  });
}

export async function listProcessesForProfile(
  userProfileId: string,
  db?: Prisma.TransactionClient,
): Promise<ProcessRecord[]> {
  return (db ?? getProfileDatabaseClient()).immigrationProcess.findMany({
    where: { userProfileId, status: { not: "ARCHIVED" } },
    select: processSelect,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 50,
  });
}

export async function findProcessForProfile(
  userProfileId: string,
  processId: string,
  db?: Prisma.TransactionClient,
): Promise<ProcessRecord | null> {
  return (db ?? getProfileDatabaseClient()).immigrationProcess.findFirst({
    where: { id: processId, userProfileId, status: { not: "ARCHIVED" } },
    select: processSelect,
  });
}

// Atualiza o status só se o item pertencer a um processo do próprio perfil.
// Devolve false quando não encontra (inexistente ou de outra pessoa), sem
// distinguir os casos.
export async function updateItemStatusForProfile(
  input: {
    userProfileId: string;
    processId: string;
    itemId: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "NOT_APPLICABLE";
  },
  db?: Prisma.TransactionClient,
): Promise<boolean> {
  const run = async (tx: Prisma.TransactionClient) => {
    const { count } = await tx.checklistItem.updateMany({
      where: {
        id: input.itemId,
        checklist: {
          process: {
            id: input.processId,
            userProfileId: input.userProfileId,
            status: { not: "ARCHIVED" },
          },
        },
      },
      data: {
        status: input.status,
        completedAt: input.status === "COMPLETED" ? new Date() : null,
      },
    });
    if (count !== 1) return false;
    // Marca a atividade no processo para ordenar o painel.
    await tx.immigrationProcess.updateMany({
      where: { id: input.processId, userProfileId: input.userProfileId },
      data: { updatedAt: new Date() },
    });
    return true;
  };
  if (db) return run(db);
  return getProfileDatabaseClient().$transaction(run);
}

const ownedChecklist = (userProfileId: string, processId: string) =>
  ({
    process: { id: processId, userProfileId, status: { not: "ARCHIVED" } },
  }) satisfies Prisma.ChecklistWhereInput;

// Item pessoal: criado pela própria pessoa, nunca oficial nem obrigatório.
export async function addPersonalItemForProfile(
  input: {
    userProfileId: string;
    processId: string;
    stage: "REQUIREMENTS" | "APPLICATION" | "ENTRY" | "AFTER_ARRIVAL";
    title: string;
    description: string;
  },
  db?: Prisma.TransactionClient,
): Promise<boolean> {
  const run = async (tx: Prisma.TransactionClient) => {
    const checklist = await tx.checklist.findFirst({
      where: ownedChecklist(input.userProfileId, input.processId),
      select: {
        id: true,
        _count: { select: { items: { where: { isOfficial: false } } } },
      },
    });
    // Limite simples para evitar abuso de armazenamento.
    if (!checklist || checklist._count.items >= 50) return false;
    const last = await tx.checklistItem.aggregate({
      where: { checklistId: checklist.id },
      _max: { sortOrder: true },
    });
    await tx.checklistItem.create({
      data: {
        checklistId: checklist.id,
        code: `personal-${crypto.randomUUID()}`,
        stage: input.stage,
        title: input.title,
        description: input.description,
        isOfficial: false,
        isMandatory: false,
        priority: "NORMAL",
        sortOrder: (last._max.sortOrder ?? 0) + 1,
      },
    });
    await tx.immigrationProcess.updateMany({
      where: { id: input.processId, userProfileId: input.userProfileId },
      data: { updatedAt: new Date() },
    });
    return true;
  };
  if (db) return run(db);
  return getProfileDatabaseClient().$transaction(run);
}

// Só apaga itens pessoais; itens oficiais nunca são removidos.
export async function deletePersonalItemForProfile(
  input: { userProfileId: string; processId: string; itemId: string },
  db?: Prisma.TransactionClient,
): Promise<boolean> {
  const { count } = await (
    db ?? getProfileDatabaseClient()
  ).checklistItem.deleteMany({
    where: {
      id: input.itemId,
      isOfficial: false,
      checklist: ownedChecklist(input.userProfileId, input.processId),
    },
  });
  return count === 1;
}

export async function setProcessStatusForProfile(
  input: {
    userProfileId: string;
    processId: string;
    status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  },
  db?: Prisma.TransactionClient,
): Promise<boolean> {
  const { count } = await (
    db ?? getProfileDatabaseClient()
  ).immigrationProcess.updateMany({
    where: {
      id: input.processId,
      userProfileId: input.userProfileId,
      status: { not: "ARCHIVED" },
    },
    data: { status: input.status },
  });
  return count === 1;
}
