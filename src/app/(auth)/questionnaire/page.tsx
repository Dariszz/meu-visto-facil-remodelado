import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CloudOff } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { getQuestionnaireOverview } from "@/features/questionnaire/application/questionnaire-service";
import { DestinationPicker } from "@/features/questionnaire/components/destination-picker";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Questionário | Meu Visto Fácil",
};

export default async function QuestionnaireOverviewPage() {
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
            title="Não foi possível carregar os destinos"
            description="Pode ser uma instabilidade temporária. Tente novamente em alguns instantes."
            action={
              <Button asChild variant="outline">
                <Link href="/questionnaire">Tentar novamente</Link>
              </Button>
            }
          />
        </Container>
      </main>
    );
  }
  if (overview.kind === "PROFILE_REQUIRED") redirect("/profile");
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: "/dashboard" },
            { label: "Questionário" },
          ]}
        />
        <header className="max-w-2xl pt-2 pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Para onde você pensa em ir?
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Cada país tem perguntas próprias, porque os vistos e as regras
            mudam. Responda para quantos destinos quiser; leva poucos minutos
            cada um.
          </p>
        </header>
        <div className="max-w-2xl">
          <DestinationPicker destinations={overview.destinations} />
        </div>
      </Container>
    </main>
  );
}
