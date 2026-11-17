import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { QuestionnaireFlow } from "@/features/questionnaire/components/questionnaire-flow";
import { exampleQuestions, previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia do questionário | Meu Visto Fácil",
};

export default function QuestionnairePreviewPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: previewLinks.dashboard },
            { label: "Questionário" },
          ]}
        />
        <div className="mx-auto max-w-2xl pb-10 text-center">
          <p className="text-sm font-medium text-primary">
            Seu perfil migratório · Irlanda
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Conte um pouco sobre seus planos
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Leva poucos minutos. As próximas perguntas mudam conforme suas
            respostas.
          </p>
        </div>
        <QuestionnaireFlow
          questions={exampleQuestions}
          resultHref={previewLinks.recommendations}
        />
      </Container>
    </main>
  );
}
