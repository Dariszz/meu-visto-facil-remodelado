import type { CoverageLevel } from "./types";

export const coveragePresentation: Record<
  CoverageLevel,
  { label: string; description: string; text: string; dot: string }
> = {
  FULL: {
    label: "Guia completo",
    description:
      "Os principais caminhos estão organizados e revisados a partir das fontes oficiais.",
    text: "text-success",
    dot: "bg-success",
  },
  PARTIAL: {
    label: "Alguns caminhos revisados",
    description:
      "Parte dos caminhos já está organizada e revisada. Os demais aparecem conforme as fontes oficiais forem revisadas.",
    text: "text-primary",
    dot: "bg-primary",
  },
  LINKS_ONLY: {
    label: "Só sites oficiais, por enquanto",
    description:
      "Ainda não revisamos os vistos deste destino, então não montamos checklist. Consulte diretamente os sites oficiais abaixo.",
    text: "text-warning",
    dot: "bg-warning",
  },
  NONE: {
    label: "Sem cobertura",
    description: "Este destino ainda não foi incluído.",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

// Países que já têm páginas próprias de caminhos. Os demais usam só a página
// genérica do destino até o conteúdo ser revisado.
const dedicatedRoutes: Readonly<Record<string, string>> = {
  ireland: "/ireland",
};

export function dedicatedRouteFor(slug: string): string | null {
  return dedicatedRoutes[slug] ?? null;
}
