import type {
  ChecklistItemStatus,
  ProcessStatus,
} from "@/features/checklists/types";

export type ProcessSummaryView = {
  id: string;
  title: string;
  visaName: string;
  countryName: string;
  status: ProcessStatus;
  // Status de cada item, na ordem do checklist, para a régua do processo.
  itemStatuses: readonly ChecklistItemStatus[];
  nextStep: string | null;
  updatedAt: string;
  href: string;
};

export type DashboardView = {
  displayName: string | null;
  processes: readonly ProcessSummaryView[];
  hasCompletedQuestionnaire: boolean;
};
