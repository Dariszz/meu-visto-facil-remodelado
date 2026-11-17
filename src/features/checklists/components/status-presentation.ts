import type { ChecklistItemStatus, ProcessStatus } from "../types";

export const itemStatusPresentation: Record<
  ChecklistItemStatus,
  { label: string; tone: string }
> = {
  PENDING: { label: "Pendente", tone: "bg-muted text-muted-foreground" },
  IN_PROGRESS: {
    label: "Em andamento",
    tone: "bg-warning-subtle text-warning",
  },
  COMPLETED: { label: "Concluído", tone: "bg-success-subtle text-success" },
  NOT_APPLICABLE: {
    label: "Não se aplica",
    tone: "bg-muted text-muted-foreground line-through",
  },
};

export const processStatusPresentation: Record<
  ProcessStatus,
  { label: string; tone: string }
> = {
  ACTIVE: { label: "Em andamento", tone: "bg-accent text-accent-foreground" },
  PAUSED: { label: "Pausado", tone: "bg-warning-subtle text-warning" },
  COMPLETED: { label: "Concluído", tone: "bg-success-subtle text-success" },
  ARCHIVED: { label: "Arquivado", tone: "bg-muted text-muted-foreground" },
};

export function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}
