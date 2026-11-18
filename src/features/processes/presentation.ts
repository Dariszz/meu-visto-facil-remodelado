import type {
  ChecklistCategoryView,
  ChecklistSourceRef,
  ProcessDetailView,
} from "@/features/checklists/types";
import type { ProcessSummaryView } from "@/features/dashboard/types";
import { visaPageHref } from "@/features/visas/visa-routes";
import {
  checklistStages,
  type ChecklistStage,
} from "./checklist/build-base-checklist";

// Formato mínimo vindo do repositório; mantém a apresentação sem Prisma.
export type ProcessRecordView = {
  id: string;
  title: string;
  status: ProcessDetailView["status"];
  createdAt: Date;
  updatedAt: Date;
  visa: {
    slug: string;
    name: string;
    country: { slug: string; name: string };
  };
  checklist: {
    referenceDate: Date | null;
    items: {
      id: string;
      code: string;
      stage: ChecklistStage;
      title: string;
      description: string;
      status: ChecklistCategoryView["items"][number]["status"];
      priority: ChecklistCategoryView["items"][number]["priority"];
      isMandatory: boolean;
      isOfficial: boolean;
      sortOrder: number;
      updatedAt: Date;
      sources: { sourceId: string }[];
    }[];
  } | null;
};

const stageTitles: Record<ChecklistStage, string> = {
  REQUIREMENTS: "Requisitos",
  APPLICATION: "Solicitação",
  ENTRY: "Entrada no país",
  AFTER_ARRIVAL: "Após a chegada",
};

export function processHref(id: string) {
  return `/processes/${id}`;
}

export function presentProcessDetail(
  record: ProcessRecordView,
  sources: readonly ChecklistSourceRef[],
): ProcessDetailView {
  const items = record.checklist?.items ?? [];
  const categories = checklistStages
    .map((stage) => ({
      id: stage.toLowerCase().replace("_", "-"),
      title: stageTitles[stage],
      items: items
        .filter((item) => item.stage === stage)
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
          isMandatory: item.isMandatory,
          isOfficial: item.isOfficial,
          sourceIds: item.sources.map((link) => link.sourceId),
        })),
    }))
    .filter((category) => category.items.length > 0);
  const cited = new Set(
    items.flatMap((item) => item.sources.map((link) => link.sourceId)),
  );
  return {
    id: record.id,
    title: record.title,
    visaName: record.visa.name,
    visaHref: visaPageHref(record.visa.country.slug, record.visa.slug),
    countryName: record.visa.country.name,
    status: record.status,
    startedAt: record.createdAt.toISOString(),
    referenceDate: (
      record.checklist?.referenceDate ?? record.createdAt
    ).toISOString(),
    categories,
    sources: sources.filter((source) => cited.has(source.id)),
  };
}

// Próximo passo: o primeiro item em andamento; senão, o primeiro obrigatório
// pendente; senão, o primeiro pendente.
function nextStep(items: NonNullable<ProcessRecordView["checklist"]>["items"]) {
  return (
    (
      items.find((item) => item.status === "IN_PROGRESS") ??
      items.find((item) => item.status === "PENDING" && item.isMandatory) ??
      items.find((item) => item.status === "PENDING")
    )?.title ?? null
  );
}

export function presentProcessSummary(
  record: ProcessRecordView,
): ProcessSummaryView {
  const items = record.checklist?.items ?? [];
  return {
    id: record.id,
    title: record.title,
    visaName: record.visa.name,
    countryName: record.visa.country.name,
    status: record.status,
    itemStatuses: items.map((item) => item.status),
    nextStep: nextStep(items),
    updatedAt: record.updatedAt.toISOString(),
    href: processHref(record.id),
  };
}
