import type { ProcessStatus } from "@/features/checklists/types";

export type ProcessSummaryView = {
  id: string;
  title: string;
  visaName: string;
  countryName: string;
  status: ProcessStatus;
  completedItems: number;
  applicableItems: number;
  nextStep: string | null;
  updatedAt: string;
  href: string;
};

export type DashboardView = {
  displayName: string | null;
  processes: readonly ProcessSummaryView[];
  hasCompletedQuestionnaire: boolean;
};
