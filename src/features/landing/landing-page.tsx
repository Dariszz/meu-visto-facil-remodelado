import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { ItemStrip } from "@/features/checklists/components/item-strip";
import type { ChecklistItemStatus } from "@/features/checklists/types";

function ExploreLink() {
  return (
    <Button asChild size="lg">
      <Link href="/ireland">Explorar Irlanda</Link>
    </Button>
  );
}

// Amostra do produto no lugar de uma ilustração: um trecho do checklist de
// Critical Skills, com títulos da consulta editorial de 10/09/2026.
const sampleGroups: {
  title: string;
  statuses: ChecklistItemStatus[];
}[] = [
  {
    title: "Requisitos",
    statuses: ["COMPLETED", "IN_PROGRESS", "PENDING", "PENDING"],
  },
  { title: "Solicitação", statuses: ["PENDING"] },
  { title: "Entrada", statuses: ["PENDING"] },
  { title: "Chegada", statuses: ["PENDING"] },
];

const sampleItems = [
  { title: "Conferir a oferta de emprego", status: "Concluído", done: true },
  {
    title: "Conferir ocupação e remuneração",
    status: "Em andamento",
    done: false,
  },
  {
    title: "Reunir comprovantes de qualificação",
    status: "Pendente",
    done: false,
  },
] as const;

function ChecklistSample() {
  return (
    <figure className="w-full max-w-lg lg:justify-self-end">
      <div className="rounded-lg border bg-card p-6 sm:p-8">
        <p className="text-xl font-semibold tracking-tight">
          Critical Skills Employment Permit
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Trabalho na Irlanda
        </p>
        <div className="mt-6 flex gap-2">
          {sampleGroups.map((group) => (
            <div
              key={group.title}
              className="min-w-0"
              style={{ flexGrow: group.statuses.length, flexBasis: 0 }}
            >
              <ItemStrip
                statuses={group.statuses}
                label={`${group.title}: ${
                  group.statuses.filter((s) => s === "COMPLETED").length
                } de ${group.statuses.length} itens concluídos`}
              />
              <p
                aria-hidden="true"
                className="mt-1.5 hidden text-xs leading-snug break-words hyphens-auto text-muted-foreground sm:block"
              >
                {group.title}
              </p>
            </div>
          ))}
        </div>
        <ul className="mt-6 divide-y border-t text-sm">
          {sampleItems.map((item) => (
            <li key={item.title} className="flex items-start gap-3 py-3">
              <span
                aria-hidden="true"
                className={
                  item.done
                    ? "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-primary text-primary-foreground"
                    : "mt-0.5 size-4 shrink-0 rounded-[3px] border-2 border-input"
                }
              >
                {item.done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.title}</span>
                <span className="block text-muted-foreground">
                  {item.status}. Fonte: DETE
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Prévia conceitual do checklist, com progresso ilustrativo. O
        acompanhamento de processos ainda está em desenvolvimento.
      </figcaption>
    </figure>
  );
}

const steps = [
  [
    "Conte seu objetivo",
    "Trabalhar, estudar ou morar com a família. Sua intenção define por onde começar.",
  ],
  [
    "Veja caminhos possíveis",
    "Entenda quais opções podem fazer sentido para o seu perfil e o que ainda precisa ser confirmado.",
  ],
  [
    "Organize o checklist",
    "Requisitos e etapas reunidos em uma lista, cada item com a fonte oficial de onde veio.",
  ],
  [
    "Acompanhe o progresso",
    "Marque o que já foi feito e mantenha o próximo passo à vista.",
  ],
] as const;

export function LandingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <PageSection className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <h1 className="max-w-xl text-display font-semibold text-balance">
              Seu caminho para imigrar começa com informação clara.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Entenda possibilidades, organize requisitos e acompanhe cada etapa
              da mudança, sempre com a fonte oficial ao lado. O primeiro destino
              é a Irlanda.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ExploreLink />
              <a
                href="#como-funciona"
                className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
              >
                Como funciona
              </a>
            </div>
          </div>
          <ChecklistSample />
        </PageSection>
      </Container>

      <div className="border-y bg-card">
        <Container>
          <PageSection id="como-funciona" aria-labelledby="journey-title">
            <h2
              id="journey-title"
              className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              Como funciona
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Quatro etapas, da primeira dúvida ao acompanhamento do processo.
            </p>
            <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([title, text], index) => (
                <li key={title} className="border-t border-foreground/15 pt-5">
                  <h3 className="text-lg font-semibold">
                    <span className="mr-2 text-primary tabular-nums">
                      {index + 1}.
                    </span>
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </PageSection>
        </Container>
      </div>

      <Container>
        <PageSection id="por-que-usar" aria-labelledby="benefits-title">
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <h2
                id="benefits-title"
                className="max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                Menos abas abertas, mais contexto para decidir.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Pesquisar uma mudança de país não deveria significar se perder
                entre termos difíceis e respostas sem referência.
              </p>
            </div>
            <dl className="divide-y border-y">
              {(
                [
                  [
                    "Tudo conectado",
                    "Possibilidades, requisitos e etapas ligados entre si, para você enxergar a jornada inteira.",
                  ],
                  [
                    "Com o seu contexto",
                    "As opções partem do seu objetivo e das informações que você escolher compartilhar.",
                  ],
                  [
                    "O que falta, à vista",
                    "Checklists e acompanhamento deixam claro o que ainda precisa de atenção.",
                  ],
                ] as const
              ).map(([title, text]) => (
                <div key={title} className="py-5">
                  <dt className="font-semibold">{title}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                    {text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </PageSection>

        <PageSection
          id="fontes"
          aria-labelledby="sources-title"
          className="border-t"
        >
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <h2
                id="sources-title"
                className="max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                Você merece saber de onde vem a informação.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Informações críticas ficam associadas a fontes oficiais. Assim
                você consulta a origem e confirma os detalhes com a autoridade
                responsável.
              </p>
            </div>
            <div>
              <dl className="border-l-4 border-primary/50 bg-card px-6 py-5 text-sm">
                {(
                  [
                    ["Origem", "Critical Skills Employment Permit"],
                    [
                      "Autoridade",
                      "Department of Enterprise, Tourism and Employment",
                    ],
                    ["Endereço", "enterprise.gov.ie"],
                    ["Consulta editorial", "10 de setembro de 2026"],
                  ] as const
                ).map(([title, text]) => (
                  <div
                    key={title}
                    className="grid gap-1 py-2 sm:grid-cols-[9rem_1fr]"
                  >
                    <dt className="text-muted-foreground">{title}</dt>
                    <dd className="font-medium">{text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Exemplo de registro de fonte. O catálogo de fontes ainda está em
                preparação; nenhuma revisão oficial é afirmada nesta prévia.
              </p>
            </div>
          </div>
        </PageSection>

        <PageSection
          id="irlanda"
          aria-labelledby="ireland-title"
          className="border-t"
        >
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            <div>
              <h2
                id="ireland-title"
                className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                Irlanda, o primeiro destino
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                A exploração está disponível, começando pelos caminhos de
                trabalho. Estudo e família chegam depois que as fontes oficiais
                forem revisadas.
              </p>
            </div>
            <div>
              <ul className="divide-y border-y text-sm">
                {(
                  [
                    ["Trabalho", "Apresentações iniciais", "work"],
                    ["Estudo", "Detalhes em breve", "study"],
                    ["Família", "Detalhes em breve", "family"],
                  ] as const
                ).map(([title, state, slug]) => (
                  <li
                    key={title}
                    className="flex flex-wrap items-center justify-between gap-2 py-2"
                  >
                    <Link
                      href={`/ireland/${slug}`}
                      className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {title}
                    </Link>
                    <span className="text-muted-foreground">{state}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
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
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            <div>
              <h2
                id="ai-title"
                className="max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                Personalizado para você, fundamentado em fontes
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                A IA terá um papel de apoio: explicar e adaptar a linguagem ao
                seu contexto. Não será a autoridade sobre regras migratórias e
                não terá liberdade para inventar URLs ou requisitos legais.
              </p>
            </div>
            <ol className="divide-y border-y">
              {(
                [
                  [
                    "Informações oficiais",
                    "São a base para entender os requisitos.",
                  ],
                  [
                    "Regras estruturadas",
                    "Identificam caminhos potencialmente relevantes.",
                  ],
                  [
                    "Explicações personalizadas",
                    "A IA ajuda a tornar o resultado mais compreensível.",
                  ],
                ] as const
              ).map(([title, text], index) => (
                <li key={title} className="flex gap-4 py-5">
                  <span className="font-semibold text-primary tabular-nums">
                    {index + 1}.
                  </span>
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
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            <h2
              id="about-title"
              className="text-2xl font-semibold tracking-tight text-balance"
            >
              Sobre o Meu Visto Fácil
            </h2>
            <div>
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                Uma plataforma para tornar a pesquisa sobre imigração mais
                organizada, transparente e pessoal. A proposta é ajudar você a
                compreender possibilidades, sem substituir a orientação de
                profissionais ou as decisões das autoridades.
              </p>
              <div className="mt-8">
                <ExploreLink />
              </div>
            </div>
          </div>
        </PageSection>
      </Container>
    </main>
  );
}
