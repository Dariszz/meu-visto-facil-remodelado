import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { buttonVariants } from "@/components/ui/button";
import { OfficialSourceItem } from "@/features/sources/official-source-item";
import type { CriticalSkillsPresentation } from "./catalog-presentation";

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
              <h1 className="max-w-3xl text-display font-semibold text-balance">
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
            <aside className="border-t border-foreground/15 pt-4 lg:mt-3">
              <h2 className="font-semibold">Antes de planejar</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Use esta página como ponto de partida para entender o caminho e
                preparar suas perguntas.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                As datas de consulta editorial estão indicadas em cada fonte.
                Não é uma revisão jurídica.
              </p>
            </aside>
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
          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {visa.requirements.map((item) => (
              <li
                key={item.title}
                className="border-t border-foreground/15 py-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <Reference sources={sources} sourceIds={item.sourceIds} />
              </li>
            ))}
          </ul>
        </PageSection>
        <PageSection aria-labelledby="permissoes" className="border-t">
          <h2 id="permissoes" className="text-2xl font-semibold tracking-tight">
            Trabalho, entrada e residência
          </h2>
          <p className="mt-3 text-muted-foreground">
            Entenda o papel de cada autorização no planejamento.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {visa.permissions.map((item) => (
              <div
                key={item.title}
                className="border-l-4 border-primary/40 bg-card px-5 py-4"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <Reference sources={sources} sourceIds={item.sourceIds} />
              </div>
            ))}
          </div>
        </PageSection>
        <PageSection aria-labelledby="etapas" className="border-t">
          <h2 id="etapas" className="text-3xl font-semibold tracking-tight">
            Etapas gerais do caminho
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-2">
            {visa.steps.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="pt-0.5 text-xl font-semibold text-primary tabular-nums"
                >
                  {index + 1}.
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
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A consulta editorial indica quando o conteúdo foi consultado. A
            verificação técnica registra a disponibilidade do link naquele
            momento; não confirma que as regras continuam atuais. Uma fonte
            cadastrada pode ainda não ter uma verificação registrada.
          </p>
          {Object.keys(sources).length === 0 && (
            <p className="mt-6">Fontes em atualização.</p>
          )}
          <ul className="mt-8 divide-y border-y">
            {Object.values(sources).map((source) => (
              <OfficialSourceItem key={source.id} source={source} />
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
            className="mt-8 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Voltar para trabalho na Irlanda
          </Link>
        </PageSection>
      </Container>
    </main>
  );
}
