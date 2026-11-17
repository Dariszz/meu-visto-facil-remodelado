// Contratos de apresentação do checklist. A persistência (Fase 21+) deverá
// mapear ChecklistItem/ChecklistItemSource para estes tipos, sem expor Prisma.
export const checklistItemStatuses = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "NOT_APPLICABLE",
] as const;

export type ChecklistItemStatus = (typeof checklistItemStatuses)[number];

export type ChecklistPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export type ChecklistSourceRef = {
  id: string;
  title: string;
  authority: string;
  hostname: string;
};

export type ChecklistItemView = {
  id: string;
  title: string;
  description: string;
  status: ChecklistItemStatus;
  priority: ChecklistPriority;
  isMandatory: boolean;
  // false para itens pessoais, sem requisito oficial associado.
  isOfficial: boolean;
  sourceIds: readonly string[];
};

export type ChecklistCategoryView = {
  id: string;
  title: string;
  items: readonly ChecklistItemView[];
};

export type ProcessStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type ProcessDetailView = {
  id: string;
  title: string;
  visaName: string;
  visaHref: string | null;
  countryName: string;
  status: ProcessStatus;
  startedAt: string;
  referenceDate: string;
  categories: readonly ChecklistCategoryView[];
  sources: readonly ChecklistSourceRef[];
};
