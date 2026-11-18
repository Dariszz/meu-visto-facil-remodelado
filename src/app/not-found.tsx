import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Página não encontrada | Meu Visto Fácil",
};

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <h1 className="text-3xl font-semibold text-balance">
          Página não encontrada
        </h1>
        <p className="mt-4 max-w-prose">
          O endereço pode ter mudado ou estar incompleto. Confira o link ou
          comece pelos destinos disponíveis.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            Voltar ao início
          </Link>
          <Link
            href="/destinos"
            className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            Ver destinos
          </Link>
        </div>
      </Container>
    </main>
  );
}
