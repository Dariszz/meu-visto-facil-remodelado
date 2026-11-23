import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CloudOff } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { getQuestionnaireOverview } from "@/features/questionnaire/application/questionnaire-service";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Recomendações | Meu Visto Fácil",
};

// Destinos com questionário respondido. Com um só, vai direto para ele.
export default async function RecommendationsOverviewPage() {
  let overview: Awaited<ReturnType<typeof getQuestionnaireOverview>>;
  try {
    overview = await getQuestionnaireOverview();
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
                <Link href="/recommendations">Tentar novamente</Link>
              </Button>
            }
          />
        </Container>
      </main>
    );
  }
  if (overview.kind === "PROFILE_REQUIRED") redirect("/profile");
  const answered = overview.destinations.filter(
    (destination) => destination.status === "COMPLETE",
  );
  if (!answered.length) redirect("/questionnaire");
  if (answered.length === 1) redirect(`/recommendations/${answered[0].slug}`);
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: "/dashboard" },
            { label: "Recomendações" },
          ]}
        />
        <header className="max-w-2xl pt-2 pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Suas recomendações por destino
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Escolha um país para ver os caminhos que podem combinar com as
            respostas que você deu para ele.
          </p>
        </header>
        <ul className="max-w-2xl divide-y border-y">
          {answered.map((destination) => (
            <li key={destination.slug}>
              <Link
                href={`/recommendations/${destination.slug}`}
                className="flex min-h-14 items-center justify-between gap-4 py-4 font-semibold hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {destination.name}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/questionnaire"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
        >
          Responder para outro destino
        </Link>
      </Container>
    </main>
  );
}
