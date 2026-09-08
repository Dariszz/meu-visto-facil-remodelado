# Goal
Implementar a Fase 3: apresentação pública profissional do Meu Visto Fácil.

# Current State
Design Foundation pronta; home provisória; catálogo e autenticação ainda ausentes. Arquivos existentes estão sem rastreamento no Git; preservar o trabalho anterior.

# Scope
Hero, jornada, diferenciais, fontes, Irlanda, personalização, sobre, CTA e navegação compartilhada. Metadata básica e testes semânticos.

# Non-goals
Fase 4, backend, autenticação, banco, IA real, conteúdo migratório factual e rotas legais.

# Proposed Architecture
Server Components de apresentação em features/landing; home compõe a experiência. Reutilizar Container, PageSection, Badge, Card e Button. Header com navegação responsiva sem JavaScript. CTAs apontam à seção Irlanda; catálogo explicitamente em breve. Privacidade e Termos apresentados como futuros, sem links quebrados.

# Implementation Steps
1. Compor landing e prévia conceitual sem dados legais.
2. Estender header/footer e metadata.
3. Testar conteúdo e destinos dos links.
4. Revisar código e apresentação responsiva; executar verificações finais.

# Files Expected to Change
src/app/page.tsx, src/app/page.test.tsx, src/components/layout/header.tsx, src/components/layout/footer.tsx, src/features/landing/*, docs/ROADMAP.md.

# Data Changes
Nenhuma.

# Security Considerations
NOT_REQUIRED: apenas conteúdo público estático e âncoras locais; nenhuma entrada, requisição externa ou operação sensível.

# Testing
RTL para mensagem, headings, status demonstrativo e CTAs válidos. Verificação visual mobile/tablet/desktop. Gate final: pnpm lint, pnpm typecheck, pnpm test, pnpm build.

# Risks
Evitar confundir proposta futura com funcionalidade disponível; manter status visível. Não inventar fontes nem datas de revisão.

# Definition of Done
Seções completas, responsividade revisada, testes e build aprovados, diff revisado e Fase 4 não iniciada.

# Completion
- READY em 08/09/2026. Implementadas todas as seções, metadata e navegação compartilhada.
- Três testes da landing cobrem proposta, status futuro, links e metadata; suíte completa com 12 testes aprovados.
- Gate final aprovado: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Home pré-renderizada estaticamente.
- Revisão visual em 390/768/1440 px; sem overflow horizontal em mobile/tablet. Navegação à Irlanda acionada por Enter no navegador.
- Revisão de código corrigiu uso de âncoras no layout compartilhado para Next Link e simplificou tipagem das listas. Sem findings relevantes restantes.
- Segurança: NOT_REQUIRED, escopo permaneceu estático e público.
- `git diff` e `git diff --staged` vazios porque o repositório já estava inteiramente sem rastreamento; revisão feita diretamente nos arquivos envolvidos. Nenhum commit criado sobre o trabalho anterior.
- E2E automatizado não executado: não existe script/suíte E2E configurada. Leitor de tela e outros motores de navegador não testados.
