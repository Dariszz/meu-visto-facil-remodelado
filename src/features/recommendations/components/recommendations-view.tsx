import Link from "next/link";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Info,
  PencilLine,
  SearchX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  compatibilityPresentation,
  sortByCompatibility,
} from "../compatibility";
import type { ProfileFact, RecommendationView } from "../types";

export function RecommendationsView({
  countryName,
  profileFacts,
  recommendations,
  pendingCategories,
  links,
}: {
  countryName: string;
  profileFacts: readonly ProfileFact[];
  recommendations: readonly RecommendationView[];
  // Categorias ainda sem regras revisadas, apresentadas como "em preparação".
  pendingCategories: readonly string[];
  links: { dashboard: string; questionnaire: string; explore: string };
}) {
  const sorted = sortByCompatibility(recommendations);
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: links.dashboard },
            { label: "Recomendações" },
          ]}
        />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              Caminhos possíveis · {countryName}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              O que pode fazer sentido para você
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Com base nas informações fornecidas, estes caminhos podem ser
              compatíveis com o seu perfil. Veja por que cada um apareceu e o
              que ainda precisa ser confirmado.
            </p>

            {sorted.length ? (
              <ol className="mt-10 space-y-6">
                {sorted.map((recommendation) => (
                  <li key={recommendation.visaSlug}>
                    <RecommendationCard recommendation={recommendation} />
                  </li>
                ))}
              </ol>
            ) : (
              <StatePanel
                className="mt-10"
                icon={SearchX}
                title="Nenhum caminho encontrado por enquanto"
                description="Com as respostas atuais, não identificamos caminhos já revisados pela plataforma. Revise suas respostas ou explore o catálogo."
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

            {pendingCategories.length > 0 && (
              <section
                aria-labelledby="pending-title"
                className="mt-10 rounded-xl border border-dashed p-6"
              >
                <h2 id="pending-title" className="font-semibold">
                  Outros caminhos em preparação
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pendingCategories.join(" e ")} ainda não fazem parte da
                  análise. Estamos revisando as fontes oficiais antes de
                  incluí-los.
                </p>
              </section>
            )}
          </div>

          <aside
            aria-label="Seu perfil"
            className="space-y-5 lg:sticky lg:top-6"
          >
            <Card className="p-6">
              <h2 className="font-semibold">Você informou que</h2>
              <dl className="mt-4 space-y-4 text-sm">
                {profileFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-1 font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link href={links.questionnaire}>
                  <PencilLine aria-hidden="true" /> Revisar respostas
                </Link>
              </Button>
            </Card>
            <p className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                A compatibilidade é uma estimativa baseada em regras e fontes
                oficiais. Não avalia elegibilidade nem garante aprovação.
              </span>
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

function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationView;
}) {
  const level = compatibilityPresentation[recommendation.compatibility];
  const muted =
    recommendation.compatibility === "LOW" ||
    recommendation.compatibility === "NOT_RECOMMENDED";
  return (
    <Card className={cn("overflow-hidden", muted && "bg-card/70")}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              level.tone,
            )}
          >
            {level.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {recommendation.categoryName}
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          {recommendation.visaName}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {level.description}
        </p>
        <p className="mt-4 leading-relaxed">{recommendation.summary}</p>

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
            <div className="rounded-lg bg-warning-subtle p-4 md:col-span-2">
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
            Fontes:{" "}
            {recommendation.sources
              .map((source) => `${source.title} (${source.authority})`)
              .join("; ")}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3 border-t bg-muted/40 px-6 py-4 sm:px-8">
        {recommendation.startProcessHref && (
          <Button asChild>
            <Link
              href={recommendation.startProcessHref}
              aria-label={`Iniciar processo de ${recommendation.visaName}`}
            >
              Iniciar processo <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        )}
        {recommendation.detailsHref ? (
          <Button asChild variant="outline">
            <Link
              href={recommendation.detailsHref}
              aria-label={`Ver detalhes de ${recommendation.visaName}`}
            >
              Ver detalhes
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Detalhes em breve
          </Button>
        )}
      </div>
    </Card>
  );
}
