import type { Metadata } from "next";
import { RecommendationsView } from "@/features/recommendations/components/recommendations-view";
import {
  exampleProfileFacts,
  exampleProfileFactsNoOffer,
  exampleRecommendations,
  exampleRecommendationsNoOffer,
  pendingCategories,
  previewLinks,
} from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia das recomendações | Meu Visto Fácil",
};

export default async function RecommendationsPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { cenario } = await searchParams;
  const noOffer = cenario === "sem-oferta";
  return (
    <RecommendationsView
      countryName="Irlanda"
      profileFacts={noOffer ? exampleProfileFactsNoOffer : exampleProfileFacts}
      recommendations={
        noOffer ? exampleRecommendationsNoOffer : exampleRecommendations
      }
      pendingCategories={pendingCategories}
      links={{
        dashboard: previewLinks.dashboard,
        questionnaire: previewLinks.questionnaire,
        explore: previewLinks.explore,
      }}
    />
  );
}
