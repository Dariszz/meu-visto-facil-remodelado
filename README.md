# Meu Visto Fácil

Bootstrap técnico da Fase 1: Next.js com App Router, React, TypeScript strict, Tailwind CSS, ESLint, Prettier e Vitest. A rota `/` apresenta apenas a identificação da base técnica.

## Ambiente local

Use Node **24.x** (`.nvmrc`) e pnpm **11.19.0** (`packageManager`). A verificação local usa Node **24.20.0** no Windows. O arquivo `.nvmrc` não troca automaticamente a versão do Node; selecione Node 24 no seu gerenciador de versões e confirme com `node --version`.

Com Node instalado, disponibilize a versão exata do pnpm, por exemplo com `npm install --global pnpm@11.19.0`. Esse comando instala apenas o gerenciador; use exclusivamente pnpm para dependências deste projeto.

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

Abra [localhost:3000](http://localhost:3000). Não é necessário criar `.env.local`: nenhuma variável própria é consumida. `.env.example` contém somente orientações, sem credenciais.

## Comandos

| Comando             | Finalidade                                                 |
| ------------------- | ---------------------------------------------------------- |
| `pnpm dev`          | Servidor local com atualização após edição                 |
| `pnpm build`        | Build de produção                                          |
| `pnpm start`        | Servidor de produção, após o build                         |
| `pnpm lint`         | ESLint, sem warnings permitidos                            |
| `pnpm typecheck`    | Gera tipos Next.js e verifica TypeScript sem emitir código |
| `pnpm test`         | Executa os testes uma vez                                  |
| `pnpm test:watch`   | Testes durante desenvolvimento                             |
| `pnpm format`       | Formata os arquivos do bootstrap                           |
| `pnpm format:check` | Confere a formatação                                       |

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

Não há autenticação, banco, IA, catálogo de vistos, questionário, recomendações ou checklist. Design system, landing page, CI, E2E e deploy pertencem às fases posteriores. A documentação e as skills preexistentes ficam fora da formatação inicial; o plano do bootstrap e este README são incluídos.

## Futura importação na Vercel

Usar a raiz do repositório, preset **Next.js**, Node **24.x**, instalação `pnpm install --frozen-lockfile`, build `pnpm build` e saída padrão do preset. Conferir no log de instalação o pnpm **11.19.0** registrado em `packageManager`. A Vercel administra o patch de Node; o patch local não garante igualdade entre ambientes.

Não há projeto remoto provisionado nem deploy realizado. A execução hospedada será validada na fase de deploy. Referências: [Node na Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [instalação Next.js](https://nextjs.org/docs/app/getting-started/installation), [pnpm](https://pnpm.io/installation) e [Tailwind com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

As versões diretas exatas estão em `package.json`; `pnpm-lock.yaml` é o único lockfile autoritativo. O escopo e as evidências de execução estão em [plano do bootstrap](docs/exec-plans/bootstrap.md).

`pnpm-workspace.yaml` configura somente a permissão de build de `unrs-resolver`, dependência do lint cujo postinstall prepara seu binding nativo. Nenhum pacote adicional ou monorepo é definido. A instalação mantém bloqueados scripts não autorizados.

`agentRules: false` em `next.config.ts` impede que `next dev` acrescente instruções geradas ao `AGENTS.md` mantido pelo projeto.

Limitação conhecida: ESLint 9.39.5 emite aviso de descontinuação. Foi mantido porque o plugin React do preset Next.js ainda não declara suporte ao ESLint 10. TypeScript 5.9.3 atende aos peers do lint; a versão 7 ainda não atende. Não há supressão de conflitos de peers.
