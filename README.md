# Meu Visto Fácil

Aplicação de apoio à exploração de caminhos de imigração, com foco inicial na Irlanda. O catálogo público usa PostgreSQL no Supabase por repositórios server-only. A Fase 8 apresenta metadados das fontes; a Fase 9 acrescenta validação segura de URLs e registro manual do resultado técnico, sem chamadas durante renderização. A Fase 10 não foi iniciada.

O [registro de continuidade](docs/PROJECT-CONTEXT.md) reúne o contexto de desenvolvimento, a forma de trabalho e o ponto de retomada. Consulte o [roadmap](docs/ROADMAP.md) para o escopo das fases.

## Ambiente local

Use Node **24.x** (`.nvmrc`) e pnpm **11.19.0** (`packageManager`). A verificação local usa Node **24.20.0** no Windows. O arquivo `.nvmrc` não troca automaticamente a versão do Node; selecione Node 24 no seu gerenciador de versões e confirme com `node --version`.

Com Node instalado, disponibilize a versão exata do pnpm, por exemplo com `npm install --global pnpm@11.19.0`. Esse comando instala apenas o gerenciador; use exclusivamente pnpm para dependências deste projeto.

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm db:generate
pnpm dev
```

Abra [localhost:3000](http://localhost:3000). Home e design system dispensam banco. As rotas da Irlanda leem DATABASE_URL com papel somente leitura; o build não precisa de conexão. Configure arquivos locais conforme [setup do banco](docs/DATABASE-SETUP.md) e `.env.example`, sem credenciais versionadas.

## Comandos

| Comando                 | Finalidade                                                     |
| ----------------------- | -------------------------------------------------------------- |
| `pnpm dev`              | Servidor local com atualização após edição                     |
| `pnpm build`            | Build de produção                                              |
| `pnpm start`            | Servidor de produção, após o build                             |
| `pnpm lint`             | ESLint, sem warnings permitidos                                |
| `pnpm typecheck`        | Gera tipos Next.js e verifica TypeScript sem emitir código     |
| `pnpm test`             | Executa os testes uma vez                                      |
| `pnpm test:watch`       | Testes durante desenvolvimento                                 |
| `pnpm format`           | Formata os arquivos do bootstrap                               |
| `pnpm format:check`     | Confere a formatação                                           |
| `pnpm db:validate`      | Valida o schema Prisma sem banco                               |
| `pnpm db:generate`      | Gera cliente Prisma local, antes do typecheck                  |
| `pnpm db:deploy`        | Aplica migrations versionadas no banco configurado             |
| `pnpm db:seed`          | Seed de desenvolvimento, com confirmação explícita             |
| `pnpm test:integration` | Migrations repetíveis, seed, constraints e repositórios reais |

Setup, permissões, conexões e comandos de criação de migrations: [DATABASE-SETUP.md](docs/DATABASE-SETUP.md). Evidências e pendências da Fase 6: [plano de execução](docs/exec-plans/phase-6-database-foundation.md).

Verificação do bootstrap: instalação com lockfile, `format:check`, `lint`, `typecheck`, `test` e `build`, nessa ordem. O typecheck funciona sem dev/build anterior: o Next.js gera `next-env.d.ts` e `.next/types/`. Esses artefatos não são versionados.

O teste em `src/app/page.test.tsx` verifica o conteúdo principal e o título acessível, exercitando TSX, alias `@` e jsdom. Vitest usa Node por padrão; testes de UI declaram jsdom. A página atual é síncrona; esse teste não estabelece suporte a Server Components assíncronos.

Após o build, executar `pnpm start` e conferir `/`, CSS e ausência de overflow em celular, tablet e desktop. Executar também `pnpm dev`, editar temporariamente a mensagem, verificar a atualização e restaurar o texto. Encerrar os servidores com Ctrl+C.

## Estrutura

| Diretório        | Responsabilidade                                |
| ---------------- | ----------------------------------------------- |
| `src/app`        | Rotas, layout e CSS global                      |
| `src/components` | Futuros componentes reutilizáveis               |
| `src/features`   | Futuros módulos de produto, domínio e aplicação |
| `src/lib`        | Futuras integrações e configuração técnica      |
| `src/shared`     | Contratos realmente compartilhados              |
| `src/test`       | Suporte aos testes                              |

Há design system, landing page e navegação pública da Irlanda conectada ao PostgreSQL. Critical Skills usa nomes, descrições, requisitos e fontes do banco; público potencial, atributos, permissões, etapas e disclaimer continuam editoriais locais. General Employment, Estudo e Família preservam seus estados em preparação. Ainda não há autenticação, IA real, questionário, recomendações ou checklist. CI, E2E e deploy pertencem às fases posteriores. As instruções de verificação do bootstrap acima registram o escopo original da Fase 1; as verificações das fases seguintes estão nos respectivos planos em `docs/exec-plans/`.

## Futura importação na Vercel

Usar a raiz do repositório, preset **Next.js**, Node **24.x**, instalação `pnpm install --frozen-lockfile`, build `pnpm build` e saída padrão do preset. Conferir no log de instalação o pnpm **11.19.0** registrado em `packageManager`. A Vercel administra o patch de Node; o patch local não garante igualdade entre ambientes.

Não há projeto remoto provisionado nem deploy realizado. A execução hospedada será validada na fase de deploy. Referências: [Node na Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [instalação Next.js](https://nextjs.org/docs/app/getting-started/installation), [pnpm](https://pnpm.io/installation) e [Tailwind com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

As versões diretas exatas estão em `package.json`; `pnpm-lock.yaml` é o único lockfile autoritativo. O escopo e as evidências de execução estão em [plano do bootstrap](docs/exec-plans/bootstrap.md).

`pnpm-workspace.yaml` autoriza builds de `unrs-resolver`, `@prisma/engines`, `prisma` e `esbuild`, necessários ao lint e às ferramentas de persistência. Nenhum pacote adicional ou monorepo é definido. A instalação mantém bloqueados scripts não autorizados.

`agentRules: false` em `next.config.ts` impede que `next dev` acrescente instruções geradas ao `AGENTS.md` mantido pelo projeto.

Limitação conhecida: ESLint 9.39.5 emite aviso de descontinuação. Foi mantido porque o plugin React do preset Next.js ainda não declara suporte ao ESLint 10. TypeScript 5.9.3 atende aos peers do lint; a versão 7 ainda não atende. Não há supressão de conflitos de peers.

## Catálogo público — Fase 7

Repositórios em src/lib/db/repositories; composição server-side em src/features/visas/catalog-pages.tsx. Apenas países e vistos ACTIVE aparecem. Fontes arquivadas não aparecem; links inválidos ou indisponíveis não são clicáveis. Não há fallback local em falhas.

Para preparar somente Critical Skills em desenvolvimento, após seed: pnpm db:publish:development --confirm-development. O comando verifica o conteúdo esperado, altera apenas status e resumo aprovado, preserva demais edições e é repetível. Nunca faz parte do build. Não é aprovação para produção. Consulte o [plano da Fase 7](docs/exec-plans/phase-7-repository-layer.md) para consultas, divisão editorial, testes e limitações.
