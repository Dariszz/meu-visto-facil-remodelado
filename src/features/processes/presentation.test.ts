import { expect, test } from "vitest";
import {
  presentProcessDetail,
  presentProcessSummary,
  type ProcessRecordView,
} from "./presentation";

const at = new Date("2026-11-18T10:00:00.000Z");
const item = (
  code: string,
  stage: "REQUIREMENTS" | "APPLICATION" | "ENTRY" | "AFTER_ARRIVAL",
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "NOT_APPLICABLE",
  sourceId: string,
) => ({
  id: `item-${code}`,
  code,
  stage,
  title: `Título ${code}`,
  description: `Descrição ${code}`,
  status,
  priority: "HIGH" as const,
  isMandatory: true,
  isOfficial: true,
  sortOrder: 0,
  updatedAt: at,
  sources: [{ sourceId }],
});

const record: ProcessRecordView = {
  id: "proc-1",
  title: "Minha mudança: Critical Skills Employment Permit",
  status: "ACTIVE",
  createdAt: at,
  updatedAt: at,
  visa: {
    slug: "critical-skills-employment-permit",
    name: "Critical Skills Employment Permit",
    country: { slug: "ireland", name: "Irlanda" },
  },
  checklist: {
    referenceDate: new Date("2026-09-10T00:00:00.000Z"),
    items: [
      item("offer", "REQUIREMENTS", "COMPLETED", "permit"),
      item("apply", "APPLICATION", "PENDING", "permit"),
      item("register", "AFTER_ARRIVAL", "IN_PROGRESS", "residence"),
    ],
  },
};

const sources = [
  { id: "permit", title: "Permit", authority: "DETE", hostname: "a" },
  { id: "residence", title: "Residence", authority: "ISD", hostname: "b" },
  { id: "unused", title: "Outra", authority: "X", hostname: "c" },
];

test("detalhe agrupa por etapa, omite etapas vazias e só lista fontes citadas", () => {
  const view = presentProcessDetail(record, sources);
  expect(view.categories.map((category) => category.title)).toEqual([
    "Requisitos",
    "Solicitação",
    "Após a chegada",
  ]);
  expect(view.sources.map((source) => source.id)).toEqual([
    "permit",
    "residence",
  ]);
  expect(view.visaHref).toBe(
    "/ireland/visas/critical-skills-employment-permit",
  );
  expect(view.referenceDate).toBe("2026-09-10T00:00:00.000Z");
});

test("resumo do painel aponta o item em andamento como próximo passo", () => {
  expect(presentProcessSummary(record)).toMatchObject({
    href: "/processes/proc-1",
    itemStatuses: ["COMPLETED", "PENDING", "IN_PROGRESS"],
    nextStep: "Título register",
  });
});
