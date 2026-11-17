import { compatibilityLevels, type Compatibility } from "./types";

export const compatibilityPresentation: Record<
  Compatibility,
  { label: string; description: string; tone: string }
> = {
  HIGH: {
    label: "Alta compatibilidade",
    description: "Pode ser compatível com o seu perfil.",
    tone: "bg-success-subtle text-success",
  },
  MEDIUM: {
    label: "Compatibilidade média",
    description: "Pode fazer sentido, mas há pontos importantes a confirmar.",
    tone: "bg-secondary text-secondary-foreground",
  },
  LOW: {
    label: "Baixa compatibilidade",
    description: "Com as informações fornecidas, há pontos que dificultam.",
    tone: "bg-warning-subtle text-warning",
  },
  NOT_RECOMMENDED: {
    label: "Não indicado agora",
    description: "Com as informações fornecidas, há um impedimento relevante.",
    tone: "bg-muted text-muted-foreground",
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
