# Goal

Construir antecipadamente a camada visual das telas privadas (painel, questionário, recomendações e processo com checklist), com dados de exemplo em rotas de prévia, para que as fases de backend apenas conectem dados reais. Pedido do usuário em 16/11/2026, enquanto as configurações de Supabase e banco ficam pendentes ([PENDENCIAS.md](../PENDENCIAS.md)).

# Current State

Fases 0–11 implementadas; 10 e 11 dependem de validação manual. Nenhuma tela das fases 12, 13, 17, 22 ou 23 existia.

# Scope

- Rotas `/preview`, `/preview/dashboard` (`?estado=vazio`), `/preview/questionnaire`, `/preview/recommendations` (`?cenario=sem-oferta`), `/preview/processes/exemplo` e `/preview/estados`, todas noindex e com aviso de dados de exemplo.
- Componentes por feature com contratos de apresentação tipados, sem Prisma: `features/dashboard`, `features/questionnaire`, `features/recommendations`, `features/checklists`.
- Regras puras testadas: `calculateChecklistProgress`, `findNextChecklistItem`, `getVisibleQuestions`, `pruneHiddenAnswers`, `countPotentialQuestions`, `sortByCompatibility`.
- Estados compartilhados: `StatePanel` (vazio/erro) e `LoadingRegion` (skeletons com status acessível).

# Non-goals

Persistência, autenticação nas rotas de prévia, Recommendation Engine real, geração de checklist, IA, novos dados migratórios, rotas finais (`/dashboard`, `/processes/[id]`) e deploy.

# Decisions

- Prévias separadas das rotas finais para não simular funcionalidade inexistente. Cada fase futura cria a rota real, resolve usuário/ownership no servidor e reutiliza o componente.
- Estado local apenas onde a interação é inerente (questionário e marcação do checklist). `ChecklistWorkspace.onStatusChange` e `QuestionnaireFlow.resultHref` marcam os pontos de integração com Server Actions (Fases 13 e 23).
- Textos de Critical Skills reaproveitam a consulta editorial de 10/09/2026. General Employment aparece só com critérios genéricos e "em revisão". Linguagem sem promessa de elegibilidade; teste garante que rótulos de compatibilidade não usam "elegível", "aprovado" ou "garantia".
- Progresso arredonda para baixo e exclui `NOT_APPLICABLE`; itens obrigatórios não podem ser marcados como não aplicáveis na UI.
- Questionário estima o total incluindo perguntas que ainda podem aparecer, evitando "1 de 3" seguido de "4 de 6".

# Security Considerations

Nenhum dado real, endpoint, Server Action ou acesso a banco. Prévias não estão no matcher do proxy e não leem sessão. Fixtures não contêm dados pessoais reais.

# Testing

32 testes novos (total 312): regras puras, componentes (validação do questionário, perguntas condicionais, foco, revisão; progresso e filtros do checklist; painel vazio/arquivado; ordenação, impedimentos e estado vazio das recomendações) e páginas de prévia (noindex, variações por parâmetro, estados).

# Results — 16/11/2026

- `prettier --check`, `eslint --max-warnings=0`, `tsc --noEmit`, `vitest run` (34 arquivos/312 testes) e `next build` passaram no ambiente remoto (Node 22.23.4; projeto define 24.x). Cliente Prisma copiado do ambiente local, gerado em 09/10/2026.
- Revisão visual com Chrome headless em 390 e 1440 px das oito variações, mais fluxo completo do questionário (erro, condicionais, revisão) e detalhes do checklist no celular. Sem overflow horizontal. Ajustes feitos após a revisão: total estimado do questionário e resumo de progresso no topo do checklist em telas pequenas.
- Não verificados: leitor de tela real, Safari/Firefox, 320/768 px e teclado em navegador real.

# Definition of Done

Escopo entregue na branch `feature/telas-preview` para revisão do usuário. Sem iniciar a Fase 12.
