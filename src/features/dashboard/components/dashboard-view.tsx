import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatLongDate,
  processStatusPresentation,
} from "@/features/checklists/components/status-presentation";
import { cn } from "@/lib/cn";
import type {
  DashboardView as DashboardData,
  ProcessSummaryView,
} from "../types";

export type DashboardLinks = {
  explore: string;
  questionnaire: string;
  recommendations: string;
};

function percentOf(process: ProcessSummaryView) {
  return process.applicableItems === 0
    ? 0
    : Math.floor((process.completedItems / process.applicableItems) * 100);
}

export function DashboardView({
  data,
  links,
}: {
  data: DashboardData;
  links: DashboardLinks;
}) {
  const visible = data.processes.filter(
    (process) => process.status !== "ARCHIVED",
  );
  const active = visible.filter((process) => process.status === "ACTIVE");
  const completed = visible.reduce(
    (total, process) => total + process.completedItems,
    0,
  );
  const remaining = visible.reduce(
    (total, process) =>
      total + process.applicableItems - process.completedItems,
    0,
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-10 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-primary">Seu painel</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {data.displayName ? `Olá, ${data.displayName}` : "Olá!"}
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              {visible.length
                ? "Acompanhe seus processos e mantenha o próximo passo à vista."
                : "Você ainda não tem processos. Comece entendendo seus caminhos."}
            </p>
          </div>
          {visible.length > 0 && (
            <Button asChild variant="outline">
              <Link href={links.recommendations}>
                Ver recomendações <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>

        {visible.length > 0 && (
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {(
              [
                ["Processos ativos", active.length],
                ["Itens concluídos", completed],
                ["Itens restantes", remaining],
              ] as const
            ).map(([label, value]) => (
              <Card key={label} className="p-5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight">
                  {value}
                </dd>
              </Card>
            ))}
          </dl>
        )}

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-labelledby="processes-title">
            <h2
              id="processes-title"
              className="text-xl font-semibold tracking-tight"
            >
              Seus processos
            </h2>
            {visible.length ? (
              <ul className="mt-5 space-y-4">
                {visible.map((process) => (
                  <ProcessCard key={process.id} process={process} />
                ))}
              </ul>
            ) : (
              <StatePanel
                className="mt-5"
                headingLevel={3}
                icon={FolderOpen}
                title="Nenhum processo salvo"
                description="Depois de responder ao questionário e escolher um caminho, seu checklist aparece aqui com o progresso de cada etapa."
                action={
                  <>
                    <Button asChild>
                      <Link href={links.questionnaire}>
                        Responder questionário
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={links.explore}>Explorar Irlanda</Link>
                    </Button>
                  </>
                }
              />
            )}
          </section>

          <aside aria-label="Atalhos" className="space-y-5">
            <Card className="overflow-hidden">
              <div className="bg-secondary p-6">
                <Sparkles aria-hidden="true" className="size-6 text-primary" />
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {data.hasCompletedQuestionnaire
                    ? "Seu perfil migratório"
                    : "Conte sobre seus planos"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">
                  {data.hasCompletedQuestionnaire
                    ? "Mudou algo nos seus planos? Atualize as respostas para rever os caminhos."
                    : "Algumas perguntas rápidas ajudam a mostrar caminhos que podem fazer sentido para você."}
                </p>
              </div>
              <div className="p-6 pt-5">
                <Button asChild variant="secondary" className="w-full">
                  <Link href={links.questionnaire}>
                    {data.hasCompletedQuestionnaire
                      ? "Revisar respostas"
                      : "Começar questionário"}
                  </Link>
                </Button>
              </div>
            </Card>
            <Card className="p-6">
              <Compass aria-hidden="true" className="size-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                Explorar Irlanda
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Consulte caminhos de trabalho, estudo e família com fontes
                oficiais.
              </p>
              <Link
                href={links.explore}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
              >
                Ver opções <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function ProcessCard({ process }: { process: ProcessSummaryView }) {
  const percent = percentOf(process);
  const status = processStatusPresentation[process.status];
  return (
    <li>
      <Card className="p-6 transition-shadow hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                  status.tone,
                )}
              >
                {status.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {process.countryName}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
              {process.title}
            </h3>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-primary">
            {percent}%
          </p>
        </div>
        <Progress
          value={percent}
          aria-label={`Progresso de ${process.title}`}
          className="mt-5"
        />
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {process.completedItems} de {process.applicableItems} itens
            concluídos
          </span>
          <span>Atualizado em {formatLongDate(process.updatedAt)}</span>
        </div>
        {process.nextStep && (
          <p className="mt-5 flex gap-3 rounded-lg bg-muted/70 p-4 text-sm">
            <ClipboardList
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            <span>
              <span className="font-medium">Próximo passo: </span>
              {process.nextStep}
            </span>
          </p>
        )}
        <div className="mt-5">
          <Button
            asChild
            variant={process.status === "ACTIVE" ? "default" : "outline"}
          >
            <Link
              href={process.href}
              aria-label={`${process.status === "ACTIVE" ? "Continuar" : "Abrir"} ${process.title}`}
            >
              {process.status === "ACTIVE" ? "Continuar" : "Abrir"}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Card>
    </li>
  );
}
