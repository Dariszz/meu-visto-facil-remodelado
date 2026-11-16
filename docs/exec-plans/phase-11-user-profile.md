# Goal

Implementar fase 11: UserProfile vinculado à identidade Supabase, nome opcional, idioma e lookup pelo auth user ID.

# Current State

Fase 10 implementada localmente, com configuração hospedada pendente. Suas alterações ainda não commitadas serão preservadas. Prisma contém apenas catálogo, com credencial pública somente leitura. exports/ preexistente fora do escopo.

# Scope

Criação controlada por POST em /profile, após requireUser; leitura do próprio perfil sem mutação GET. displayName opcional e preferredLocale inicialmente pt-BR. Criação repetida preserva dados existentes. Modelo, migration aditiva, repositório, serviço, UI e testes.

# Non-goals

Dashboard (fase 12), edição de conta (fase 32), dados migratórios, triggers em auth.users, OAuth, produção e exclusão de contas.

# Proposed Architecture

Página/ação → serviço que resolve identidade server-side → repositório server-only → Prisma. PROFILE_DATABASE_URL separada de DATABASE_URL, sem fallback administrativo. Tabela catalog.UserProfile privada; role de perfil restrita a SELECT/INSERT. Nenhum grant de perfil para leitor do catálogo ou Data API. authUserId UUID único, sem FK acoplada ao schema gerenciado auth.

# Implementation Steps

1. Agente planejamento inspeciona modelo e permissões.
2. Agente persistência implementa schema/migration/repositório/integração; agente UI implementa /profile e formulário.
3. Coordenador implementa serviço autenticado, ações, configuração e documentação.
4. Validar Prisma, testes, revisões independentes de código/segurança e gate final.

# Files Expected to Change

prisma/schema.prisma, prisma/migrations/, src/lib/db/profile-client.ts, src/lib/db/repositories/user-profile-repository.ts, src/features/profile/, src/app/(auth)/profile/, src/proxy.ts, login, scripts/test-database.ts, tests/integration/, .env.example e docs.

# Data Changes

Nova tabela UserProfile: id UUID, authUserId UUID UNIQUE, displayName opcional, preferredLocale default pt-BR, createdAt/updatedAt. Migration apenas aditiva. Fixtures por rollback; sem seed de pessoas.

# Security Considerations

Identidade sempre requireUser; nunca aceitar authUserId do browser. Inputs Zod strict, acesso privado server-only, DTO mínimo, erros estáveis sem infraestrutura/dados pessoais. SELECT/INSERT apenas na nova tabela para role dedicada; revogar grants do leitor/Data API. Revisão de segurança obrigatória.

# Testing

Validação de nome/locale, usuário ausente, isolamento entre identidades, tentativa de mass assignment, criação idempotente e concorrente, falhas do banco. Testes reais no banco exclusivo com rollback. Prisma validate/generate, lint, typecheck, test, build e integração.

# Risks

Migração e credencial de perfil dependem do ambiente; não usar proprietário no runtime. Fluxo real Supabase da fase 10 continua não validado. Ausência de banco/navegador será reportada sem afirmar validação fictícia.

# Definition of Done

Escopo implementado e revisado, checks locais e integração executados com resultados reais registrados. Sem iniciar fase 12.

# Results — 16/11/2026

- Implementação encontrada não commitada após pausa (última alteração em 09/10/2026), sem registro anterior de resultados ou de revisões independentes.
- Verificação em cópia limpa (Linux, Node 22.23.4 — o projeto define 24.x —, pnpm 11.19.0, instalação `--frozen-lockfile`): `pnpm lint`, `pnpm typecheck`, `pnpm test` (26 arquivos/280 testes), `pnpm build` e `pnpm format:check` passaram.
- Typecheck usou o cliente Prisma gerado localmente em 09/10/2026, posterior à alteração do schema.
- Não executados: `pnpm db:validate`/`pnpm db:generate` (download dos engines Prisma bloqueado no ambiente de verificação), aplicação da migration, criação da role `mvf_profile_writer`, `pnpm test:integration` (sem acesso ao PostgreSQL) e smoke manual de `/profile`.
- Fase 11 não está declarada validada com banco. Fase 12 não iniciada.
