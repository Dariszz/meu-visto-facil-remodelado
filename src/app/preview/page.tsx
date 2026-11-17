import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  LayoutDashboard,
  ListChecks,
  Loader,
  Route,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévias de interface | Meu Visto Fácil",
};

const screens = [
  {
    href: previewLinks.dashboard,
    icon: LayoutDashboard,
    title: "Painel",
    phase: "Fases 12 e 31",
    text: "Saudação, resumo do progresso e processos salvos.",
    variant: { href: previewLinks.dashboardEmpty, label: "Ver estado vazio" },
  },
  {
    href: previewLinks.questionnaire,
    icon: ListChecks,
    title: "Questionário",
    phase: "Fases 13 e 14",
    text: "Perguntas passo a passo, com perguntas condicionais e revisão final.",
  },
  {
    href: previewLinks.recommendations,
    icon: Route,
    title: "Recomendações",
    phase: "Fase 17",
    text: "Caminhos por compatibilidade, critérios atendidos e pontos a confirmar.",
    variant: {
      href: previewLinks.recommendationsNoOffer,
      label: "Ver cenário com impedimento",
    },
  },
  {
    href: previewLinks.process,
    icon: ClipboardCheck,
    title: "Processo e checklist",
    phase: "Fases 22 e 23",
    text: "Itens por categoria, fontes, filtros e progresso que atualiza ao marcar.",
  },
  {
    href: previewLinks.states,
    icon: Loader,
    title: "Estados da interface",
    phase: "Fase 36",
    text: "Carregamento, erro e vazio usados pelas telas privadas.",
  },
] as const;

export default function PreviewIndexPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-12 sm:py-16">
        <p className="text-sm font-medium text-primary">Em construção</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Prévias das próximas telas
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Interfaces prontas para receber os dados reais nas próximas fases. Use
          estas páginas para revisar layout, textos e interações.
        </p>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {screens.map((screen) => (
            <li key={screen.href}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <screen.icon
                    aria-hidden="true"
                    className="size-6 text-primary"
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {screen.phase}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {screen.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {screen.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5">
                  <Link
                    href={screen.href}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
                  >
                    Abrir prévia{" "}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  {"variant" in screen && (
                    <Link
                      href={screen.variant.href}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4"
                    >
                      {screen.variant.label}
                    </Link>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
