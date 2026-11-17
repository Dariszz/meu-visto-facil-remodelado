import type { ChecklistItemView } from "./types";

// Fora do componente client: páginas do servidor precisam do valor real para
// validar o parâmetro ?filtro= da URL.
export const checklistFilters = ["todos", "abertos", "concluidos"] as const;
export type ChecklistFilter = (typeof checklistFilters)[number];

export const filterLabels: Record<ChecklistFilter, string> = {
  todos: "Todos",
  abertos: "Em aberto",
  concluidos: "Concluídos",
};

export function parseChecklistFilter(value: unknown): ChecklistFilter {
  return checklistFilters.includes(value as ChecklistFilter)
    ? (value as ChecklistFilter)
    : "todos";
}

export function matchesFilter(
  item: ChecklistItemView,
  filter: ChecklistFilter,
) {
  if (filter === "abertos")
    return item.status === "PENDING" || item.status === "IN_PROGRESS";
  if (filter === "concluidos")
    return item.status === "COMPLETED" || item.status === "NOT_APPLICABLE";
  return true;
}
