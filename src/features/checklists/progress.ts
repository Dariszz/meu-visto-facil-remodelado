import type { ChecklistItemStatus, ChecklistItemView } from "./types";

export type ChecklistProgress = {
  completed: number;
  applicable: number;
  remaining: number;
  percent: number;
};

// Itens NOT_APPLICABLE saem da base de cálculo; o percentual é arredondado
// para baixo para nunca indicar 100% antes de todos os itens concluídos.
export function calculateChecklistProgress(
  items: readonly { status: ChecklistItemStatus }[],
): ChecklistProgress {
  const applicable = items.filter(
    (item) => item.status !== "NOT_APPLICABLE",
  ).length;
  const completed = items.filter((item) => item.status === "COMPLETED").length;
  return {
    completed,
    applicable,
    remaining: applicable - completed,
    percent: applicable === 0 ? 0 : Math.floor((completed / applicable) * 100),
  };
}

// Próximo passo sugerido: obrigatório em andamento, depois obrigatório
// pendente, depois qualquer item ainda aberto, preservando a ordem do checklist.
export function findNextChecklistItem(
  items: readonly ChecklistItemView[],
): ChecklistItemView | null {
  const open = items.filter(
    (item) => item.status === "PENDING" || item.status === "IN_PROGRESS",
  );
  return (
    open.find((item) => item.isMandatory && item.status === "IN_PROGRESS") ??
    open.find((item) => item.isMandatory) ??
    open[0] ??
    null
  );
}
