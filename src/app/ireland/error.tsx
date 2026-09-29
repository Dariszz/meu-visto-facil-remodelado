"use client";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function CatalogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <h1 className="text-3xl font-semibold">
          Não foi possível carregar o catálogo
        </h1>
        <p className="mt-4">Tente novamente em alguns instantes.</p>
        <Button className="mt-6" onClick={reset}>
          Tentar novamente
        </Button>
      </Container>
    </main>
  );
}
