import { compatibilityLevels, type Compatibility } from "./types";

export const compatibilityPresentation: Record<
  Compatibility,
  { label: string; description: string; text: string; rule: string }
> = {
  HIGH: {
    label: "Alta compatibilidade",
    description: "Pode ser compatível com o seu perfil.",
    text: "text-success",
    rule: "border-success",
  },
  MEDIUM: {
    label: "Compatibilidade média",
    description: "Pode fazer sentido, mas há pontos importantes a confirmar.",
    text: "text-primary",
    rule: "border-primary/60",
  },
  LOW: {
    label: "Baixa compatibilidade",
    description: "Com as informações fornecidas, há pontos que dificultam.",
    text: "text-warning",
    rule: "border-warning",
  },
  NOT_RECOMMENDED: {
    label: "Não indicado agora",
    description: "Com as informações fornecidas, há um impedimento relevante.",
    text: "text-muted-foreground",
    rule: "border-input",
  },
};

// Ordena do mais ao menos compatível, preservando a ordem original em empates.
export function sortByCompatibility<T extends { compatibility: Compatibility }>(
  items: readonly T[],
): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        compatibilityLevels.indexOf(a.item.compatibility) -
          compatibilityLevels.indexOf(b.item.compatibility) ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}
