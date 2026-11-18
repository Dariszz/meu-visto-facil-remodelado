"use client";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

// Erro inesperado fora das áreas que têm tela própria. Sem detalhes técnicos.
export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <h1 className="text-3xl font-semibold text-balance">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-4 max-w-prose">
          Algo deu errado do nosso lado. Tente novamente em alguns instantes.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button onClick={reset}>Tentar novamente</Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            Voltar ao início
          </Link>
        </div>
      </Container>
    </main>
  );
}
