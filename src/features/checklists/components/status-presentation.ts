import type { ChecklistItemStatus, ProcessStatus } from "../types";

export const itemStatusPresentation: Record<
  ChecklistItemStatus,
  { label: string; text: string }
> = {
  PENDING: { label: "Pendente", text: "text-muted-foreground" },
  IN_PROGRESS: { label: "Em andamento", text: "text-warning" },
  COMPLETED: { label: "Concluído", text: "text-success" },
  NOT_APPLICABLE: { label: "Não se aplica", text: "text-muted-foreground" },
};

export const processStatusPresentation: Record<
  ProcessStatus,
  { label: string; text: string; dot: string }
> = {
  ACTIVE: { label: "Em andamento", text: "text-primary", dot: "bg-primary" },
  PAUSED: { label: "Pausado", text: "text-warning", dot: "bg-warning" },
  COMPLETED: { label: "Concluído", text: "text-success", dot: "bg-success" },
  ARCHIVED: {
    label: "Arquivado",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}
