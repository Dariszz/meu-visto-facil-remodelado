# Pendências que dependem de ação manual

Registro criado em 16/11/2026, na retomada do projeto. Lista o que precisa ser feito no seu computador ou nos painéis externos, em ordem. Marque cada item ao concluir e atualize o plano da fase correspondente com o resultado real.

## 1. Atualizar o ambiente local

As dependências foram atualizadas no commit `61b52be` (Next 16.4.6, Zod 4.6.7, Prisma 7.10.1 e versões menores).

- [ ] Confirmar Node 24.x: `node --version`
- [ ] `pnpm install`
- [ ] `pnpm db:generate` (o cliente Prisma local ainda foi gerado pela 7.10.0)
- [ ] `pnpm db:validate`
- [ ] Gate completo com Node 24: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`

Motivo: a verificação de 16/11/2026 rodou em Node 22, e o ambiente remoto não consegue baixar os binários do Prisma.

## 2. Fechar a Fase 11 — perfil (banco)

Feito em 17/11/2026 pelo Claude, com o conector do Supabase, no projeto `meu-visto-facil-dev`:

- [x] Migrations `20261006000000_user_profile`, `20261117000000_multicountry_foundation` e `20261117010000_profile_questionnaire` aplicadas e registradas em `_prisma_migrations` com o checksum dos arquivos (o `pnpm db:deploy` futuro as reconhece como aplicadas)
- [x] Seed equivalente: perguntas da Irlanda (7 perguntas, 19 opções) e Portugal/Espanha como `COMING_SOON`
- [x] Role `mvf_profile_writer` criada (NOINHERIT, sem privilégios administrativos) com senha aleatória de 40 caracteres; só o verificador SCRAM passou pelo Supabase
- [x] Grants conferidos: perfil com SELECT/INSERT em `UserProfile` e CRUD em `ProfileAnswer`; leitor do catálogo com SELECT nas perguntas e sem acesso a perfil, respostas e `_prisma_migrations`; nenhum grant para `anon`/`authenticated`
- [x] `.env.local` com `PROFILE_DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e `APP_ORIGIN` (backup do anterior fora da pasta do projeto)
- [x] Advisors de segurança do Supabase sem alertas
- [ ] `pnpm test:integration` no projeto de teste: o projeto `meu-visto-facil-test` está pausado. A integração foi validada em PostgreSQL 18 local
- [ ] Registrar o resultado final em [phase-11-user-profile.md](exec-plans/phase-11-user-profile.md) depois do teste manual do `/profile`

## 3. Fechar a Fase 10 — autenticação (Supabase hospedado)

Detalhes em [AUTHENTICATION.md](AUTHENTICATION.md).

- [ ] No painel do Supabase: habilitar o provider Email, **Confirm email** e senha mínima de 8 caracteres
- [ ] Site URL = `http://localhost:3000`; adicionar o redirect `http://localhost:3000/auth/confirm`
- [ ] Ajustar os templates **Confirm signup** e **Reset password** com os links do AUTHENTICATION.md
- [ ] Conferir a entrega de e-mails (SMTP) e os limites de autenticação
- [ ] `.env.local`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (nunca `service_role`), `APP_ORIGIN=http://localhost:3000`
- [ ] Executar o roteiro manual de 6 passos do AUTHENTICATION.md (cadastro, confirmação, login, recuperação, token reutilizado, cookies)
- [ ] Testar `/profile` com duas contas diferentes
- [ ] Registrar o resultado em [phase-10-authentication.md](exec-plans/phase-10-authentication.md)

## 4. Revisar a madrugada de 17/11/2026 (branch `feature/madrugada`)

Resumo em [madrugada-2026-11-17.md](exec-plans/madrugada-2026-11-17.md). Nada foi juntado com o `main`.

- [ ] Revisar a branch e decidir se junta com o `main`
- [ ] Portugal e Espanha: abrir as páginas de evidência de [portugal.md](research/portugal.md) e [spain.md](research/spain.md), confirmar os domínios e trocar `PENDING_REVIEW` por `VERIFIED` em `src/features/sources/official-domains.ts`. Só depois mudar os países para `ACTIVE`
- [ ] Revisar o conteúdo do General Employment Permit (hoje ele fica limitado a compatibilidade média nas recomendações)

## 5. Decisões abertas

- [ ] Manter ou remover `.agents/skills/` (skills do Codex). O `AGENTS.md` continua sendo o guia principal do projeto.
- [x] Revisar as prévias visuais das próximas telas: aprovadas em 16/11/2026 e integradas ao `main` (ver `/preview`).

## 6. Sem urgência (acompanhar)

- Deploy adiado por decisão do usuário até o produto estar construído.
- Node 26 já é LTS; migrar depois que o restante estiver estável.
- ESLint 10 e TypeScript 7: aguardar suporte do `eslint-config-next`.
- Prisma 8: aguardar versão estável.
- Vulnerabilidades restantes apenas em ferramentas de lint (desenvolvimento); revisar a cada atualização.
