import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { CloudOff, FileQuestion } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { saveIrelandQuestionnaireAction } from "@/features/questionnaire/actions";
import {
  getQuestionnaire,
  type QuestionnaireState,
} from "@/features/questionnaire/application/questionnaire-service";
import { QuestionnaireFlow } from "@/features/questionnaire/components/questionnaire-flow";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Questionário | Meu Visto Fácil",
};

export default async function QuestionnairePage() {
  let state: QuestionnaireState;
  try {
    state = await getQuestionnaire("ireland");
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <QuestionnaireShell>
        <StatePanel
          tone="error"
          icon={CloudOff}
          title="Não foi possível carregar o questionário"
          description="Pode ser uma instabilidade temporária. Tente novamente em alguns instantes."
          action={
            <Button asChild variant="outline">
              <Link href="/questionnaire">Tentar novamente</Link>
            </Button>
          }
        />
      </QuestionnaireShell>
    );
  }
  if (state.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (state.kind === "UNAVAILABLE_FOR_COUNTRY")
    return (
      <QuestionnaireShell>
        <StatePanel
          icon={FileQuestion}
          title="Questionário em preparação"
          description="As perguntas deste destino ainda não foram publicadas. Enquanto isso, explore os caminhos disponíveis."
          action={
            <Button asChild>
              <Link href="/ireland">Explorar Irlanda</Link>
            </Button>
          }
        />
      </QuestionnaireShell>
    );
  return (
    <QuestionnaireShell
      intro={
        state.complete
          ? "Suas respostas estão salvas. Revise o que mudou e salve de novo."
          : "Algumas perguntas sobre objetivo, trabalho e formação. As próximas mudam conforme as suas respostas."
      }
    >
      <QuestionnaireFlow
        questions={state.questions}
        initialAnswers={state.answers}
        submitAction={saveIrelandQuestionnaireAction}
      />
    </QuestionnaireShell>
  );
}

function QuestionnaireShell({
  intro,
  children,
}: {
  intro?: string;
  children: ReactNode;
}) {
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
            Seus planos para a Irlanda
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
