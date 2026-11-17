import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévias de interface | Meu Visto Fácil",
};

const screens = [
  {
    href: previewLinks.dashboard,
    title: "Painel",
    phase: "Fases 12 e 31",
    text: "Saudação, resumo do progresso e processos salvos.",
    variant: { href: previewLinks.dashboardEmpty, label: "Sem processos" },
  },
  {
    href: previewLinks.questionnaire,
    title: "Questionário",
    phase: "Fases 13 e 14",
    text: "Uma pergunta por vez, com perguntas condicionais e revisão final.",
  },
  {
    href: previewLinks.recommendations,
    title: "Recomendações",
    phase: "Fase 17",
    text: "Caminhos por compatibilidade, critérios atendidos e pontos a confirmar.",
    variant: {
      href: previewLinks.recommendationsNoOffer,
      label: "Com impedimento",
    },
  },
  {
    href: previewLinks.process,
    title: "Processo e checklist",
    phase: "Fases 22 e 23",
    text: "Itens por categoria, fontes, filtro e progresso que atualiza ao marcar.",
  },
  {
    href: previewLinks.states,
    title: "Estados da interface",
    phase: "Fase 36",
    text: "Carregamento, erro e vazio usados pelas telas privadas.",
  },
] as const;

export default function PreviewIndexPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Prévias das próximas telas
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Interfaces prontas para receber os dados reais nas próximas fases. Use
          estas páginas para revisar layout, textos e interações.
        </p>
        <ul className="mt-10 max-w-3xl divide-y border-y">
          {screens.map((screen) => (
            <li
              key={screen.href}
              className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
            >
              <div>
                <h2 className="font-semibold">
                  <Link
                    href={screen.href}
                    className="text-primary underline underline-offset-4"
                  >
                    {screen.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {screen.text}
                  {"variant" in screen && (
                    <>
                      {" "}
                      Variação:{" "}
                      <Link
                        href={screen.variant.href}
                        className="underline underline-offset-4 hover:text-foreground"
                      >
                        {screen.variant.label.toLowerCase()}
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{screen.phase}</p>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
