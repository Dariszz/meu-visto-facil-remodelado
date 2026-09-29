# Goal

Implementar somente a Fase 5: página pública de Critical Skills Employment Permit.

# Current State

Fases 0–4 presentes. Conteúdo editorial local em `src/features/visas`; detalhes indisponíveis. Alterações preexistentes: README.md, PROJECT-CONTEXT.md e docs/context/; preservar. Não há script nem infraestrutura E2E instalada.

# Scope

Página completa, metadata, breadcrumbs, fontes rastreáveis, ligação a partir de Trabalho, testes e smoke responsivo.

# Non-goals

Banco, autenticação, IA, checklist funcional, General Employment detalhado, deploy e Fase 6.

# Proposed Architecture

Rota estática fina → componente de servidor da feature → conteúdo editorial tipado local. Reutilizar Container, PageSection, Badge, Card, Button e Breadcrumbs. Sem novos serviços ou dependências; links externos nativos na mesma aba.

# Implementation Steps

1. Pesquisar fontes oficiais e registrar limites editoriais.
2. Criar dados e página, habilitando somente o resumo de Critical Skills.
3. Testar conteúdo, navegação, referências e caminhos indisponíveis.
4. Revisar código e segurança dos links; executar gate completo e smoke no navegador.
5. Atualizar continuidade e roadmap, separando entrega técnica de aprovação visual.

# Files Expected to Change

`src/features/visas/{types.ts,data/ireland.ts,data/critical-skills.ts,critical-skills-page.tsx,category-page.tsx}`, rota e testes em `src/app/ireland`, este plano, ROADMAP.md e PROJECT-CONTEXT.md.

# Data Changes

Somente conteúdo local. Consulta editorial em **10/09/2026**, sem revisão jurídica:

- [DETE — Critical Skills Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/): descrição, oferta, ocupação, remuneração, qualificação e solicitação.
- [ISD — Coming to work in Ireland](https://www.irishimmigration.ie/coming-to-work-in-ireland/): distinção de visto de entrada e autorização de trabalho.
- [ISD — Registering your immigration permission](https://www.irishimmigration.ie/registering-your-immigration-permission/): registro e residência.

Limitações: resumo não exaustivo; omitir valores de salários, taxas, prazos de processamento, dependentes e transição para Stamp 4. O DETE conserva menções antigas ao GNIB; usar a orientação atual do ISD para registro. Sem prometer elegibilidade ou aprovação. Cada bloco factual aponta para a referência correspondente. Pesquisa editorial não implementa verificação automática em runtime.

# Security Considerations

Revisão REQUIRED por introduzir URLs e por pedido explícito. URLs HTTPS fixas de autoridades oficiais, sem credenciais, entrada externa, fetch, HTML arbitrário ou nova aba. SSRF não é introduzido. Testar destinos exatos, protocolo e ausência de credenciais.

# Testing

RTL/Vitest sem rede: headings, referências, disclaimer, data, breadcrumbs, metadata e navegação com preservação dos estados indisponíveis. Verificação direcionada primeiro; gate final: pnpm lint, pnpm typecheck, pnpm test, pnpm build. Smoke Home → Irlanda → Trabalho → Critical Skills; teclado e larguras móvel/tablet/desktop.

# Risks

Conteúdo pode mudar após a consulta; confirmar condições nas fontes antes de decisões. Aprovação visual depende do usuário.

# Definition of Done

Escopo implementado, testes e gate aprovados, diff e segurança revisados, smoke registrado, documentação atualizada. Parar para revisão do usuário, sem iniciar a Fase 6.

# Results

**READY — entrega técnica concluída em 10/09/2026; aprovação visual pendente do usuário.**

- Implementação conforme plano, sem novas dependências. Rota pré-renderizada estaticamente pelo build.
- Testes: 3 novos casos de detalhes; navegação de Trabalho atualizada, regressões de Estudo/Família mantidas. `pnpm test src/app/ireland`: 11 testes aprovados (executado antes e depois da correção de tipagem).
- Correção durante verificação: removida opção `exact` incompatível com `ByRoleOptions` do RTL; `pnpm typecheck` passou após a correção. Sem falha remanescente.
- Formatação: `pnpm exec prettier --write ...` não localizou o executável no wrapper do ambiente; usado o Prettier já instalado com `node node_modules/prettier/bin/prettier.cjs --write` somente nos arquivos afetados, com sucesso.
- Gate final executado: `pnpm lint`, `pnpm typecheck`, `pnpm test` (4 arquivos, 23 testes) e `pnpm build`, todos com exit code 0. `git diff --check` aprovado, apenas avisos de normalização LF/CRLF do ambiente.
- Code review: diff rastreado e novos arquivos revisados, incluindo testes e componente compartilhado de breadcrumbs. Sem findings relevantes de correção, arquitetura ou acessibilidade.
- Security review REQUIRED e executada: fontes locais com destinos HTTPS exatos, sem credenciais/portas/query, referências tipadas e HTML escapado pelo React. Não há requisições externas, redirects, entrada de usuário ou dados privados nesta feature. Nenhuma vulnerabilidade relevante encontrada; testes de destinos e referências aprovados.
- Smoke com `pnpm dev` e navegador integrado: Home → Irlanda → Trabalho → Critical Skills, abertura por Enter e retorno a Trabalho. General Employment permaneceu desabilitado.
- Layout inspecionado por capturas completas em 390, 768 e 1440 px; overflow horizontal também medido em 320 px. Medidas viewport/scrollWidth: 320/305, 390/375, 768/753, 1440/1425 (barra vertical ocupa 15 px); nenhum overflow.
- Teclado: skip link move foco para `main-content`; Tab chega a Início com outline sólido; Enter nos CTAs chega a `#requisitos` e `#fontes`; retorno por Enter funciona. Nenhum erro de console capturado.
- Limitações: smoke realizado no servidor de desenvolvimento; build de produção compilado, sem smoke separado com `pnpm start`. Sem leitor de tela real, Safari/Firefox, teste de todas as combinações de teclado ou E2E persistido. Não executado `pnpm test:e2e`, pois não existe infraestrutura. Fontes consultadas na preparação editorial; testes não acessam rede. Conteúdo resumido e sujeito a mudanças, não é revisão jurídica.
- README e contexto histórico preservados; PROJECT-CONTEXT e ROADMAP atualizados com a entrega efetiva. Fase 6 não iniciada.
