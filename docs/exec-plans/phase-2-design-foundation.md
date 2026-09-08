# Goal
Implementar exclusivamente a Fase 2: fundação visual acessível e reutilizável.

# Current State
Bootstrap Next.js 16, React 19, Tailwind 4 e Vitest. Página estática mínima; arquivos existentes ainda não rastreados pelo Git.

# Scope
Tokens, configuração shadcn/ui, dez componentes UI, quatro componentes de layout, marca SVG e favicon, demonstração dos componentes.

# Non-goals
Landing completa, catálogo, autenticação, persistência, questionário, regras migratórias e IA.

# Proposed Architecture
Primitivos em src/components/ui; composição em src/components/layout. Layout e páginas Server Components; interatividade nos primitivos Radix e demonstração de Dialog. Configuração CSS-first do Tailwind 4. Instalação manual dos componentes shadcn/ui com personalização local.

# Implementation Steps
1. Configurar dependências, aliases e tokens.
2. Implementar componentes e shell compartilhado.
3. Criar demonstração visual sem dados migratórios.
4. Testar comportamento, revisar acessibilidade e corrigir findings.
5. Executar lint, typecheck, testes e build; registrar resultado.

# Files Expected to Change
components.json, package.json, pnpm-lock.yaml, src/app, src/components/ui, src/components/layout, src/lib/cn.ts, docs/DESIGN-SYSTEM.md.

# Data Changes
Nenhuma.

# Security Considerations
NOT_REQUIRED: UI local sem dados privados, requisições externas em runtime ou operações privilegiadas.

# Testing
RTL: controles desabilitados, associação de erros, Select, Dialog e progresso. Revisão visual responsiva quando navegador disponível. Gate final: pnpm lint, pnpm typecheck, pnpm test, pnpm build.

# Risks
Contraste, foco de modal, overflow mobile e fronteiras client. Preservar estado preexistente sem commits ou staging.

# Definition of Done
Componentes implementados, tokens documentados, revisão concluída e verificações finais aprovadas. Parar na Fase 2.

# Completion

Status: READY. Fase 2 concluída, sem iniciar a Fase 3.

- Gate final aprovado: pnpm lint, pnpm typecheck, pnpm test (10 testes, 2 arquivos), pnpm build (rotas estáticas).
- Formatação direcionada aprovada com node node_modules/prettier/bin/prettier.cjs --check. pnpm exec prettier não encontrou o executável neste ambiente; foi utilizado o mesmo Prettier instalado via Node.
- Revisão visual: desktop 1440 px, tablet 768 px, mobile 390 e 320 px. Select por teclado, contenção de Tab, Escape e retorno de foco do Dialog confirmados.
- Findings corrigidos: valor ARIA do Progress ausente na base importada; sintaxe de variáveis CSS antiga no Select; borda aria-invalid sobrescrita pelas utilities; opção de teste incompatível com os tipos do Testing Library. Nenhum finding pendente.
- Segurança: NOT_REQUIRED, interface sem dados privados ou operações sensíveis.
- Limites: sem leitor de tela real, Safari/Firefox ou suíte E2E persistida. Revisão direta dos arquivos, pois o bootstrap inteiro já estava untracked e git diff não exibe esses arquivos.

## Arquivos desta fase

- Configuração: components.json, package.json, pnpm-lock.yaml.
- App: src/app/globals.css, layout.tsx, page.tsx, page.test.tsx, icon.svg; src/app/design-system/page.tsx e dialog-example.tsx.
- UI: src/components/ui/button.tsx, input.tsx, textarea.tsx, select.tsx, card.tsx, badge.tsx, progress.tsx, alert.tsx, dialog.tsx, skeleton.tsx e foundation.test.tsx.
- Layout: src/components/layout/container.tsx, page-section.tsx, header.tsx, footer.tsx e brand.tsx.
- Composição de classes: src/lib/cn.ts.
- Documentação: docs/DESIGN-SYSTEM.md, docs/ROADMAP.md e este plano.

Dependências adicionadas: @radix-ui/react-dialog 1.1.23, @radix-ui/react-progress 1.1.16, @radix-ui/react-select 2.3.7, @radix-ui/react-slot 1.3.3, class-variance-authority 0.7.1, clsx 2.1.1, lucide-react 1.42.0 e tailwind-merge 3.6.0. Stack existente preservada.
