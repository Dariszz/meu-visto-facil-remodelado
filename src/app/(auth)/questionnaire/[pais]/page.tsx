import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { CloudOff, FileQuestion } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import {
  isRecommendationDestination,
  recommendationDestinations,
} from "@/features/destinations/registry";
import { saveQuestionnaireAction } from "@/features/questionnaire/actions";
import {
  getQuestionnaire,
  type QuestionnaireState,
} from "@/features/questionnaire/application/questionnaire-service";
import { QuestionnaireFlow } from "@/features/questionnaire/components/questionnaire-flow";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Questionário | Meu Visto Fácil",
};

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!isRecommendationDestination(pais)) notFound();
  const { name, inName } = recommendationDestinations[pais];
  let state: QuestionnaireState;
  try {
    state = await getQuestionnaire(pais);
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <QuestionnaireShell name={name} inName={inName}>
        <StatePanel
          tone="error"
          icon={CloudOff}
          title="Não foi possível carregar o questionário"
          description="Pode ser uma instabilidade temporária. Tente novamente em alguns instantes."
          action={
            <Button asChild variant="outline">
              <Link href={`/questionnaire/${pais}`}>Tentar novamente</Link>
            </Button>
          }
        />
      </QuestionnaireShell>
    );
  }
  if (state.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (state.kind === "UNAVAILABLE_FOR_COUNTRY")
    return (
      <QuestionnaireShell name={name} inName={inName}>
        <StatePanel
          icon={FileQuestion}
          title="Questionário em preparação"
          description="As perguntas deste destino ainda não foram publicadas. Enquanto isso, explore os caminhos disponíveis."
          action={
            <Button asChild>
              <Link href={`/destinos/${pais}`}>Ver os vistos do destino</Link>
            </Button>
          }
        />
      </QuestionnaireShell>
    );
  return (
    <QuestionnaireShell
      name={name}
      inName={inName}
      intro={
        state.complete
          ? "Suas respostas estão salvas. Revise o que mudou e salve de novo."
          : "Algumas perguntas sobre objetivo, trabalho e formação. As próximas mudam conforme as suas respostas."
      }
    >
      <QuestionnaireFlow
        questions={state.questions}
        initialAnswers={state.answers}
        submitAction={saveQuestionnaireAction.bind(null, pais)}
      />
    </QuestionnaireShell>
  );
}

function QuestionnaireShell({
  name,
  inName,
  intro,
  children,
}: {
  name: string;
  inName: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: "/dashboard" },
            { label: "Questionário", href: "/questionnaire" },
            { label: name },
          ]}
        />
        <header className="max-w-2xl pt-2 pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Seus planos {inName}
          </h1>
          {intro && (
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}
        </header>
        {children}
      </Container>
    </main>
  );
}
