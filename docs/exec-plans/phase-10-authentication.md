# Goal

Implementar a fase 10: cadastro, login, logout, recuperação de senha e sessão Supabase Auth.

# Current State

Fase 9 concluída. Aplicação pública sem autenticação; Supabase usado somente como PostgreSQL. `exports/` preexistente não pertence a esta alteração.

# Scope

Rotas /login, /register, /forgot-password, /reset-password e /auth/confirm; helpers getCurrentUser/requireUser; adapter server-only, refresh de cookies, formulários acessíveis e configuração documentada.

# Non-goals

UserProfile (fase 11), dashboard (fase 12), OAuth, alterações de produção e migrations.

# Proposed Architecture

UI → Server Actions → adapter em lib/auth → Supabase Auth. Identidade verificada com getUser no servidor. Header permanece estático com link para /login, que apresenta a sessão e logout. Confirmação de e-mail usa página intermediária e POST para verificar token, evitando mutação em GET. Redirects fixos e origem configurada.

# Implementation Steps

1. Agente de planejamento inspeciona contratos e riscos (concluído).
2. Agente backend implementa lib/auth e proxy com testes; agente UI implementa forms e páginas independentes.
3. Coordenador integra ações, configuração, documentação e testes.
4. Revisões independentes de código e segurança, correções e gate final.

# Files Expected to Change

src/lib/auth/, src/proxy.ts, src/features/auth/, src/app/(auth)/, header e teste da landing, package.json/pnpm-lock.yaml, .env.example, docs de autenticação e roadmap.

# Data Changes

Nenhuma alteração Prisma. Identidades e credenciais gerenciadas pelo Supabase Auth.

# Security Considerations

SDK server-only; nenhuma chave privilegiada; cookies HttpOnly/SameSite/Secure conforme ambiente; inputs Zod; mensagens neutras em cadastro e recuperação; requireUser lança AUTH_REQUIRED; tokens nunca em logs; respostas auth não cacheadas. Proteção de abuso delegada ao provider. Revisão de segurança obrigatória.

# Testing

Testes controlados de validação, adapter, sessão, cookies, ações e formulários. Gate: pnpm lint, pnpm typecheck, pnpm test, pnpm build. Smoke local e verificação de limites de configuração; fluxo real de e-mail depende de configuração e caixa postal disponível.

# Risks

Configuração externa de URL, chave pública e templates de e-mail pode estar pendente. Não declarar fluxo hospedado validado sem execução real. Preservar rotas públicas sem dependência obrigatória de ambiente auth.

# Definition of Done

Escopo implementado, testes/gate passando, diff revisado, revisão de segurança concluída e documentação refletindo comportamento e limitações reais.

# Results — 29/09/2026

- Planejamento, backend, UI e revisão independente executados com agentes; skills feature-workflow, feature-development, testing, code-review e security-review aplicadas.
- Cadastro/login/logout, confirmação POST, recuperação/nova senha e helpers implementados. Nenhuma migration ou perfil criado.
- 50 testes acrescentados (total 256), cobrindo identidade, sessão, cookies, ações, inputs inválidos, erros, destinos fixos, páginas e formulários.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (21 arquivos/256 testes), `pnpm build` e `git diff --check`: passaram.
- Revisão independente não encontrou finding relevante; acrescentado diagnóstico estruturado sem dados pessoais para falhas de envio.
- Smoke HTTP local: /login, /register, /forgot-password e /auth/confirm respondem 200; /reset-password sem sessão termina em /login. Header no-referrer observado; servidor dev sobrescreve Cache-Control para no-cache/must-revalidate.
- Smoke visual bloqueado: browser runtime não disponibilizou navegador (lista vazia). Não existe script test:e2e nesta fase; fluxo real Supabase/SMTP não executado.
- Configuração externa e templates documentados em docs/AUTHENTICATION.md; não foram alterados no projeto hospedado. Portanto o código passou no gate local, mas autenticação hospedada não está declarada operacional.
- Servidor de desenvolvimento iniciado em http://localhost:3000 para inspeção do usuário. exports/ preexistente preservado. Fase 11 não iniciada.
