import { cn } from "@/lib/cn";
import type { ChecklistItemStatus } from "../types";

const segmentTone: Record<ChecklistItemStatus, string> = {
  COMPLETED: "bg-primary",
  IN_PROGRESS: "bg-warning/70",
  PENDING: "bg-border",
  NOT_APPLICABLE: "border border-dashed border-input/60 bg-transparent",
};

// Régua do dossiê: um segmento por item do checklist, na ordem do processo.
// Mostra onde está cada item, não só o total, e é o elemento visual que se
// repete no painel, no processo e no questionário.
export function ItemStrip({
  statuses,
  label,
  size = "md",
  className,
}: {
  statuses: readonly ChecklistItemStatus[];
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex w-full gap-[3px]",
        size === "sm" && "h-1.5",
        size === "md" && "h-2.5",
        size === "lg" && "h-4",
        className,
      )}
    >
      {statuses.map((status, index) => (
        <span
          key={index}
          className={cn(
            "min-w-1 flex-1 rounded-[2px] transition-colors duration-300",
            segmentTone[status],
          )}
        />
      ))}
    </div>
  );
}

// Para resumos que só têm contagens (ex.: painel), monta a sequência
// concluídos → em andamento → pendentes.
export function statusesFromCounts({
  completed,
  inProgress = 0,
  total,
}: {
  completed: number;
  inProgress?: number;
  total: number;
}): ChecklistItemStatus[] {
  const open = Math.max(0, total - completed - inProgress);
  return [
    ...Array<ChecklistItemStatus>(completed).fill("COMPLETED"),
    ...Array<ChecklistItemStatus>(inProgress).fill("IN_PROGRESS"),
    ...Array<ChecklistItemStatus>(open).fill("PENDING"),
  ];
}

export function describeProgress(statuses: readonly ChecklistItemStatus[]) {
  const applicable = statuses.filter((s) => s !== "NOT_APPLICABLE").length;
  const completed = statuses.filter((s) => s === "COMPLETED").length;
  const inProgress = statuses.filter((s) => s === "IN_PROGRESS").length;
  return `${completed} de ${applicable} itens concluídos${
    inProgress ? `, ${inProgress} em andamento` : ""
  }`;
}
