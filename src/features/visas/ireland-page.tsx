import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { irelandCategories } from "./data/ireland";

const icons = { work: BriefcaseBusiness, study: GraduationCap, family: Users };

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
          <Badge variant="secondary">Nosso primeiro destino</Badge>
          <h1 className="mt-5 text-display font-semibold">
            {ireland.name}, por onde começar?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Uma mudança começa com uma intenção. Explore os objetivos abaixo
            para conhecer o que estamos organizando sobre a Irlanda e escolher
            por onde continuar sua pesquisa.
          </p>
        </PageSection>
        <PageSection
          aria-labelledby="categories-title"
          className="border-t pt-8"
        >
          <h2
            id="categories-title"
            className="text-3xl font-semibold tracking-tight"
          >
            O que leva você à Irlanda?
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {Object.values(irelandCategories).map((category) => {
              const Icon = icons[category.slug];
              return (
                <Card key={category.slug} className="flex flex-col p-6 sm:p-8">
                  <Icon aria-hidden="true" className="size-7 text-primary" />
                  <h3 className="mt-6 text-2xl font-semibold">
                    {category.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-5 text-sm text-muted-foreground">
                    {category.slug === "work"
                      ? "Explore os caminhos de trabalho"
                      : "Opções detalhadas em breve"}
                  </p>
                  <div className="mt-auto pt-6">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/ireland/${category.slug}`}>
                        Explorar {category.name.toLowerCase()}{" "}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          <p className="mt-8 max-w-2xl leading-relaxed text-muted-foreground">
            Este é o começo do catálogo. Novos caminhos poderão ser adicionados
            conforme as informações forem organizadas e revisadas.
          </p>
        </PageSection>
      </Container>
    </main>
  );
}
