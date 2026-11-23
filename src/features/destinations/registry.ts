// Destinos com questionário e regras de recomendação. A ordem é a de exibição.
// Nomes ficam aqui (e não só no banco) porque as regras escrevem frases com
// a preposição certa ("na Itália", "nos Estados Unidos").
export const recommendationDestinations = {
  ireland: { name: "Irlanda", inName: "na Irlanda" },
  portugal: { name: "Portugal", inName: "em Portugal" },
  spain: { name: "Espanha", inName: "na Espanha" },
  italy: { name: "Itália", inName: "na Itália" },
  germany: { name: "Alemanha", inName: "na Alemanha" },
  netherlands: { name: "Holanda", inName: "na Holanda" },
  "united-kingdom": { name: "Reino Unido", inName: "no Reino Unido" },
  canada: { name: "Canadá", inName: "no Canadá" },
  "united-states": { name: "Estados Unidos", inName: "nos Estados Unidos" },
  australia: { name: "Austrália", inName: "na Austrália" },
} as const;

export type RecommendationDestination = keyof typeof recommendationDestinations;

export function isRecommendationDestination(
  slug: unknown,
): slug is RecommendationDestination {
  return (
    typeof slug === "string" && Object.hasOwn(recommendationDestinations, slug)
  );
}
