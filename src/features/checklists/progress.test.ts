import { expect, test } from "vitest";
import { calculateChecklistProgress, findNextChecklistItem } from "./progress";
import type { ChecklistItemView } from "./types";

function item(
  id: string,
  status: ChecklistItemView["status"],
  isMandatory = true,
): ChecklistItemView {
  return {
    id,
    title: id,
    description: "",
    status,
    priority: "NORMAL",
    isMandatory,
    isOfficial: isMandatory,
    sourceIds: [],
  };
}

test("progresso ignora itens que não se aplicam", () => {
  expect(
    calculateChecklistProgress([
      item("a", "COMPLETED"),
      item("b", "PENDING"),
      item("c", "IN_PROGRESS"),
      item("d", "NOT_APPLICABLE", false),
    ]),
  ).toEqual({ completed: 1, applicable: 3, remaining: 2, percent: 33 });
});

test("progresso não arredonda para 100% antes do fim", () => {
  const items = [
    ...Array.from({ length: 199 }, (_, i) => item(`ok-${i}`, "COMPLETED")),
    item("ultimo", "PENDING"),
  ];
  expect(calculateChecklistProgress(items).percent).toBe(99);
});

test("lista vazia ou só com itens não aplicáveis tem progresso zero", () => {
  expect(calculateChecklistProgress([])).toEqual({
    completed: 0,
    applicable: 0,
    remaining: 0,
    percent: 0,
  });
  expect(
    calculateChecklistProgress([item("x", "NOT_APPLICABLE", false)]).percent,
  ).toBe(0);
});

test("próximo passo prioriza obrigatório em andamento", () => {
  const next = findNextChecklistItem([
    item("pessoal", "PENDING", false),
    item("pendente", "PENDING"),
    item("andamento", "IN_PROGRESS"),
  ]);
  expect(next?.id).toBe("andamento");
});

test("próximo passo cai para obrigatório pendente e depois item pessoal", () => {
  expect(
    findNextChecklistItem([
      item("pessoal", "PENDING", false),
      item("obrigatorio", "PENDING"),
    ])?.id,
  ).toBe("obrigatorio");
  expect(
    findNextChecklistItem([
      item("feito", "COMPLETED"),
      item("pessoal", "IN_PROGRESS", false),
    ])?.id,
  ).toBe("pessoal");
  expect(findNextChecklistItem([item("feito", "COMPLETED")])).toBeNull();
});
