import { Container } from "@/components/layout/container";

export default function CatalogLoading() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <p role="status">Carregando catálogo…</p>
      </Container>
    </main>
  );
}
