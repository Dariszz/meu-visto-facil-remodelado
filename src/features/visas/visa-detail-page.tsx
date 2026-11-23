import Link from "next/link";
import { loginHref } from "@/lib/auth/safe-redirect";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { buttonVariants } from "@/components/ui/button";
import { StartProcessForm } from "@/features/processes/components/start-process-form";
import type { StartProcessState } from "@/features/processes/actions";
import { OfficialSourceItem } from "@/features/sources/official-source-item";
import type {
  CatalogRequirement,
  CatalogSource,
  CatalogVisa,
} from "./catalog-types";

type StartAction = (
  state: StartProcessState,
  form: FormData,
) => Promise<StartProcessState>;

function SourceRef({
  item,
  sources,
}: {
  item: CatalogRequirement;
  sources: ReadonlyMap<string, CatalogSource>;
}) {
  const available = item.sources
    .map((link) => sources.get(link.sourceId))
    .filter((source): source is CatalogSource => Boolean(source));
  return available.map((source) => (
    <a
      key={source.id}
      href={`#source-${source.id}`}
      className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
    >
      Fonte: {source.title}
    </a>
  ));
}

// Página de visto montada só com dados revisados do catálogo (ADR 0001).
export function VisaDetailPage({
  visa,
  sources,
  signedIn,
  startAction,
}: {
  visa: CatalogVisa;
  sources: readonly CatalogSource[];
  signedIn: boolean;
  startAction: StartAction;
}) {
  const byId = new Map(sources.map((source) => [source.id, source]));
  const paragraphs = (visa.description ?? visa.shortDescription)
    .split(/\n{2,}/)
    .filter(Boolean);
  const countryHref = `/destinos/${visa.country.slug}`;
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Destinos", href: "/destinos" },
            { label: visa.country.name, href: countryHref },
            { label: visa.name },
          ]}
        />
        <PageSection className="pt-4">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <p className="text-sm text-muted-foreground">
                {visa.category.name} em {visa.country.name}
              </p>
              <h1 className="mt-2 max-w-3xl text-display font-semibold text-balance">
                {visa.name}
              </h1>
              {visa.officialName && visa.officialName !== visa.name && (
                <p className="mt-3 text-muted-foreground">
                  Nome oficial: {visa.officialName}
                </p>
              )}
              <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
                {paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {signedIn ? (
                  <StartProcessForm
                    action={startAction}
                    countrySlug={visa.country.slug}
                    visaSlug={visa.slug}
                    visaName={visa.name}
                    label="Criar meu checklist"
                  />
                ) : (
                  <Link
                    href={loginHref(
                      `/destinos/${visa.country.slug}/${visa.slug}`,
                    )}
                    className={buttonVariants()}
                  >
                    Entrar para criar meu checklist
                  </Link>
                )}
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
                Este resumo não substitui assessoria oficial nem avalia o seu
                caso.
              </p>
              {visa.authorityName && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Quem decide: {visa.authorityName}. Confirme requisitos, prazos
                  e valores nos sites oficiais antes de qualquer pedido ou
                  pagamento.
                </p>
              )}
            </aside>
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
            Resumo dos pontos principais, não uma lista completa. Exceções e
            detalhes estão na fonte oficial de cada item.
          </p>
          {visa.requirements.length ? (
            <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
              {visa.requirements.map((item) => (
                <li
                  key={item.code}
                  className="border-t border-foreground/15 py-6"
                >
                  <h3 className="text-xl font-semibold text-balance">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                  <SourceRef item={item} sources={byId} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6">Requisitos em revisão. Consulte as fontes.</p>
          )}
        </PageSection>

        {visa.steps.length > 0 && (
          <PageSection aria-labelledby="etapas" className="border-t">
            <h2 id="etapas" className="text-3xl font-semibold tracking-tight">
              Etapas gerais do caminho
            </h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-2">
              {visa.steps.map((item, index) => (
                <li key={item.code} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="pt-0.5 text-xl font-semibold text-primary tabular-nums"
                  >
                    {index + 1}.
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-balance">
                      {item.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                    <SourceRef item={item} sources={byId} />
                  </div>
                </li>
              ))}
            </ol>
          </PageSection>
        )}

        <PageSection aria-labelledby="fontes" className="border-t">
          <h2
            id="fontes"
            className="scroll-mt-6 text-3xl font-semibold tracking-tight"
          >
            Fontes oficiais
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            As datas de consulta estão em cada fonte. Regras de imigração mudam:
            confirme sempre a orientação atual diretamente no site oficial.
          </p>
          <ul className="mt-8 divide-y border-y">
            {sources.map((source) => (
              <OfficialSourceItem key={source.id} source={source} />
            ))}
          </ul>
          <Link
            href={countryHref}
            className="mt-8 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Ver outros caminhos em {visa.country.name}
          </Link>
        </PageSection>
      </Container>
    </main>
  );
}
