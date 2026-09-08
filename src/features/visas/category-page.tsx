import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { irelandVisaSummaries } from "./data/ireland";
import type { VisaCategory } from "./types";

export function CategoryPage({ category }: { category: VisaCategory }) {
  const summaries = irelandVisaSummaries.filter(
    (visa) => visa.categorySlug === category.slug,
  );
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Início", href: "/" },
            { label: "Irlanda", href: "/ireland" },
            { label: category.name },
          ]}
        />
        <PageSection className="pt-4">
          <Badge variant="secondary">Explore a Irlanda</Badge>
          <h1 className="mt-5 text-display font-semibold">
            {category.name} na Irlanda
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
                Apresentações iniciais para orientar sua navegação. Os
                requisitos e as fontes oficiais de cada opção ainda estão em
                preparação.
              </p>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {summaries.map((visa) => (
                  <Card key={visa.slug} className="flex flex-col p-6 sm:p-8">
                    <p className="text-sm font-medium text-primary">
                      {visa.type} · {category.name}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                      {visa.name}
                    </h3>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      {visa.shortDescription}
                    </p>
                    <div className="mt-auto pt-6">
                      <Button
                        disabled
                        variant="outline"
                        aria-label={`Ver detalhes de ${visa.name} — em breve`}
                      >
                        Ver detalhes — em breve
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 max-w-2xl rounded-xl bg-secondary p-6 sm:p-8">
              <BookOpen aria-hidden="true" className="size-7 text-primary" />
              <p className="mt-4 leading-relaxed">
                Estamos preparando esta parte do catálogo. Quando houver
                conteúdo revisado, você poderá conhecer as opções e consultar
                suas referências aqui.
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
          <Button asChild variant="ghost" className="mt-6">
            <Link href="/ireland">
              <ArrowLeft aria-hidden="true" /> Explorar outros objetivos
            </Link>
          </Button>
        </PageSection>
      </Container>
    </main>
  );
}
