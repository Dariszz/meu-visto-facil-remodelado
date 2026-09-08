import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  FileCheck2,
  Fingerprint,
  Layers3,
  Route,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ExploreLink() {
  return (
    <Button asChild size="lg">
      <Link href="/ireland">
        Explorar Irlanda <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );
}

function JourneyPreview() {
  return (
    <figure className="relative mx-auto w-full max-w-lg rounded-3xl bg-secondary p-5 sm:p-8">
      <div
        aria-hidden="true"
        className="mb-8 flex items-center justify-between text-primary"
      >
        <Compass className="size-9" strokeWidth={1.2} />
        <span className="text-xs font-semibold tracking-[0.2em]">
          UM NOVO CAPÍTULO
        </span>
      </div>
      <Card className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Seu ponto de partida
          </span>
          <span aria-hidden="true" className="text-2xl">
            ↗
          </span>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          Um plano, passo a passo.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Da primeira pergunta ao próximo passo, tudo em perspectiva.
        </p>
        <ol className="mt-7 space-y-0">
          {(
            [
              ["01", "Seu objetivo", "O que você quer construir?"],
              ["02", "Caminhos possíveis", "Entenda o que precisa confirmar."],
              ["03", "Próximos passos", "Organize sua jornada."],
            ] as const
          ).map(([number, title, text]) => (
            <li key={number} className="flex gap-4 border-t py-4 last:pb-0">
              <span className="pt-1 text-xs font-semibold text-primary">
                {number}
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <figcaption className="mt-5 flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
        <Layers3 aria-hidden="true" className="size-4 shrink-0" />
        Prévia conceitual. Funcionalidades em desenvolvimento.
      </figcaption>
    </figure>
  );
}

const steps = [
  [
    "Conte seu objetivo",
    "Trabalhar, estudar ou estar perto da família. Sua intenção será o ponto de partida.",
  ],
  [
    "Conheça possibilidades",
    "Entenda caminhos que podem fazer sentido para o seu perfil e o que precisa confirmar.",
  ],
  [
    "Organize seu checklist",
    "Reúna etapas, requisitos e referências em uma visão clara.",
  ],
  [
    "Acompanhe seu progresso",
    "Veja o que já foi feito e mantenha o próximo passo à vista.",
  ],
];

export function LandingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <PageSection className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Badge variant="secondary">Novos caminhos. Mais clareza.</Badge>
            <h1 className="mt-6 text-display font-semibold">
              Seu caminho para imigrar começa com{" "}
              <span className="text-primary">informação clara.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Entenda possibilidades, organize requisitos e acompanhe etapas. O
              Meu Visto Fácil está sendo preparado para conectar seu plano de
              mudança a fontes oficiais e orientação personalizada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ExploreLink />
              <Button asChild size="lg" variant="outline">
                <a href="#como-funciona">Como funciona</a>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-primary"
              />
              Primeiro destino: Irlanda. Comece a explorar.
            </p>
          </div>
          <JourneyPreview />
        </PageSection>
      </Container>
      <div className="border-y bg-card">
        <Container className="flex flex-wrap justify-between gap-x-8 gap-y-4 py-6 text-sm font-medium">
          {(
            [
              [BookOpen, "Informação com origem"],
              [Fingerprint, "Seu perfil como ponto de partida"],
              [Route, "Uma etapa de cada vez"],
            ] as const
          ).map(([Icon, label]) => {
            const Mark = Icon;
            return (
              <p key={label} className="flex items-center gap-3">
                <Mark aria-hidden="true" className="size-5 text-primary" />
                {label}
              </p>
            );
          })}
        </Container>
      </div>
      <Container>
        <PageSection id="como-funciona" aria-labelledby="journey-title">
          <p className="text-sm font-semibold text-primary">COMO FUNCIONA</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2
              id="journey-title"
              className="max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Uma mudança grande.
              <br />
              Passos mais claros.
            </h2>
            <p className="max-w-sm leading-relaxed text-muted-foreground">
              A experiência que estamos construindo para tirar seus planos do
              campo das dúvidas.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], index) => (
              <li key={title} className="border-t pt-5">
                <span className="text-sm font-semibold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </PageSection>
        <PageSection
          id="por-que-usar"
          aria-labelledby="benefits-title"
          className="border-t"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-primary">
                MENOS INFORMAÇÃO SOLTA
              </p>
              <h2
                id="benefits-title"
                className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Mais contexto para decidir seu próximo passo.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Pesquisar uma mudança de país não deveria significar se perder
                entre abas, termos difíceis e respostas sem referência.
              </p>
            </div>
            <div className="space-y-7">
              {(
                [
                  [
                    Layers3,
                    "Organização que faz sentido",
                    "Possibilidades, requisitos e etapas conectados, para você enxergar a jornada inteira.",
                  ],
                  [
                    Fingerprint,
                    "Um caminho com o seu contexto",
                    "Personalização a partir do seu objetivo e das informações que você escolher compartilhar.",
                  ],
                  [
                    FileCheck2,
                    "Clareza para continuar",
                    "Checklists e acompanhamento planejados para deixar visível o que ainda precisa de atenção.",
                  ],
                ] as const
              ).map(([Icon, title, text]) => {
                const Mark = Icon;
                return (
                  <div key={title} className="flex gap-4">
                    <Mark
                      aria-hidden="true"
                      className="mt-1 size-6 shrink-0 text-primary"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="mt-2 leading-relaxed text-muted-foreground">
                        {text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PageSection>
      </Container>
      <PageSection
        id="fontes"
        aria-labelledby="sources-title"
        className="bg-primary text-primary-foreground"
      >
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <ShieldCheck
              aria-hidden="true"
              className="size-9"
              strokeWidth={1.5}
            />
            <p className="mt-5 text-sm font-semibold">
              CONFIANÇA COMEÇA NA ORIGEM
            </p>
            <h2
              id="sources-title"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Você merece saber de onde vem a informação.
            </h2>
            <p className="mt-5 leading-relaxed">
              Nosso compromisso é associar informações críticas a fontes
              oficiais. Assim, você poderá consultar a origem e confirmar os
              detalhes com a autoridade responsável.
            </p>
          </div>
          <div className="rounded-xl border border-white/30 p-6 sm:p-8">
            <p className="text-sm font-semibold">
              O que uma informação rastreável deve mostrar
            </p>
            <dl className="mt-6 space-y-5">
              {(
                [
                  ["Origem", "Referência à publicação oficial."],
                  ["Autoridade", "Órgão responsável pela informação."],
                  ["Revisão", "Data da última revisão, quando disponível."],
                ] as const
              ).map(([title, text]) => (
                <div key={title} className="border-t border-white/25 pt-4">
                  <dt className="font-semibold">{title}</dt>
                  <dd className="mt-1 text-sm">{text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed">
              Estrutura ilustrativa. O catálogo de fontes ainda está em
              preparação; nenhuma revisão oficial é afirmada nesta prévia.
            </p>
          </div>
        </Container>
      </PageSection>
      <Container>
        <PageSection id="irlanda" aria-labelledby="ireland-title">
          <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex min-h-64 flex-col justify-between bg-accent p-8 sm:p-10">
              <span className="text-sm font-semibold text-accent-foreground">
                NOSSO PRIMEIRO DESTINO
              </span>
              <div>
                <span
                  aria-hidden="true"
                  className="mb-6 flex h-9 w-16 overflow-hidden rounded-sm border border-border"
                >
                  <span className="w-1/3 bg-success" />
                  <span className="w-1/3 bg-card" />
                  <span className="w-1/3 bg-[#ff883e]" />
                </span>
                <h2
                  id="ireland-title"
                  className="text-5xl font-semibold tracking-tight text-accent-foreground"
                >
                  Irlanda.
                </h2>
                <p className="mt-3 text-accent-foreground">
                  O começo de novas possibilidades.
                </p>
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <Badge variant="secondary">Exploração disponível</Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                Seu próximo capítulo pode começar aqui.
              </h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                A Irlanda é o primeiro destino disponível. Conheça a
                apresentação dos caminhos, começando por trabalho.
              </p>
              <ul className="mt-6 divide-y text-sm">
                {(
                  [
                    ["Trabalho", "Apresentações iniciais", "work"],
                    ["Estudo", "Detalhes em breve", "study"],
                    ["Família", "Detalhes em breve", "family"],
                  ] as const
                ).map(([title, state, slug]) => (
                  <li
                    key={title}
                    className="flex flex-wrap justify-between gap-2 py-3"
                  >
                    <Link
                      href={`/ireland/${slug}`}
                      className="inline-flex min-h-11 items-center rounded-md font-semibold text-primary hover:underline"
                    >
                      {title}
                    </Link>
                    <span className="text-muted-foreground">{state}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                O catálogo está em construção. Estas categorias não representam
                uma avaliação de elegibilidade.
              </p>
            </div>
          </div>
        </PageSection>
        <PageSection
          id="personalizacao"
          aria-labelledby="ai-title"
          className="border-t"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-primary">
                TECNOLOGIA COM CRITÉRIO
              </p>
              <h2
                id="ai-title"
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Personalizado para você.
                <br />
                Fundamentado em fontes.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                A IA terá um papel de apoio: explicar e adaptar a linguagem ao
                seu contexto. Não será a autoridade sobre regras migratórias e
                não terá liberdade para inventar URLs ou requisitos legais.
              </p>
            </div>
            <ol className="space-y-4">
              {(
                [
                  ["Informações oficiais", "A base para entender requisitos."],
                  [
                    "Regras estruturadas",
                    "Identificam caminhos potencialmente relevantes.",
                  ],
                  [
                    "Explicações personalizadas",
                    "IA ajuda a tornar o resultado mais compreensível.",
                  ],
                ] as const
              ).map(([title, text]) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-xl bg-secondary p-5"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </PageSection>
        <PageSection
          id="sobre"
          aria-labelledby="about-title"
          className="border-t"
        >
          <div>
            <p className="text-sm font-semibold text-primary">
              SOBRE O MEU VISTO FÁCIL
            </p>
            <h2
              id="about-title"
              className="mt-3 text-2xl font-semibold tracking-tight"
            >
              Informação para planejar. Clareza para seguir.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Estamos construindo uma plataforma para tornar a pesquisa sobre
              imigração mais organizada, transparente e pessoal. A proposta é
              ajudar você a compreender possibilidades, sem substituir a
              orientação de profissionais ou as decisões das autoridades.
            </p>
          </div>
        </PageSection>
        <PageSection
          className="mb-10 rounded-3xl bg-secondary px-6 text-center sm:px-10"
          aria-labelledby="start-title"
        >
          <h2
            id="start-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Comece entendendo suas possibilidades.
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-muted-foreground">
            Conheça o primeiro destino da nossa jornada e o que estamos
            preparando para você.
          </p>
          <div className="mt-7">
            <ExploreLink />
          </div>
          <a
            href="#como-funciona"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-primary"
          >
            Conheça a proposta{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </PageSection>
      </Container>
    </main>
  );
}
