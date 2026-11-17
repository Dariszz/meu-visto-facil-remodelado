import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { calculateChecklistProgress } from "@/features/checklists/progress";
import {
  describeProgress,
  ItemStrip,
} from "@/features/checklists/components/item-strip";
import {
  formatLongDate,
  processStatusPresentation,
} from "@/features/checklists/components/status-presentation";
import { cn } from "@/lib/cn";
import type {
  DashboardView as DashboardData,
  ProcessSummaryView,
} from "../types";

// Questionário e recomendações são opcionais até as fases 13 e 17 existirem
// com dados reais; sem link, a tela não oferece o atalho.
export type DashboardLinks = {
  explore: string;
  questionnaire?: string;
  recommendations?: string;
};

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function summarize(processes: readonly ProcessSummaryView[]) {
  const progress = calculateChecklistProgress(
    processes.flatMap((process) =>
      process.itemStatuses.map((status) => ({ status })),
    ),
  );
  const active = processes.filter((p) => p.status === "ACTIVE").length;
  const paused = processes.filter((p) => p.status === "PAUSED").length;
  const parts = [
    plural(active, "processo em andamento", "processos em andamento"),
  ];
  if (paused) parts.push(plural(paused, "pausado", "pausados"));
  return `Você tem ${parts.join(" e ")}. ${plural(
    progress.completed,
    "item concluído",
    "itens concluídos",
  )}, ${progress.remaining} em aberto.`;
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

  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-10 sm:py-14">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {data.displayName ? `Olá, ${data.displayName}` : "Olá!"}
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground tabular-nums">
              {visible.length
                ? summarize(visible)
                : "Você ainda não tem processos. Comece entendendo quais caminhos podem servir para você."}
            </p>
          </div>
          {visible.length > 0 && links.recommendations && (
            <Button asChild variant="outline">
              <Link href={links.recommendations}>Ver recomendações</Link>
            </Button>
          )}
        </header>

        <section aria-labelledby="processes-title" className="mt-12">
          <h2
            id="processes-title"
            className="border-b border-foreground/15 pb-3 text-lg font-semibold tracking-tight"
          >
            Seus processos
          </h2>
          {visible.length ? (
            <ul className="divide-y border-b">
              {visible.map((process) => (
                <ProcessRow key={process.id} process={process} />
              ))}
            </ul>
          ) : (
            <StatePanel
              className="mt-6"
              headingLevel={3}
              icon={FolderOpen}
              title="Nenhum processo salvo"
              description={
                links.questionnaire
                  ? "Responda ao questionário e escolha um caminho. O checklist e o progresso de cada etapa aparecem aqui."
                  : "Quando você iniciar um processo, o checklist e o progresso de cada etapa aparecem aqui. Enquanto isso, explore os caminhos disponíveis."
              }
              action={
                <>
                  {links.questionnaire && (
                    <Button asChild>
                      <Link href={links.questionnaire}>
                        Responder questionário
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant={links.questionnaire ? "outline" : "default"}
                  >
                    <Link href={links.explore}>Explorar Irlanda</Link>
                  </Button>
                </>
              }
            />
          )}
        </section>

        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {links.questionnaire && (
            <section aria-labelledby="profile-title">
              <h2 id="profile-title" className="font-semibold">
                {data.hasCompletedQuestionnaire
                  ? "Seu perfil migratório"
                  : "Conte sobre seus planos"}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {data.hasCompletedQuestionnaire
                  ? "Mudou algo nos seus planos? Atualize as respostas para rever os caminhos."
                  : "Algumas perguntas ajudam a mostrar caminhos que podem servir para você."}
              </p>
              <Link
                href={links.questionnaire}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
              >
                {data.hasCompletedQuestionnaire
                  ? "Revisar respostas"
                  : "Começar questionário"}
              </Link>
            </section>
          )}
          <section aria-labelledby="explore-title">
            <h2 id="explore-title" className="font-semibold">
              Explorar a Irlanda
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Caminhos de trabalho, estudo e família, com as fontes oficiais de
              cada um.
            </p>
            <Link
              href={links.explore}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
            >
              Ver caminhos
            </Link>
          </section>
        </div>
      </Container>
    </main>
  );
}

function ProcessRow({ process }: { process: ProcessSummaryView }) {
  const status = processStatusPresentation[process.status];
  const progress = calculateChecklistProgress(
    process.itemStatuses.map((itemStatus) => ({ status: itemStatus })),
  );
  const isActive = process.status === "ACTIVE";
  return (
    <li className="grid gap-x-10 gap-y-4 py-6 md:grid-cols-[minmax(0,1fr)_15rem_7rem] md:items-center">
      <div className="min-w-0">
        <h3 className="font-semibold leading-snug tracking-tight text-balance">
          <Link
            href={process.href}
            className="hover:text-primary hover:underline hover:underline-offset-4"
          >
            {process.title}
          </Link>
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span
            className={cn("flex items-center gap-1.5 font-medium", status.text)}
          >
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", status.dot)}
            />
            {status.label}
          </span>
          <span>
            {process.visaName}, {process.countryName}
          </span>
          <span>Atualizado em {formatLongDate(process.updatedAt)}</span>
        </p>
        {process.nextStep && (
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Próximo passo:</span>{" "}
            {process.nextStep}
          </p>
        )}
      </div>
      <div>
        <ItemStrip
          statuses={process.itemStatuses}
          label={describeProgress(process.itemStatuses)}
        />
        <p className="mt-2 text-sm text-muted-foreground tabular-nums">
          {progress.completed} de {progress.applicable} itens
        </p>
      </div>
      <div className="md:text-right">
        <Button asChild variant={isActive ? "default" : "outline"}>
          <Link
            href={process.href}
            aria-label={`${isActive ? "Continuar" : "Abrir"} ${process.title}`}
          >
            {isActive ? "Continuar" : "Abrir"}
          </Link>
        </Button>
      </div>
    </li>
  );
}
