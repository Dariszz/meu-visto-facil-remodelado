# Bootstrap técnico — Fase 1

Status: bootstrap implementado; evidências de execução registradas ao final.
Data: 2026-09-08.

## Goal

Criar a base executável do Meu Visto Fácil em uma única aplicação Next.js, com ferramentas de desenvolvimento e verificação reproduzíveis. Entregar somente o bootstrap técnico da Fase 1 de `docs/ROADMAP.md`, sem funcionalidades de produto.

## Current State

- O repositório contém `AGENTS.md`, os oito documentos centrais em `docs/` e skills em `.agents/skills/`.
- `docs/decisions/` e `docs/exec-plans/` estavam vazios na inspeção inicial; não há ADR existente a conciliar.
- Não existem `package.json`, lockfile, `src/`, `.nvmrc`, `.env.example`, configurações de ferramentas ou testes executáveis.
- Não existem entradas da aplicação, fluxos de dados, domínio implementado, persistência, autenticação ou integrações para migrar.
- `git status --short` já indicava `.agents/`, `AGENTS.md` e `docs/` como não rastreados. Preservar esse conteúdo e não incluí-lo indiscriminadamente em commits do bootstrap.

Referências consultadas: `AGENTS.md`, `docs/TECH-STACK.md`, `docs/ARCHITECTURE.md`, Fases 1–3 e limites das fases posteriores em `docs/ROADMAP.md`; contexto de `docs/PRODUCT.md`; seções pertinentes de `docs/TESTING.md` e `docs/SECURITY.md`; skill `.agents/skills/architecture-planning/SKILL.md`.

## Scope

- Next.js 16, React e React DOM compatíveis, App Router em `src/app/`.
- TypeScript strict e alias `@/*` para `src/*`.
- pnpm com versão exata registrada e lockfile único.
- Node LTS declarado em `.nvmrc` e `package.json`.
- Tailwind CSS, ESLint, Prettier e Vitest.
- Estrutura inicial dos seis diretórios exigidos pela Fase 1.
- Layout obrigatório do framework e uma página técnica mínima em `/`.
- Exemplo de ambiente sem segredos, scripts operacionais e instruções locais.
- Preparação para o preset Next.js da Vercel, sem provisionar ou publicar.

## Non-goals

Não implementar landing page, catálogo, vistos, questionário, perfil, dashboard, processos, checklists ou conteúdo migratório. Não instalar Prisma, Supabase, OpenAI, bibliotecas de formulários, estado global ou analytics. Não criar banco, migrations, seeds, autenticação, autorização, APIs ou Server Actions.

Design tokens, shadcn/ui, componentes visuais reutilizáveis, logo, favicon e identidade visual pertencem à Fase 2; landing page à Fase 3. GitHub Actions, Playwright/E2E e deploy de produção permanecem nas fases correspondentes. Os scripts já permitirão automatização posterior.

## Proposed Architecture

### Decisões

| Área        | Decisão e motivo                                                                                                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aplicação   | Uma aplicação na raiz, sem monorepo ou servidor separado, conforme a stack aprovada.                                                                                                                                  |
| Framework   | Next.js 16, com patch estável e corrigido selecionado na implementação. React e React DOM na mesma versão compatível com seus peer dependencies.                                                                      |
| Runtime     | Node 24 LTS: `.nvmrc` com `24` e `engines.node` com `24.x`. Registrar no README o patch usado na verificação. A Vercel suporta essa major e administra seus patches; não prometer igualdade de patch entre ambientes. |
| Gerenciador | pnpm, versão exata no campo `packageManager`; selecionar release estável compatível com Node 24 e registrar a versão no README. Apenas `pnpm-lock.yaml` será autoritativo.                                            |
| UI inicial  | `layout.tsx` e `page.tsx` síncronos, Server Components. Sem providers globais ou `use client`.                                                                                                                        |
| TypeScript  | `strict: true`, `noEmit: true`, plugin Next.js, resolução e JSX conforme configuração suportada pela versão escolhida. Incluir testes e configurações TS na checagem.                                                 |
| CSS         | Tailwind CSS 4 via PostCSS e import no CSS global. Apenas estilo necessário para confirmar funcionamento; design system fica para a Fase 2.                                                                           |
| Lint        | ESLint com flat config, presets Next.js Core Web Vitals e TypeScript; regras de qualidade separadas da formatação.                                                                                                    |
| Formatação  | Prettier independente, com `eslint-config-prettier` ao final da composição de regras. Sem executar Prettier como regra de lint.                                                                                       |
| Testes      | Vitest com suporte a TSX, React Testing Library e jsdom para um teste real de renderização da página técnica. Ambiente Node por padrão; jsdom indicado no teste de UI.                                                |
| Ambiente    | Nenhuma variável própria obrigatória nesta fase. `.env.example` conterá comentários explicativos; não inventar configurações de integrações ainda ausentes.                                                           |
| Hospedagem  | Configuração padrão do Next.js para Vercel; sem custom server, export estático obrigatório ou runtime Edge forçado.                                                                                                   |

A seleção de Node 24 está alinhada às [versões suportadas pela Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). Confirmar a disponibilidade no momento da implementação. Consultar os requisitos de instalação do [Next.js](https://nextjs.org/docs/app/getting-started/installation) e do [pnpm](https://pnpm.io/installation) antes de fixar as versões exatas; não gravar `latest` como versão do gerenciador.

### Limites e alternativas

A árvore ampla em `ARCHITECTURE.md` descreve a evolução da aplicação; a Fase 1 pede somente seis diretórios. Criar esses diretórios com um README curto onde ainda não houver código e adiar subpastas de domínio, infraestrutura e grupos de rotas até terem uso. Isso preserva a estrutura solicitada sem criar camadas fictícias.

Preferir composição manual dos poucos arquivos, usando as configurações oficiais como referência, pois a raiz já contém documentação e instruções. Um scaffold temporário seria possível, mas exigiria seleção e cópia cuidadosa de arquivos; não executar um gerador que sobrescreva o repositório existente.

Não é necessário ADR: o plano concretiza decisões já documentadas e não altera a arquitetura de longo prazo. No futuro, aplicação e domínio ficarão próximos de suas features, e integrações terão fronteiras próprias; nenhum serviço, repository ou provider vazio será criado agora.

### Estrutura prevista

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.test.tsx
│   └── globals.css
├── components/
│   └── README.md
├── features/
│   └── README.md
├── lib/
│   └── README.md
├── shared/
│   └── README.md
└── test/
    └── setup/
        └── dom.ts
```

`app/` cuida das rotas; `components/` receberá componentes reutilizáveis; `features/` receberá módulos do produto; `lib/` concentrará integrações e configuração técnica; `shared/` conterá apenas contratos realmente compartilhados; `test/` guardará suporte comum aos testes. Não criar `utils.ts`, barrels vazios ou pastas de features antecipadas.

## Implementation Steps

1. **Confirmar estado e versões.** Revalidar arquivos existentes e alterações locais. Selecionar versões estáveis compatíveis e corrigidas, registrar Node/pnpm e revisar peer dependencies sem ignorar incompatibilidades.
2. **Criar configuração do pacote.** Definir nome `meu-visto-facil`, `private: true`, engines, packageManager, dependências e scripts. Instalar usando pnpm e versionar o lockfile resultante. Não criar workspace pnpm sem necessidade.
3. **Preparar Next.js e TypeScript.** Criar configurações mínimas e `src/app/`; usar alias consistente entre TypeScript e Vitest. Deixar o Next.js gerar `next-env.d.ts`, sem edição manual. Não desabilitar erros de tipo no build.
4. **Criar página técnica.** Layout com `html lang="pt-BR"`, `body`, import do CSS global e metadata básica. Página com `main`, um título “Meu Visto Fácil” e mensagem “Base técnica inicial”. Usar fonte do sistema e poucas classes responsivas; evitar fontes, imagens e chamadas de rede no build.
5. **Integrar Tailwind.** Configurar `@tailwindcss/postcss` em `postcss.config.mjs` e importar Tailwind no CSS global, conforme o [guia oficial para Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs). Não misturar configuração v3 nem adicionar `tailwind.config.ts` ou Autoprefixer sem necessidade.
6. **Configurar qualidade.** Usar `eslint.config.mjs` com presets de Next.js e TypeScript, ignorando artefatos gerados. Manter erro para `any` explícito injustificado. Configurar Prettier para dois espaços, ponto e vírgula, aspas duplas e LF. Excluir dependências, saídas geradas, lockfile e conteúdo preexistente de documentação/skills do escopo inicial de formatação; incluir o README novo e este plano. Não reformatar documentação anterior para fazer o bootstrap passar.
7. **Configurar Vitest.** Usar configuração ESM em `vitest.config.mts`, plugin React e alias absoluto `@` apontando para `src/`, sem plugin adicional apenas para esse alias. Descobrir `src/**/*.test.{ts,tsx}`; excluir E2E. Configurar ambiente Node por padrão e anotar `page.test.tsx` com jsdom. Setup DOM importa matchers de `@testing-library/jest-dom/vitest` e registra cleanup explícito. Importar APIs de Vitest explicitamente.
8. **Adicionar teste de bootstrap.** Renderizar a página síncrona através do alias; verificar `main` e heading acessível com o nome da aplicação. O teste valida a integração TSX/alias/DOM/runner. Não usar teste aritmético, snapshot amplo ou `passWithNoTests`.
9. **Documentar ambiente e operação.** Criar `.gitignore` e `.env.example`; escrever README com instalação, versões, comandos, estrutura, limites do bootstrap e parâmetros futuros da Vercel. Explicar que não é necessário criar `.env.local` para esta fase.
10. **Verificar e revisar.** Executar a sequência de validação abaixo a partir de instalação limpa, revisar todo o diff e arquivos novos, registrar resultados e encerrar na Fase 1.

### Scripts previstos

| Script         | Comando                        |
| -------------- | ------------------------------ |
| `dev`          | `next dev`                     |
| `build`        | `next build`                   |
| `start`        | `next start`                   |
| `lint`         | `eslint . --max-warnings=0`    |
| `typecheck`    | `next typegen && tsc --noEmit` |
| `test`         | `vitest run`                   |
| `test:watch`   | `vitest`                       |
| `format`       | `prettier --write .`           |
| `format:check` | `prettier --check .`           |

Gerar tipos antes de `tsc` permite checar um checkout sem `.next` prévio; verificar esse fluxo com a versão fixada, conforme a [referência da CLI Next.js](https://nextjs.org/docs/app/api-reference/cli/next). O lint será executado diretamente pelo ESLint e separadamente do build, conforme a [integração oficial ESLint](https://nextjs.org/docs/app/api-reference/config/eslint).

### Dependências previstas

| Grupo     | Pacotes                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Runtime   | `next` (16.x), `react`, `react-dom`                                                                                              |
| Tipagem   | `typescript`, `@types/node` (24.x), `@types/react`, `@types/react-dom`                                                           |
| CSS       | `tailwindcss` (4.x), `@tailwindcss/postcss` (4.x), `postcss`                                                                     |
| Qualidade | `eslint`, `eslint-config-next` (alinhado ao Next.js), `prettier`, `eslint-config-prettier`                                       |
| Testes    | `vitest`, `vite`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` |

Tudo fora do grupo runtime entra em `devDependencies`. Vite é ferramenta do runner/plugin, sem substituir o Next.js como bundler da aplicação. Fixar versões diretas exatas após resolver compatibilidade; o lockfile registra transitivas. Não instalar coverage, user-event ou bibliotecas de mocks antes de existir necessidade.

### Compatibilidade com Vercel

Documentar os parâmetros para futura importação: raiz do repositório, preset Next.js, Node 24.x, instalação `pnpm install --frozen-lockfile`, build `pnpm build` e diretório de saída padrão do preset. Usar o mesmo pnpm registrado em `packageManager`, conferindo sua seleção no futuro log de instalação.

Não há necessidade prevista de `vercel.json`, SDK Vercel ou variáveis privadas. Não criar projeto remoto, ligar integração Git ou executar deploy nesta fase. O build local verifica a preparação; execução hospedada continua pendente de uma tarefa de deploy.

## Files Expected to Change

Nesta tarefa de planejamento: somente `docs/exec-plans/bootstrap.md` (este arquivo).

Na implementação futura, criar:

- `package.json`, `pnpm-lock.yaml` e `.nvmrc`.
- `next.config.ts`, `tsconfig.json` e `postcss.config.mjs`.
- `eslint.config.mjs`, `.prettierrc.json` e `.prettierignore`.
- `vitest.config.mts`.
- `.gitignore`, `.env.example` e `README.md`.
- Os nove arquivos da árvore `src/` acima.

`next-env.d.ts` e `.next/` serão gerados pelo Next.js e ignorados pelo Git; `node_modules/`, `coverage/`, `*.tsbuildinfo` e `.vercel/` também serão ignorados. Preservar `.env.example` com exceção explícita à regra `.env*`.

Atualizar este plano com versões efetivamente escolhidas e evidências de verificação ao terminar a implementação. Não modificar `AGENTS.md`, skills ou documentos centrais para descrever funcionalidades ainda inexistentes.

## Data Changes

Nenhuma entidade, schema, migration, seed ou dado pessoal. Não há configuração ou conexão de banco. O exemplo de ambiente não conterá credenciais nem URLs de serviços futuros.

## Security Considerations

Não há fronteiras de autenticação, ownership, IA, SSRF ou entrada de usuário nesta fase. O cuidado aplicável é preservar segredos fora do Git e do bundle, revisar dependências e não carregar configuração de produção nos testes.

Revisar explicitamente `.gitignore`, `.env.example` e configuração do build quanto a exposição de segredos antes de concluir a implementação. Não colocar valores privados em `NEXT_PUBLIC_*` ou no campo `env` de Next.js. Nenhum segredo real será manipulado.

Quando uma variável própria passar a ser consumida em fase posterior, criar validação na fronteira de ambiente com Zod conforme a arquitetura. A ausência de variáveis obrigatórias agora não autoriza consumir variáveis não validadas depois. Não instalar Zod apenas para validar um objeto vazio.

## Testing

Nesta tarefa documental não executar instalação, testes de aplicação ou build: ainda não há pacote executável. Revisar conteúdo, cobertura dos requisitos e diff, conforme a dispensa de testes para documentação em `docs/TESTING.md`.

Na implementação, executar em sequência:

1. `pnpm install --frozen-lockfile` em checkout limpo, após criação do lockfile.
2. `pnpm format:check`.
3. `pnpm lint`.
4. `pnpm typecheck`, sem depender de execução anterior de dev/build.
5. `pnpm test`, executando efetivamente o teste de renderização e encerrando sem watch.
6. `pnpm build` sem variáveis de banco, autenticação ou IA.
7. `pnpm start` e smoke manual de `/`: resposta HTTP 200, conteúdo esperado, CSS carregado, sem erro no navegador ou servidor. Conferir larguras de celular, tablet e desktop, legibilidade e ausência de overflow. Encerrar o servidor ao terminar.
8. `pnpm dev` para confirmar o fluxo local e atualização após edição; desfazer a alteração de verificação e encerrar o servidor.
9. Revisar `git diff`, arquivos não rastreados e regras de ignore; confirmar que `.env.example` pode ser versionado e arquivos `.env.local`/`.env.production` seriam ignorados, sem criar credenciais.

O teste da página confirma o suporte de testes, mas não prova hidratação, roteamento hospedado ou compilação de CSS. Build e smoke cobrem os aspectos correspondentes. Vitest tem limitações para Server Components assíncronos; manter a página síncrona e testar futuros fluxos assíncronos na camada apropriada, conforme o [guia oficial de Vitest com Next.js](https://nextjs.org/docs/app/guides/testing/vitest).

## Risks

| Risco                                               | Mitigação / limite                                                                                                                                 |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incompatibilidade entre versões e peer dependencies | Conferir releases, requisitos e lockfile na implementação; registrar as versões testadas. Não usar flags para ocultar incompatibilidades.          |
| Divergência de Node/pnpm entre Windows e Vercel     | Declarar versões, documentar seleção no Windows e conferir logs no futuro deploy; `.nvmrc` não troca automaticamente o runtime de toda ferramenta. |
| Gerador sobrescrever documentação existente         | Preferir composição manual e revisar somente os arquivos necessários.                                                                              |
| Tailwind compilar sem estilos aplicados à página    | Verificar PostCSS/import e aparência no smoke; teste DOM isolado não basta.                                                                        |
| Typecheck depender de artefatos locais              | Executar geração de tipos e validar em checkout sem `.next`.                                                                                       |
| Suite vazia aparentar sucesso                       | Incluir teste de renderização; não permitir sucesso sem testes.                                                                                    |
| Formatação produzir diff alheio ao bootstrap        | Excluir documentos/skills preexistentes do escopo inicial do Prettier.                                                                             |
| Ambiente de instalação sem acesso ao registry       | Instalação requer rede e pode exigir autorização do ambiente; registrar bloqueio real sem substituir dependências por código fictício.             |
| Build local confundido com deploy validado          | Declarar verificação Vercel pendente; não publicar como efeito colateral.                                                                          |
| Bootstrap avançar para produto                      | Encerrar após os critérios abaixo, sem iniciar Fase 2.                                                                                             |

## Definition of Done

### Planejamento (esta tarefa)

- [x] Inspecionar repositório, instruções, skill e documentação relevante.
- [x] Registrar decisões, arquivos, dependências, sequência, riscos e critérios verificáveis.
- [x] Criar somente este plano, sem código ou instalação de dependências.

### Implementação da Fase 1

- [x] Next.js 16 com App Router em `src/`, React e TypeScript strict funcionais.
- [x] Node e pnpm declarados; lockfile reproduzível e nenhum lockfile npm/yarn.
- [x] Seis diretórios da Fase 1 presentes e documentados, sem features fictícias.
- [x] Tailwind aplicado à página técnica mínima e Server Components preservados.
- [x] ESLint, Prettier, Vitest e scripts configurados sem supressão de falhas.
- [x] Teste de renderização passa; `lint`, `typecheck`, `test`, `build` e `format:check` passam em ambiente limpo.
- [x] Fluxos `dev` e `start` verificados, incluindo smoke responsivo.
- [x] `.env.example` seguro; nenhuma variável privada necessária ao bootstrap.
- [x] README permite instalar, executar e verificar a base e documenta parâmetros da Vercel.
- [x] Revisão de diff, arquivos novos e proteção de segredos concluída; resultados e limites registrados.
- [x] Nenhuma feature de negócio, integração, banco, CI ou deploy implementado.

## Implementation Evidence — 2026-09-08

Implementado somente o bootstrap. Os itens de planejamento acima descrevem o estado histórico anterior à implementação.

### Arquivos entregues

- Raiz: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore`, `.env.example`, `.prettierignore`, `.prettierrc.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `README.md`.
- Aplicação: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/page.test.tsx`.
- Estrutura e testes: `src/components/README.md`, `src/features/README.md`, `src/lib/README.md`, `src/shared/README.md`, `src/test/setup/dom.ts`.
- Este plano foi atualizado. `next-env.d.ts`, `.next/`, `node_modules/` e o cache local `.pnpm-store/` são gerados e ignorados.
- Documentos centrais, skills e conteúdo original do `AGENTS.md` preservados. Nenhum commit, deploy ou integração remota criado.

### Versões instaladas

Node 24.20.0, pnpm 11.19.0. Dependências diretas fixadas exatamente no manifest e no lockfile:

| Grupo     | Pacotes e versões                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime   | next 16.3.4; react 19.2.8; react-dom 19.2.8                                                                                                                     |
| Tipagem   | typescript 5.9.3; @types/node 24.13.3; @types/react 19.2.18; @types/react-dom 19.2.7                                                                            |
| CSS       | tailwindcss 4.3.3; @tailwindcss/postcss 4.3.3; postcss 8.5.28                                                                                                   |
| Qualidade | eslint 9.39.5; eslint-config-next 16.3.4; prettier 3.9.6; eslint-config-prettier 10.1.8                                                                         |
| Testes    | vitest 5.0.0; vite 8.2.2; @vitejs/plugin-react 6.1.1; jsdom 30.0.1; @testing-library/react 16.3.3; @testing-library/dom 10.4.1; @testing-library/jest-dom 7.0.1 |

### Comandos e resultados

- `node --version`, `pnpm --version` e consultas `pnpm view`: versões e peers conferidos; referências oficiais de Next.js, pnpm, Tailwind e Vercel consultadas.
- `pnpm add --save-exact next@16.3.4 react@19 react-dom@19` e `pnpm add -D --save-exact typescript @types/node@24 @types/react@19 @types/react-dom@19 tailwindcss@4 @tailwindcss/postcss@4 postcss eslint@9 eslint-config-next@16.3.4 prettier eslint-config-prettier vitest@5 vite@8 @vitejs/plugin-react@6 jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom`: instalação inicial, com os problemas corrigidos abaixo.
- `pnpm add -D --save-exact typescript@5`: selecionou 5.9.3. Manifest normalizado para versões exatas, seguido de `pnpm install --lockfile-only`.
- `pnpm format` e `pnpm test src/app/page.test.tsx`: formatação aplicada somente ao escopo previsto; um teste direcionado passou.
- Cópia temporária limpa dos arquivos do bootstrap, inicialmente sem `node_modules`, `next-env.d.ts` ou `.next`: `pnpm install --frozen-lockfile` passou. Após fixar os specifiers exatos, a instalação congelada passou novamente sem alterar versões resolvidas.
- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`: passaram na cópia limpa após a correção do PostCSS. Typegen executou antes do primeiro build; um arquivo de teste e um teste passaram; `/` foi prerenderizada.
- A sequência completa também passou no repositório após adicionar `agentRules: false` e restaurar o texto do smoke. Nenhuma variável de banco, autenticação ou IA foi necessária.
- `pnpm start --hostname 127.0.0.1`: servidor pronto; `Invoke-WebRequest` confirmou HTTP 200 para `/` e o CSS referenciado. Smoke no navegador em 375×812, 768×1024 e 1440×900: texto legível, Tailwind aplicado, sem overflow horizontal e sem warnings/erros de console. Screenshots inspecionadas; servidor encerrado.
- `pnpm dev --hostname 127.0.0.1`: página respondeu HTTP 200; alteração temporária da mensagem apareceu automaticamente no navegador. Texto original restaurado. Servidor encerrado após verificação.
- `pnpm peers check`: nenhum conflito. `pnpm audit --prod`: nenhuma vulnerabilidade conhecida na consulta.
- `git diff`, `git diff --check`, inventário de arquivos novos e `git check-ignore`: revisão de escopo e proteção de ambiente. O repositório começou sem arquivos rastreados; o diff Git vazio foi complementado pela leitura dos arquivos novos. `.env.local` e `.env.production` ignorados; `.env.example` versionável.

### Problemas encontrados e decisões

1. Registry inacessível no sandbox: consultas/instalação repetidas com autorização fora do sandbox. A instalação parcial também provocou tentativa automática de reinstalação sem TTY; os comandos passaram após concluir a instalação no mesmo contexto.
2. TypeScript 7.0.2 não atende ao peer `<6.1.0` do lint. Substituído por 5.9.3; nenhum peer ignorado.
3. Postinstall de `unrs-resolver` bloqueado pelo pnpm: revisado e permitido em `pnpm-workspace.yaml`. Esse arquivo adicional é necessário para registrar configuração reproduzível do único pacote; não introduz monorepo. Não há liberação global de scripts.
4. ESLint exigiu nome para o objeto exportado do PostCSS: corrigido sem alterar regras.
5. `next dev` anexou um bloco ao `AGENTS.md`. O conteúdo original foi restaurado; `agentRules: false` evita novas alterações automáticas. Configuração confirmada na implementação instalada do Next.js e validada por typecheck/build.
6. Aviso conhecido restante: ESLint 9.39.5 descontinuado. O plugin React do preset Next.js ainda declara peers até ESLint 9; mantida a combinação compatível e documentada no README. Reavaliar quando houver suporte conjunto ao ESLint 10.
7. Uma reinicialização de dev falhou com `EPERM` ao renomear um manifest no cache do Windows. Removido somente `.next/dev`, após validar seu caminho absoluto; a nova inicialização passou, respondeu HTTP 200 e mostrou a mensagem original sem erros de console. `AGENTS.md` permaneceu com seus 23.952 bytes originais.

### Limites

Build e smoke locais em Windows/Node 24; execução hospedada na Vercel não validada. Não foram adicionados ou executados CI, Playwright/E2E ou funcionalidades de produto, conforme o escopo. Encerrar nesta fase.
