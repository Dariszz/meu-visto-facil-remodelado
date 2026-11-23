import Link from "next/link";
import { CircleAlert, CircleCheck, CircleHelp, SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  compatibilityPresentation,
  sortByCompatibility,
} from "../compatibility";
import { StartProcessForm } from "@/features/processes/components/start-process-form";
import type { StartProcessState } from "@/features/processes/actions";
import type { ProfileFact, RecommendationView } from "../types";

type StartAction = (
  state: StartProcessState,
  form: FormData,
) => Promise<StartProcessState>;

export function RecommendationsView({
  countryName,
  inName,
  profileFacts,
  recommendations,
  links,
  startAction,
}: {
  countryName: string;
  // "na Irlanda", "em Portugal"…
  inName: string;
  profileFacts: readonly ProfileFact[];
  recommendations: readonly RecommendationView[];
  links: {
    dashboard: string;
    questionnaire: string;
    explore: string;
    // Lista de destinos; sem ela, a trilha vai direto do painel ao país.
    overview?: string;
  };
  // Server Action que cria o processo; sem ela, "Iniciar" não aparece.
  startAction?: StartAction;
}) {
  const sorted = sortByCompatibility(recommendations);
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: links.dashboard },
            ...(links.overview
              ? [
                  { label: "Recomendações", href: links.overview },
                  { label: countryName },
                ]
              : [{ label: "Recomendações" }]),
          ]}
        />
        <div className="grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0">
            <h1 className="max-w-2xl pt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Caminhos possíveis {inName}
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Com base nas suas respostas, estes caminhos podem ser compatíveis
              com o seu perfil. Cada um mostra por que apareceu e o que ainda
              precisa ser confirmado.
            </p>

            {sorted.length ? (
              <ol className="mt-10 space-y-8">
                {sorted.map((recommendation) => (
                  <li key={recommendation.visaSlug}>
                    <RecommendationItem
                      recommendation={recommendation}
                      startAction={startAction}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <StatePanel
                className="mt-10"
                icon={SearchX}
                title="Nenhum caminho encontrado por enquanto"
                description="Com as respostas atuais, nenhum caminho já revisado pela plataforma se encaixa. Revise as respostas ou explore o catálogo."
                action={
                  <>
                    <Button asChild>
                      <Link href={links.questionnaire}>Revisar respostas</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={links.explore}>Explorar catálogo</Link>
                    </Button>
                  </>
                }
              />
            )}

            <section
              aria-labelledby="explore-title"
              className="mt-12 max-w-2xl border-t pt-6"
            >
              <h2 id="explore-title" className="font-semibold">
                Todos os caminhos {inName}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A análise mostra os caminhos ligados ao seu objetivo. Você pode
                ver os requisitos de qualquer visto revisado e criar um
                checklist pela página dele.
              </p>
              <Link
                href={links.explore}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
              >
                Ver todos os vistos
              </Link>
            </section>
          </div>

          <aside
            aria-label="Seu perfil"
            className="border-t border-foreground/15 pt-4 lg:sticky lg:top-6 lg:mt-2"
          >
            <h2 className="text-sm font-semibold">Suas respostas</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {profileFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-muted-foreground">{fact.label}</dt>
                  <dd className="font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={links.questionnaire}
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
            >
              Revisar respostas
            </Link>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              A compatibilidade é uma estimativa baseada em regras e fontes
              oficiais. Não avalia elegibilidade nem garante aprovação.
            </p>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function CriteriaList({
  title,
  items,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  items: readonly string[];
  icon: LucideIcon;
  iconClassName: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 leading-snug">
            <Icon
              aria-hidden="true"
              className={cn("mt-0.5 size-4 shrink-0", iconClassName)}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecommendationItem({
  recommendation,
  startAction,
}: {
  recommendation: RecommendationView;
  startAction?: StartAction;
}) {
  const level = compatibilityPresentation[recommendation.compatibility];
  return (
    <article
      aria-labelledby={`visa-${recommendation.visaSlug}`}
      className={cn(
        "rounded-r-lg border-l-4 bg-card py-6 pr-6 pl-6 sm:pr-8 sm:pl-8",
        level.rule,
      )}
    >
      <p className="text-sm">
        <span className={cn("font-semibold", level.text)}>{level.label}</span>
        <span className="text-muted-foreground">
          {" "}
          em {recommendation.categoryName.toLowerCase()}
        </span>
      </p>
      <h2
        id={`visa-${recommendation.visaSlug}`}
        className="mt-2 text-2xl font-semibold tracking-tight text-balance"
      >
        {recommendation.visaName}
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed">{recommendation.summary}</p>
      <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>

      <div className="mt-6 grid gap-6 border-t pt-6 md:grid-cols-2">
        <CriteriaList
          title="Por que apareceu"
          items={recommendation.matchedCriteria}
          icon={CircleCheck}
          iconClassName="text-success"
        />
        <CriteriaList
          title="Ainda precisa confirmar"
          items={recommendation.missingCriteria}
          icon={CircleHelp}
          iconClassName="text-primary"
        />
        {recommendation.blockers.length > 0 && (
          <div className="rounded-md bg-warning-subtle p-4 md:col-span-2">
            <CriteriaList
              title="Possíveis impedimentos"
              items={recommendation.blockers}
              icon={CircleAlert}
              iconClassName="text-warning"
            />
          </div>
        )}
      </div>

      {recommendation.sources.length > 0 && (
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Fonte:{" "}
          {recommendation.sources
            .map((source) => `${source.title} (${source.authority})`)
            .join("; ")}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {recommendation.process?.kind === "OPEN" && (
          <Button asChild>
            <Link
              href={recommendation.process.href}
              aria-label={`Abrir processo de ${recommendation.visaName}`}
            >
              Abrir processo
            </Link>
          </Button>
        )}
        {recommendation.process?.kind === "START" && startAction && (
          <StartProcessForm
            action={startAction}
            visaSlug={recommendation.visaSlug}
            visaName={recommendation.visaName}
          />
        )}
        {recommendation.detailsHref ? (
          <Link
            href={recommendation.detailsHref}
            aria-label={`Ver detalhes de ${recommendation.visaName}`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Ver detalhes do visto
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">
            Página de detalhes em preparação
          </p>
        )}
      </div>
    </article>
  );
}
