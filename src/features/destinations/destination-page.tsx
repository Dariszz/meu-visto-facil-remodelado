import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { OfficialSourceItem } from "@/features/sources/official-source-item";
import { cn } from "@/lib/cn";
import { coveragePresentation, dedicatedRouteFor } from "./presentation";
import type { DestinationDetail, DestinationVisa } from "./types";

export function DestinationPage({
  destination,
  visas = [],
}: {
  destination: DestinationDetail;
  visas?: readonly DestinationVisa[];
}) {
  const categories = [...new Set(visas.map((visa) => visa.category))];
  const coverage = coveragePresentation[destination.coverageLevel];
  const dedicatedRoute = dedicatedRouteFor(destination.slug);
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Destinos", href: "/destinos" },
            { label: destination.name },
          ]}
        />
        <header className="max-w-3xl pt-2">
          <h1 className="text-display font-semibold text-balance">
            {destination.name}
          </h1>
          <p
            className={cn(
              "mt-5 flex items-center gap-2 font-medium",
              coverage.text,
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", coverage.dot)}
            />
            {coverage.label}
          </p>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {coverage.description}
          </p>
          {dedicatedRoute && (
            <Button asChild size="lg" className="mt-8">
              <Link href={dedicatedRoute}>
                Ver caminhos para {destination.name}
              </Link>
            </Button>
          )}
        </header>

        {visas.length > 0 && (
          <section aria-labelledby="visas-title" className="mt-14">
            <h2
              id="visas-title"
              className="border-b border-foreground/15 pb-3 text-xl font-semibold tracking-tight"
            >
              Caminhos revisados
            </h2>
            {categories.map((category) => (
              <div key={category} className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h3>
                <ul className="mt-2 divide-y border-y">
                  {visas
                    .filter((visa) => visa.category === category)
                    .map((visa) => (
                      <li
                        key={visa.slug}
                        className="grid gap-x-10 gap-y-2 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                      >
                        <div>
                          <Link
                            href={visa.href}
                            className="text-lg font-semibold text-balance hover:text-primary hover:underline hover:underline-offset-4"
                          >
                            {visa.name}
                          </Link>
                          <p className="mt-1 max-w-2xl leading-relaxed text-muted-foreground">
                            {visa.shortDescription}
                          </p>
                        </div>
                        <Link
                          href={visa.href}
                          aria-label={`Ver requisitos de ${visa.name}`}
                          className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
                        >
                          Ver requisitos
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <section aria-labelledby="sources-title" className="mt-14 max-w-3xl">
          <h2
            id="sources-title"
            className="border-b border-foreground/15 pb-3 text-xl font-semibold tracking-tight"
          >
            Sites oficiais
          </h2>
          {destination.sources.length ? (
            <ul className="divide-y border-b">
              {destination.sources.map((source) => (
                <OfficialSourceItem key={source.id} source={source} />
              ))}
            </ul>
          ) : (
            <p className="py-5 text-muted-foreground">
              Os sites oficiais deste destino ainda estão em revisão.
            </p>
          )}
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Só mostramos links de domínios oficiais verificados, com a evidência
            de que pertencem ao governo registrada no projeto. Desconfie de
            sites que cobram para &ldquo;agilizar&rdquo; vistos ou imitam
            páginas oficiais.
          </p>
        </section>
      </Container>
    </main>
  );
}
