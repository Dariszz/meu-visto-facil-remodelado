import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { irelandCategories } from "./data/ireland";

export function IrelandPage({
  country: ireland,
}: {
  country: import("./types").Country;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <Breadcrumbs
          items={[{ label: "Início", href: "/" }, { label: ireland.name }]}
        />
        <PageSection className="pt-4">
          <h1 className="max-w-3xl text-display font-semibold text-balance">
            {ireland.name}, por onde começar?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Uma mudança começa com uma intenção. Escolha o objetivo que mais se
            aproxima do seu para ver o que já está organizado sobre a Irlanda.
          </p>
        </PageSection>
        <PageSection aria-labelledby="categories-title" className="pt-0">
          <h2
            id="categories-title"
            className="border-b border-foreground/15 pb-3 text-lg font-semibold tracking-tight"
          >
            O que leva você à Irlanda?
          </h2>
          <ul className="divide-y border-b">
            {Object.values(irelandCategories).map((category) => (
              <li
                key={category.slug}
                className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-baseline"
              >
                <h3 className="text-2xl font-semibold tracking-tight">
                  {category.name}
                </h3>
                <div>
                  <p className="max-w-xl leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-2 text-sm">
                    {category.slug === "work"
                      ? "Caminhos de trabalho disponíveis"
                      : "Opções detalhadas em breve"}
                  </p>
                </div>
                <Button
                  asChild
                  variant={category.slug === "work" ? "default" : "outline"}
                >
                  <Link href={`/ireland/${category.slug}`}>
                    Explorar {category.name.toLowerCase()}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl leading-relaxed text-muted-foreground">
            Este é o começo do catálogo. Novos caminhos entram conforme as
            informações forem organizadas e revisadas.
          </p>
        </PageSection>
      </Container>
    </main>
  );
}
