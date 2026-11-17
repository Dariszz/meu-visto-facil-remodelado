import { expect, test } from "vitest";
import {
  compatibilityPresentation,
  sortByCompatibility,
} from "./compatibility";
import { compatibilityLevels } from "./types";

test("ordena por compatibilidade e mantém empates estáveis", () => {
  const sorted = sortByCompatibility([
    { id: "a", compatibility: "LOW" as const },
    { id: "b", compatibility: "HIGH" as const },
    { id: "c", compatibility: "NOT_RECOMMENDED" as const },
    { id: "d", compatibility: "HIGH" as const },
    { id: "e", compatibility: "MEDIUM" as const },
  ]);
  expect(sorted.map((item) => item.id)).toEqual(["b", "d", "e", "a", "c"]);
});

test("nenhum rótulo promete elegibilidade ou aprovação", () => {
  for (const level of compatibilityLevels) {
    const { label, description } = compatibilityPresentation[level];
    expect(`${label} ${description}`).not.toMatch(
      /eleg[ií]vel|aprovad|garant/i,
    );
  }
});
