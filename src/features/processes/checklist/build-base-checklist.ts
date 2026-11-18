import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";

// Fase 21: checklist base sem IA. Versão gravada no Checklist para saber, no
// futuro, com quais regras cada checklist foi gerado.
export const CHECKLIST_GENERATOR_VERSION = "base-checklist-v1";

export const checklistStages = [
  "REQUIREMENTS",
  "APPLICATION",
  "ENTRY",
  "AFTER_ARRIVAL",
] as const;
export type ChecklistStage = (typeof checklistStages)[number];

export type RequirementForChecklist = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  importance: "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
  isMandatory: boolean;
  sortOrder: number;
  sourceIds: readonly string[];
};

export type BaseChecklistItem = {
  requirementId: string;
  code: string;
  stage: ChecklistStage;
  title: string;
  description: string;
  priority: RequirementForChecklist["importance"];
  isMandatory: boolean;
  sortOrder: number;
  sourceIds: string[];
};

const stageByCategory: Record<string, ChecklistStage> = {
  APPLICATION: "APPLICATION",
  ENTRY: "ENTRY",
  AFTER_ARRIVAL: "AFTER_ARRIVAL",
};

// Condições por perfil, por código de requisito. Nenhum requisito revisado
// depende hoje das respostas, então todos entram. Uma condição só pode
// remover um item quando a resposta é conhecida: "não sei" mantém o item.
const profileConditions: Record<
  string,
  (profile: ImmigrationProfile) => boolean
> = {};

// Recebe apenas requisitos já revisados (o repositório filtra). Itens sem
// fonte oficial não entram: todo item oficial precisa apontar para a fonte.
export function buildBaseChecklist(
  requirements: readonly RequirementForChecklist[],
  profile: ImmigrationProfile,
): BaseChecklistItem[] {
  const stageOrder = (stage: ChecklistStage) => checklistStages.indexOf(stage);
  return requirements
    .filter((requirement) => requirement.sourceIds.length > 0)
    .filter(
      (requirement) => profileConditions[requirement.code]?.(profile) ?? true,
    )
    .map((requirement) => ({
      requirementId: requirement.id,
      code: requirement.code,
      stage: stageByCategory[requirement.category] ?? "REQUIREMENTS",
      title: requirement.title,
      description: requirement.description,
      priority: requirement.importance,
      isMandatory: requirement.isMandatory,
      sortOrder: requirement.sortOrder,
      sourceIds: [...requirement.sourceIds],
    }))
    .sort(
      (a, b) =>
        stageOrder(a.stage) - stageOrder(b.stage) ||
        a.sortOrder - b.sortOrder ||
        a.code.localeCompare(b.code),
    )
    .map((item, index) => ({ ...item, sortOrder: index }));
}
