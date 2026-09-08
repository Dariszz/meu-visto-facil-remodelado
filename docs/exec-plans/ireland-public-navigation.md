# Goal
Implementar a Fase 4: navegação pública da Irlanda.

# Current State
Landing e Design Foundation existentes. CTAs apontam à home. Repositório sem arquivos rastreados; preservar alterações anteriores.

# Scope
Quatro rotas públicas, categorias, dois resumos de trabalho, breadcrumbs, metadata e navegação desde a landing.

# Non-goals
Banco, autenticação, IA, detalhes de vistos, requisitos oficiais e integrações.

# Proposed Architecture
Rotas explícitas como Server Components; apresentação e dados temporários tipados em features/visas. Reutilizar layout e componentes existentes. Slugs preparados para a Fase 5, sem links para páginas inexistentes.

# Implementation Steps
1. Criar dados locais e componentes públicos.
2. Compor rotas e metadata; conectar header e landing.
3. Testar navegação, resumos e estados em breve.
4. Revisar alterações e executar gate final.

# Files Expected to Change
src/app/ireland/*, src/features/visas/*, src/components/layout/breadcrumbs.tsx, header.tsx, landing-page.tsx, page.test.tsx e docs/ROADMAP.md.

# Data Changes
Somente projeções locais temporárias Country, VisaCategory e VisaSummary. Não são registros oficiais revisados nem seed de produção.

# Security Considerations
NOT_REQUIRED: conteúdo público estático, links internos constantes, nenhuma entrada ou operação sensível.

# Testing
RTL para rotas, CTAs, breadcrumbs, headings e estados vazios. Gate final: lint, typecheck, test e build. Inspeção responsiva se navegador disponível; não há script E2E instalado.

# Risks
Evitar apresentar disponibilidade editorial como elegibilidade ou detalhes revisados. Preservar identidade visual e não criar navegação quebrada.

# Definition of Done
Quatro páginas navegáveis, testes e verificações aprovados, revisão concluída e nenhuma implementação da Fase 5.

# Completion
Concluída em 08/09/2026. READY.

- Rotas explícitas, Server Components e projeções editoriais locais implementados.
- Header e CTAs da landing conectados; footer preservado. Slugs dos resumos preparados para `/ireland/visas/[slug]`, sem navegação antecipada.
- Oito testes novos e testes da landing atualizados: 11 direcionados passaram; suíte completa com 20 testes passou.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: aprovados. Build confirmou as quatro rotas estáticas.
- Formatação pelo executável local `node_modules/.bin/prettier.cmd`; `pnpm exec prettier` não encontrou o executável neste ambiente.
- Smoke via Playwright com Edge instalado: 12 combinações de rota/largura, HTTP 200, um h1 e ausência de overflow horizontal; fluxo Home → Irlanda → Trabalho → Irlanda aprovado. Capturas em 390, 768 e 1440 px; revisão visual de destino, trabalho e estado vazio.
- `pnpm test:e2e` não existe no projeto; smoke de navegador executado sem adicionar dependências. Chromium empacotado indisponível, usado Edge existente.
- Code review sem findings relevantes pendentes. `git diff` e `git diff --staged` vazios porque a base está sem rastreamento; revisão direta de todos os arquivos da feature e alterações da landing/header.
- Security review: NOT_REQUIRED, sem comportamento sensível introduzido.
- Limites: conteúdo editorial introdutório, sem requisitos oficiais; páginas detalhadas permanecem para a Fase 5. Nenhum deploy realizado.
