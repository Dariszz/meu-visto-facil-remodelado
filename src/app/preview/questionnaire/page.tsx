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
        <header className="max-w-2xl pt-2 pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Seus planos para a Irlanda
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Algumas perguntas sobre objetivo, trabalho e formação. As próximas
            mudam conforme as suas respostas.
          </p>
        </header>
        <QuestionnaireFlow
          questions={exampleQuestions}
          resultHref={previewLinks.recommendations}
        />
      </Container>
    </main>
  );
}
