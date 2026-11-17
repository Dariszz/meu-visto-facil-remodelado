# Design system — Meu Visto Fácil

Fundação implementada na Fase 2. Demonstração em `/design-system`, marcada como noindex; não é uma página comercial nem representa funcionalidades migratórias. A home permanece uma apresentação mínima em construção.

## Direção visual

Azul-petróleo para orientação, tinta escura para leitura, superfícies névoa e branco para organização, sálvia para acolhimento. Marca inicial com bússola Lucide e favicon SVG local. Tema claro deliberado; não há alternância de tema nesta fase.

Tipografia de sistema (Segoe UI, Helvetica Neue, Arial): rápida, sem requisições de fontes externas. Títulos com peso 600 e tracking discreto. Texto corrido com entrelinha confortável. Evitar texto essencial menor que text-sm.

## Tokens

Fonte de verdade: `src/app/globals.css`, via `@theme inline` do Tailwind 4.

| Categoria | Valores / uso |
| --- | --- |
| Superfícies | background #f7f9f8; card/popover #ffffff; muted #eef2f2 |
| Texto | foreground #19343e; muted-foreground #52656d |
| Marca | primary #155b66; primary-foreground #ffffff |
| Secundário | #e6eeef / #214a53 |
| Acento | #dceee7 / #205846 |
| Erro | destructive #b3293e / branco |
| Sucesso | #21634d / #e5f3eb |
| Atenção | #805211 / #fff3d9 |
| Bordas | border #d5dfe0 (decorativa); input #7b9097 (controle) |
| Foco | ring #087b88; espessura 2 px e afastamento 2–3 px |
| Espaçamento | unidade 4 px; escala Tailwind; seção fluida 48–80 px |
| Radius | sm 6 px; md 10 px; lg 14 px; xl 20 px |
| Containers | content 72rem; reading 44rem |
| Tipografia | escala Tailwind; display fluido 36–60 px, entrelinha 1.08 |
| Sombra | sm para controles; card sutil para agrupamentos |
| Breakpoints | padrões Tailwind: sm 640, md 768, lg 1024, xl 1280, 2xl 1536 px |

Contrastes calculados: botão principal 7.72:1; texto secundário sobre background 5.77:1; erro sobre branco 6.36:1; foco sobre branco 5.00:1; borda de controle sobre branco 3.34:1.

## Componentes

Instalação manual a partir do registro oficial shadcn/ui, estilo new-york, com personalização local. `components.json` configura RSC, TSX, Tailwind 4 sem arquivo JS de configuração e alias `utils` apontando para `src/lib/cn.ts`. O helper combina clsx e tailwind-merge e tem responsabilidade exclusiva de composição de classes.

- Button: default, secondary, outline, ghost, link, destructive; tamanhos default, sm, lg e icon; botão comum usa type=button. Para envio, declarar type=submit. Para links, preferir `buttonVariants` aplicado a Link; `asChild` não transforma links em controles nativamente desabilitáveis.
- Input e Textarea: props nativas, ref, disabled, aria-invalid e associação de descrição. Usar label real e aria-describedby para ajuda/erro. Validação e envio pertencem à feature.
- Select: composição Radix com Trigger, Value, Content e Item; opções desabilitadas, teclado e seleção. Associar label ao id do Trigger.
- Card: Header, Title, Description, Content e Footer. Title é um contêiner; inserir heading do nível correto conforme a página.
- Badge: default, secondary, outline e destructive. Sempre comunicar estado também por texto.
- Progress: valor limitado a 0..max; max padrão 100; null/ausente/não finito significa indeterminado. Fornecer aria-label ou aria-labelledby. Não representa probabilidade de aprovação.
- Alert: default e destructive; Title e Description. Usar role=status para informação não urgente e role=alert para erro que demande anúncio imediato.
- Dialog: primitivas Radix; título e descrição obrigatórios na composição; Escape, contenção e retorno de foco; botão Fechar em português; largura e altura limitadas à viewport.
- Skeleton: visual de carregamento; agrupar sob status com nome acessível. Respeita movimento reduzido.

Estados (adicionados em 16/11/2026): `StatePanel` em `src/components/feedback` para vazio e erro (role=alert no tom de erro, nível de heading configurável) e `LoadingRegion` para agrupar Skeletons sob status com nome acessível. Prévias em `/preview/estados`.

Progresso: `ItemStrip` (`src/features/checklists/components/item-strip.tsx`) é a régua de processo, um segmento por item colorido pelo status, com `role=img` e descrição textual. Preferir a régua a barras genéricas quando houver itens individuais. Telas privadas evitam cards repetidos, rótulos acima de títulos e setas em botões; ver a revisão em `exec-plans/ui-previews.md`.

Layout: Container, PageSection, Header e Footer. Brand é composição interna. RootLayout permanece Server Component; Select, Dialog e Progress contêm suas fronteiras client. Páginas devem ter um único main com id=main-content e tabIndex=-1 para o skip link.

## Verificação desta fase

Testes RTL cobrem botões, campos e erros, progresso, Dialog e Select desabilitado. Revisão no navegador cobre Select por teclado, modal, ciclo de Tab, Escape, retorno de foco e larguras 320, 390, 768 e 1440 px. Sem overflow horizontal nas larguras móveis verificadas.

Não houve teste com leitor de tela real, Safari/Firefox ou suíte E2E persistida (o projeto ainda não tem esse script). Nenhum fluxo crítico de produto foi introduzido. Animações de entrada da base importada foram removidas para evitar dependência visual adicional; Skeleton e Progress indeterminado usam animação nativa do Tailwind com prefers-reduced-motion.

Referências: [instalação manual shadcn/ui](https://ui.shadcn.com/docs/installation/manual), [Tailwind 4 no shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4).
