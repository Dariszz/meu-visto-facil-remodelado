import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CloudOff, FileQuestion, FolderOpen } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { ChecklistSkeleton } from "@/features/checklists/components/checklist-skeleton";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { RecommendationsSkeleton } from "@/features/recommendations/components/recommendations-skeleton";
import { previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia dos estados da interface | Meu Visto Fácil",
};

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t py-10">
      <h2 id={id} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StatesPreviewPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <div className="py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Carregamento, erro e vazio
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Nenhuma tela deve quebrar quando os dados demoram, falham ou ainda
            não existem.
          </p>
        </div>

        <Section
          id="loading"
          title="Carregando"
          description="Esqueletos anunciados a leitores de tela como status."
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <DashboardSkeleton />
            <div className="space-y-10">
              <RecommendationsSkeleton />
              <ChecklistSkeleton />
            </div>
          </div>
        </Section>

        <Section
          id="error"
          title="Erro"
          description="Mensagem clara, sem detalhes técnicos, com uma saída."
        >
          <StatePanel
            tone="error"
            headingLevel={3}
            icon={CloudOff}
            title="Não foi possível carregar seus processos"
            description="Pode ser uma instabilidade temporária. Seus dados não foram perdidos. Tente novamente em alguns instantes."
            action={
              <Button asChild variant="outline">
                <Link href={previewLinks.states}>Tentar novamente</Link>
              </Button>
            }
          />
        </Section>

        <Section
          id="empty"
          title="Vazio"
          description="Explica o que vai aparecer e qual é o próximo passo."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <StatePanel
              headingLevel={3}
              icon={FolderOpen}
              title="Nenhum processo salvo"
              description="Depois de escolher um caminho, seu checklist aparece aqui."
              action={
                <Button asChild>
                  <Link href={previewLinks.questionnaire}>
                    Responder questionário
                  </Link>
                </Button>
              }
            />
            <StatePanel
              headingLevel={3}
              icon={FileQuestion}
              title="Processo não encontrado"
              description="Este processo não existe ou não pertence à sua conta."
              action={
                <Button asChild variant="outline">
                  <Link href={previewLinks.dashboard}>Voltar ao painel</Link>
                </Button>
              }
            />
          </div>
        </Section>
      </Container>
    </main>
  );
}
