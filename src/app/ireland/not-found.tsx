import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function CatalogNotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <h1 className="text-3xl font-semibold">Conteúdo não disponível</h1>
        <p className="mt-4">
          Esta página não está disponível no catálogo publicado.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center text-primary underline"
        >
          Voltar ao início
        </Link>
      </Container>
    </main>
  );
}
