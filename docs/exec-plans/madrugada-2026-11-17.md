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
