import Link from "next/link";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";
import { coveragePresentation } from "./presentation";
import type { DestinationSummary } from "./types";

export function DestinationsPage({
  destinations,
}: {
  destinations: readonly DestinationSummary[];
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-display font-semibold text-balance">
          Para onde você quer ir?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Cada destino mostra o que já está organizado e revisado a partir de
          fontes oficiais. Onde ainda não há revisão, indicamos os sites do
          governo em vez de arriscar informação incompleta.
        </p>
        {destinations.length ? (
          <ul className="mt-12 max-w-4xl divide-y border-y">
            {destinations.map((destination) => {
              const coverage = coveragePresentation[destination.coverageLevel];
              return (
                <li
                  key={destination.code}
                  className="grid gap-x-10 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      <Link
                        href={`/destinos/${destination.slug}`}
                        className="hover:text-primary hover:underline hover:underline-offset-4"
                      >
                        {destination.name}
                      </Link>
                    </h2>
                    <p
                      className={cn(
                        "mt-1.5 flex items-center gap-2 text-sm font-medium",
                        coverage.text,
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-2 rounded-full", coverage.dot)}
                      />
                      {coverage.label}
                    </p>
                  </div>
                  <Link
                    href={`/destinos/${destination.slug}`}
                    aria-label={`Ver ${destination.name}`}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
                  >
                    Ver destino
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-12 text-muted-foreground">
            Nenhum destino publicado no momento.
          </p>
        )}
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Informação geral baseada em fontes oficiais. Não é aconselhamento
          jurídico nem garantia de concessão de visto.
        </p>
      </Container>
    </main>
  );
}
