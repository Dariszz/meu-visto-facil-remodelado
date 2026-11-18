import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";

import type { Country, VisaCategory, VisaSummary } from "./types";

export function CategoryPage({
  country,
  category,
  summaries,
}: {
  country: Country;
  category: VisaCategory;
  summaries: readonly VisaSummary[];
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: country.name, href: "/ireland" },
            { label: category.name },
          ]}
        />
        <PageSection className="pt-4">
          <h1 className="max-w-3xl text-display font-semibold text-balance">
            {category.name} na {country.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </PageSection>
        <PageSection aria-labelledby="options-title" className="border-t pt-8">
          <h2
            id="options-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {summaries.length
              ? "Primeiros caminhos do catálogo"
              : "Opções detalhadas em breve"}
          </h2>
          {summaries.length ? (
            <>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                Explore os caminhos publicados, com requisitos e fontes
                oficiais.
              </p>
              <ul className="mt-8 divide-y border-y">
                {summaries.map((visa) => (
                  <li
                    key={visa.slug}
                    className="grid gap-x-10 gap-y-4 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-balance">
                        {visa.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {visa.type}
                      </p>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                        {visa.shortDescription}
                      </p>
                    </div>
                    <div>
                      {visa.detailsHref ? (
                        <Button asChild variant="outline">
                          <Link
                            href={visa.detailsHref}
                            aria-label={`Ver detalhes de ${visa.name}`}
                          >
                            Ver detalhes
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          disabled
                          variant="outline"
                          aria-label={`Detalhes de ${visa.name} em breve`}
                        >
                          Detalhes em breve
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-6 max-w-2xl border-l-4 border-primary/50 bg-card px-6 py-5">
              <p className="leading-relaxed">
                Esta parte do catálogo está em preparação. Quando houver
                conteúdo revisado, as opções e suas referências aparecem aqui.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Por enquanto, esta categoria apresenta apenas o tema. Nenhum
                requisito ou permissão específica é informado nesta página.
              </p>
            </div>
          )}
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Este conteúdo é introdutório e não avalia sua elegibilidade. Antes
            de tomar decisões, confirme as condições aplicáveis com as
            autoridades oficiais.
          </p>
          <Link
            href="/ireland"
            className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Explorar outros objetivos
          </Link>
        </PageSection>
      </Container>
    </main>
  );
}
