import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CloudOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import {
  getRecommendations,
  type RecommendationsResult,
} from "@/features/recommendations/application/get-recommendations";
import { RecommendationsView } from "@/features/recommendations/components/recommendations-view";
import {
  isRecommendationDestination,
  recommendationDestinations,
} from "@/features/destinations/registry";
import { startRecommendedProcessAction } from "@/features/processes/actions";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Recomendações | Meu Visto Fácil",
};

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!isRecommendationDestination(pais)) notFound();
  const destination = recommendationDestinations[pais];
  let result: RecommendationsResult;
  try {
    result = await getRecommendations(pais);
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <main id="main-content" tabIndex={-1}>
        <Container className="py-14">
          <StatePanel
            tone="error"
            icon={CloudOff}
            title="Não foi possível carregar as recomendações"
            description="Pode ser uma instabilidade temporária. Suas respostas continuam salvas. Tente novamente em alguns instantes."
            action={
              <Button asChild variant="outline">
                <Link href={`/recommendations/${pais}`}>Tentar novamente</Link>
              </Button>
            }
          />
        </Container>
      </main>
    );
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (result.kind === "QUESTIONNAIRE_REQUIRED")
    redirect(`/questionnaire/${pais}`);
  return (
    <RecommendationsView
      countryName={destination.name}
      inName={destination.inName}
      profileFacts={result.profileFacts}
      recommendations={result.recommendations}
      startAction={startRecommendedProcessAction.bind(null, pais)}
      links={{
        dashboard: "/dashboard",
        overview: "/recommendations",
        questionnaire: `/questionnaire/${pais}`,
        explore: `/destinos/${pais}`,
      }}
    />
  );
}
