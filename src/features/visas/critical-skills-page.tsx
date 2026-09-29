import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatConsultedDate,
  type CriticalSkillsPresentation,
} from "./catalog-presentation";

function Reference({
  sourceIds,
  sources,
}: {
  sourceIds: string[];
  sources: CriticalSkillsPresentation["sources"];
}) {
  const available = sourceIds.filter((id) => sources[id]);
  return available.length ? (
    available.map((id) => (
      <a
        key={id}
        href={`#source-${id}`}
        className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
      >
        Fonte: {sources[id].title}
      </a>
    ))
  ) : (
    <p className="mt-3 text-sm text-muted-foreground">
      Referência em atualização.
    </p>
  );
}

export function CriticalSkillsPage({
  visa,
}: {
  visa: CriticalSkillsPresentation;
}) {
  const sources = visa.sources;
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: visa.countryName, href: "/ireland" },
            { label: "Trabalho", href: "/ireland/work" },
            { label: "Critical Skills" },
          ]}
        />
        <PageSection className="pt-4">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <Badge variant="secondary">
                {visa.countryName} · {visa.category}
              </Badge>
              <h1 className="mt-5 max-w-3xl text-display font-semibold">
                {visa.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {visa.description}
              </p>
              <Reference sources={sources} sourceIds={visa.overviewSourceIds} />
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#requisitos" className={buttonVariants()}>
                  Entender os requisitos
                </a>
                <a
                  href="#fontes"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Consultar fontes oficiais
                </a>
              </div>
            </div>
            <Card className="gap-0 bg-secondary p-6 sm:p-8">
              <BookOpen aria-hidden="true" className="size-7 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Antes de planejar</h2>
              <p className="mt-3 leading-relaxed">
                Use esta página como ponto de partida para entender o caminho e
                preparar suas perguntas.
              </p>
              <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                Consulta editorial às fontes:
                <br />
                datas indicadas em cada fonte.
                <br />
                Não é uma revisão jurídica.
              </p>
            </Card>
          </div>
        </PageSection>
        <PageSection aria-labelledby="publico" className="border-t">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <h2
                id="publico"
                className="text-2xl font-semibold tracking-tight"
              >
                Para quem pode ser relevante
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {visa.audience}
              </p>
              <Reference sources={sources} sourceIds={visa.overviewSourceIds} />
            </div>
            <dl className="grid gap-6 sm:grid-cols-2">
              {visa.attributes.map((item) => (
                <div key={item.title}>
                  <dt className="font-semibold">{item.title}</dt>
                  <dd className="mt-2 leading-relaxed text-muted-foreground">
                    {item.text}
                    <br />
                    <Reference sources={sources} sourceIds={item.sourceIds} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </PageSection>
        <PageSection aria-labelledby="requisitos" className="border-t">
          <h2
            id="requisitos"
            className="scroll-mt-6 text-3xl font-semibold tracking-tight"
          >
            Principais requisitos
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Este é um resumo, não uma lista completa nem uma avaliação do seu
            perfil. Consulte as condições e exceções na fonte oficial.
          </p>
          {visa.requirements.length === 0 && (
            <p className="mt-6">
              Requisitos em atualização. Consulte as fontes oficiais.
            </p>
          )}
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {visa.requirements.map((item) => (
              <li key={item.title}>
                <Card className="h-full gap-0 p-6 sm:p-8">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                  <Reference sources={sources} sourceIds={item.sourceIds} />
                </Card>
              </li>
            ))}
          </ul>
        </PageSection>
        <PageSection
          aria-labelledby="permissoes"
          className="rounded-xl bg-secondary px-6 sm:px-8"
        >
          <Info aria-hidden="true" className="size-7 text-primary" />
          <h2
            id="permissoes"
            className="mt-4 text-2xl font-semibold tracking-tight"
          >
            Trabalho, entrada e residência
          </h2>
          <p className="mt-3 text-muted-foreground">
            Entenda o papel de cada autorização no planejamento.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {visa.permissions.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <Reference sources={sources} sourceIds={item.sourceIds} />
              </div>
            ))}
          </div>
        </PageSection>
        <PageSection aria-labelledby="etapas">
          <h2 id="etapas" className="text-3xl font-semibold tracking-tight">
            Etapas gerais do caminho
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-2">
            {visa.steps.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                  <Reference sources={sources} sourceIds={item.sourceIds} />
                </div>
              </li>
            ))}
          </ol>
        </PageSection>
        <PageSection aria-labelledby="fontes" className="border-t">
          <h2
            id="fontes"
            className="scroll-mt-6 text-3xl font-semibold tracking-tight"
          >
            Fontes oficiais
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Páginas em inglês, com datas de consulta indicadas abaixo. Regras
            podem mudar após a consulta; confirme a orientação atual diretamente
            com a autoridade responsável.
          </p>
          {Object.keys(sources).length === 0 && (
            <p className="mt-6">Fontes em atualização.</p>
          )}
          <ul className="mt-8 divide-y rounded-xl border bg-card px-6 sm:px-8">
            {Object.entries(sources).map(([id, source]) => (
              <li key={id} id={`source-${id}`} className="scroll-mt-6 py-6">
                {source.url ? (
                  <a
                    href={source.url}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4"
                  >
                    {source.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </a>
                ) : (
                  <p className="font-semibold">
                    {source.title} — Link indisponível
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {source.authority}
                  {source.consultedAt && (
                    <>
                      {" "}
                      · Consulta editorial:{" "}
                      <time dateTime={source.consultedAt}>
                        {formatConsultedDate(source.consultedAt)}
                      </time>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
          <aside
            aria-label="Aviso sobre o conteúdo"
            className="mt-8 max-w-3xl border-l-4 border-primary pl-5 text-sm leading-relaxed text-muted-foreground"
          >
            {visa.disclaimer}
          </aside>
          <Link
            href="/ireland/work"
            className={buttonVariants({ variant: "ghost", className: "mt-8" })}
          >
            <ArrowLeft aria-hidden="true" />
            Voltar para trabalho na Irlanda
          </Link>
        </PageSection>
      </Container>
    </main>
  );
}
