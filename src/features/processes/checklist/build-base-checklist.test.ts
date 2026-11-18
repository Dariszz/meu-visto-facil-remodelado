import { expect, test } from "vitest";
import {
  buildBaseChecklist,
  type RequirementForChecklist,
} from "./build-base-checklist";
import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";

const profile: ImmigrationProfile = {
  objective: "work",
  passportRegion: "other",
  hasEmploymentOffer: true,
  offerDuration: "2y_plus",
  occupationArea: "technology",
  educationLevel: null,
  familyInCountry: null,
};

function requirement(
  code: string,
  category: string,
  sortOrder: number,
  sourceIds: string[] = ["permit"],
): RequirementForChecklist {
  return {
    id: `req-${code}`,
    code,
    title: `Título ${code}`,
    description: `Descrição ${code}`,
    category,
    importance: "HIGH",
    isMandatory: true,
    sortOrder,
    sourceIds,
  };
}

test("agrupa por etapa na ordem do processo e renumera a ordem", () => {
  const items = buildBaseChecklist(
    [
      requirement("register", "AFTER_ARRIVAL", 7),
      requirement("apply", "APPLICATION", 5),
      requirement("qualifications", "EDUCATION", 2),
      requirement("offer", "EMPLOYMENT", 0),
      requirement("entry", "ENTRY", 6),
    ],
    profile,
  );
  expect(items.map((item) => [item.code, item.stage, item.sortOrder])).toEqual([
    ["offer", "REQUIREMENTS", 0],
    ["qualifications", "REQUIREMENTS", 1],
    ["apply", "APPLICATION", 2],
    ["entry", "ENTRY", 3],
    ["register", "AFTER_ARRIVAL", 4],
  ]);
});

test("mantém vínculo com o requisito e as fontes, sem inventar texto", () => {
  const [item] = buildBaseChecklist(
    [requirement("offer", "EMPLOYMENT", 0, ["permit", "entry"])],
    profile,
  );
  expect(item).toEqual({
    requirementId: "req-offer",
    code: "offer",
    stage: "REQUIREMENTS",
    title: "Título offer",
    description: "Descrição offer",
    priority: "HIGH",
    isMandatory: true,
    sortOrder: 0,
    sourceIds: ["permit", "entry"],
  });
});

test("requisito sem fonte oficial não vira item", () => {
  expect(
    buildBaseChecklist([requirement("offer", "EMPLOYMENT", 0, [])], profile),
  ).toEqual([]);
});

test("respostas desconhecidas não removem itens", () => {
  const unknown: ImmigrationProfile = {
    objective: null,
    passportRegion: null,
    hasEmploymentOffer: null,
    offerDuration: null,
    occupationArea: null,
    educationLevel: null,
    familyInCountry: null,
  };
  expect(
    buildBaseChecklist([requirement("offer", "EMPLOYMENT", 0)], unknown),
  ).toHaveLength(1);
});
