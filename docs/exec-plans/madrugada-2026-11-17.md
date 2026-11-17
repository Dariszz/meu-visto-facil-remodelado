# Trabalho autônomo — madrugada de 17/11/2026

Pedido do usuário (16/11, 00:31): adiantar tudo o que não depende dele, garantindo primeiro a base e só depois partindo para outros países. Trabalho na branch `feature/madrugada`; nada foi integrado ao `main` sem a aprovação dele.

## Ambiente de verificação

- **Cliente Prisma:** gerado no ambiente remoto com `PRISMA_SCHEMA_ENGINE_BINARY` apontando para um executável vazio. O `generate` não usa o schema engine, apenas o download dele era bloqueado.
- **PostgreSQL local:** PostgreSQL 18 (pacote npm `embedded-postgres`, fora do repositório) na porta 5433, banco `meu_visto_facil_test`, aceito pela trava de `readTestDatabaseUrl` com `DB_TEST_CONFIRM=meu_visto_facil_test`. As migrations foram aplicadas em ordem por um script local equivalente ao `migrate deploy`, porque o schema engine continua indisponível aqui. Os testes de integração rodaram com `node --test`, como no `pnpm test:integration`.
- **Limites:** não é o Supabase. Roles reais (`mvf_catalog_reader`, `mvf_profile_writer`), TLS e o `prisma migrate deploy` oficial continuam pendentes no ambiente do usuário.

## Fase 11 — perfil (validação local)

Antes de qualquer mudança, as três migrations existentes foram aplicadas no banco local. Os 6 testes de integração passaram, incluindo os dois da Fase 11: perfis preservam dados, lookups ficam isolados por identidade e a tabela não recebe grants públicos. Isso valida a migration e o repositório do perfil fora do Supabase. A criação da role e o teste no Supabase seguem em PENDENCIAS.md.

## Fase 12 — painel real

- `/dashboard` protegido (grupo `(auth)`, dinâmico, noindex, no matcher do proxy).
- Serviço de aplicação `getDashboard` (ADR 0004): sem sessão → login; sem perfil → `/profile`; com perfil → view model com nome e listas vazias reais. Processos chegam na Fase 19.
- Reaproveita `DashboardView` das prévias. Atalhos para questionário e recomendações só aparecem quando as rotas reais existirem: os links ficaram opcionais.
- Login bem-sucedido e criação de perfil passam a levar ao painel; a tela de sessão ativa ganhou "Ir para o painel".
- Erro de banco mostra estado de erro com nova tentativa, sem detalhes técnicos.
- Testes: serviço (3), página (4) e ajustes nos redirects de login e perfil. Suíte: 325 testes.

## X1 — fundações multipaís

- **Registro de domínios oficiais no código**, com país, autoridade, finalidade, evidência (tipo, URL de outro site, nota), data de revisão e aviso de reutilização. `safeSourceLink` passou a consultá-lo. Evidências da Irlanda conferidas por pesquisa em 17/11: página do departamento no gov.ie para enterprise.gov.ie e página de vistos do ireland.ie (Relações Exteriores) para o ISD. Testes exigem hostname exato, evidência HTTPS de outro domínio e bloqueiam subdomínios e parecidos.
- **Schema:** `CoverageLevel`, `ReviewStatus` e campos novos; a migration foi testada em PostgreSQL local com dados pré-existentes (backfill da Irlanda conferido). O seed cria a Irlanda como `PARTIAL` e o Critical Skills como `REVIEWED`.
- **Página pública mostra só requisitos `REVIEWED`.** Novo teste de integração confirma que requisitos não revisados, a revisar ou obsoletos não aparecem.
- **Destinos:** `/destinos` lista países publicados com o nível de cobertura; `/destinos/[pais]` explica a cobertura, leva às páginas próprias quando existem (Irlanda) e lista os sites oficiais, só com link para domínios do registro. Sem checklist para destinos `LINKS_ONLY`. O cabeçalho troca "Irlanda" por "Destinos".
- **Testes:** registro de domínios (4), páginas de destinos (3) e integração de destinos (1). Suíte: 332 testes unitários e 7 de integração no banco local.
- **Decisão registrada:** allowlist no código em vez da tabela `OfficialDomain` da ADR 0001, por segurança; ajuste anotado na própria ADR.

## Fases 13 a 15 — questionário persistido e perfil normalizado

- **Schema:** `ProfileQuestion` (por país, código único, tipo, obrigatória, ordem, status, condição `showIf` em JSON), `QuestionOption` e `ProfileAnswer` (uma resposta por perfil e pergunta, valor JSON). Migration `20261117010000_profile_questionnaire` aditiva; `ProfileAnswer` nasce sem acesso público, como o `UserProfile`. Tipos suportados agora: sim/não, escolha única e múltipla; texto, número e data ficam para quando houver pergunta que precise.
- **Perguntas da Irlanda** em `src/features/questionnaire/data/ireland-questions.ts`, fonte única para o seed e para as prévias. O seed (create-only) grava perguntas e opções.
- **Validação:** `validateAnswers` monta o schema a partir de cada pergunta, rejeita perguntas desconhecidas (inclusive campos como `userProfileId`), valores fora das opções e opções repetidas; exige obrigatórias visíveis e descarta respostas de perguntas ocultas. `readStoredAnswers` ignora valores antigos que não batem mais com a pergunta.
- **Perfil de domínio:** `normalizeProfile` gera `ImmigrationProfile`; falta de informação vira `null`, nunca "não".
- **Serviço e rota:** `getQuestionnaire`/`saveQuestionnaire` resolvem o perfil no servidor; respostas usam a credencial de perfil e perguntas a de catálogo. `/questionnaire` retoma respostas salvas, salva pela Server Action (payload limitado a 10 kB, país fixo no servidor) e volta ao painel. O painel passa a oferecer "Responder questionário" e marca o questionário como completo.
- **Testes:** 24 novos de unidade (validação, normalização, serviço, ação, página, modo de salvar) e 2 de integração (seed repetível igual aos dados versionados, substituição por país, isolamento entre pessoas, cascade ao excluir perfil, configuração inválida falha de forma segura, sem grants públicos). Suíte: 356 testes de unidade e 9 de integração no banco local.
- **Pendente no ambiente real:** grants das tabelas novas e aplicação das migrations (SQL em PENDENCIAS.md).

