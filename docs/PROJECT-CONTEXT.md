# Contexto e continuidade — Meu Visto Fácil

Atualizado em 10/09/2026 a partir do contexto enviado pelo usuário e da inspeção do repositório.

## Objetivo

Reconstruir o Meu Visto Fácil sem reutilizar código do projeto antigo, preservando a ideia do TCC: organizar caminhos de imigração, fontes oficiais e checklists personalizados com IA controlada. O objetivo é uma aplicação funcional de portfólio, com backend, autenticação, banco, testes, segurança, publicação na Vercel e apresentação profissional no GitHub.

## Ponto de retomada — 16/11/2026

Projeto retomado após pausa desde 09/10/2026. Commits das Fases 4–9 enviados ao GitHub. Formatação pendente corrigida e finais de linha CRLF normalizados para LF. Fase 10 commitada; configuração Supabase hospedada e fluxo real de e-mail continuam pendentes. Fase 11 commitada com gate local; migration, role de perfil e integração PostgreSQL pendentes de execução no ambiente do usuário. Pasta `exports/` (pacote de agentes) removida por decisão do usuário. Próximo passo acordado: atualizar dependências por segurança (Next 16.4.6, Zod 4.6.7, Prisma 7.10.1 e versões menores). Deploy adiado por decisão do usuário até o produto estar construído. Fase 12 não iniciada.

## Ponto de retomada — 29/09/2026

Atualização mais recente: Fase 8 commitada em `64a4ae8`. Fase 9 implementada com agentes: validação segura de URLs, persistência otimista e CLI manual por ID. Migration aditiva aplicada em desenvolvimento e teste; 206 testes, integração PostgreSQL, lint, typecheck e build passaram. Nenhuma consulta real a governo foi executada nesta fase; casos de rede usam fakes e transporte usa mocks. Ver [plano da Fase 9](exec-plans/phase-9-url-validation.md). Checkpoint Git da Fase 9 autorizado pelo usuário; Fase 10 não iniciada. O parágrafo abaixo registra o fechamento anterior.

Fases 5–7 registradas em quatro commits locais: `cf51f3e`, `d421c43`, `d60c71f` e `d75176a`. O usuário autorizou a Fase 8 com agentes. Implementação concluída, sem migration: política central de hosts e apresentação dos metadados/status das fontes. Lint, typecheck, 74 testes e build passaram; revisões independentes de código e segurança sem findings relevantes. Após o usuário retomar os projetos Supabase, integração PostgreSQL passou e smoke visual do detalhe foi aprovado em 320/390/768/1440 px, com âncoras e teclado. Fase 8 pronta para revisão; checkpoint Git autorizado pelo usuário. Ver [plano da Fase 8](exec-plans/phase-8-official-sources.md). Fase 9 não iniciada. Registros abaixo preservam o histórico anterior.

O foco inicial é a Irlanda, com poucos caminhos bem implementados. A arquitetura, a stack e as restrições de produto continuam definidas nos documentos existentes, referenciados pelo `AGENTS.md`. Este registro não os substitui.

## Forma de trabalho acordada

- Este acompanhamento concentra estratégia, análise técnica e preparação de cada fase. Implementação somente quando solicitada.
- Trabalhar uma fase de cada vez; aguardar aprovação do usuário antes de avançar.
- Ao pedir a preparação da próxima fase, identificar o estado atual, explicar o objetivo e preparar somente o prompt daquela fase, com indicação de reasoning proporcional à tarefa.
- Não criar novas tarefas nem iniciar implementação automaticamente.
- Investigar somente o contexto necessário, testar de forma direcionada durante o desenvolvimento e executar a verificação pertinente ao final.
- Preservar as permissões normais do ambiente; o contexto não autoriza alterações de Full Access ou Auto Review.
- Consultar as skills reais antes de usá-las; o resumo histórico não substitui suas instruções atuais.

## Estado na importação

| Fase | Estado registrado | Evidência local |
| --- | --- | --- |
| 0 — Repository Foundation | Concluída | `AGENTS.md`, documentação e skills locais |
| 1 — Bootstrap técnico | Concluída | Configuração Next.js/TypeScript/pnpm e `exec-plans/bootstrap.md` |
| 2 — Design Foundation | Concluída; aprovação visual relatada pelo usuário | `DESIGN-SYSTEM.md`, componentes e rota `/design-system` |
| 3 — Landing Page | Concluída; aprovação visual relatada pelo usuário | `src/features/landing/landing-page.tsx` e plano correspondente |
| 4 — Navegação pública da Irlanda | Concluída | Rotas `/ireland`, `/ireland/work`, `/ireland/study`, `/ireland/family`; roadmap e plano de conclusão |
| 5 — Página de visto | Aprovada pelo usuário em 10/09/2026 | Rota de Critical Skills, conteúdo local com fontes oficiais, testes e plano `phase-5-visa-details.md` |

As evidências de testes anteriores estão nos planos de execução. Nesta importação houve inspeção documental e de estrutura, sem reexecutar testes ou certificar novamente as fases concluídas.

## Entrega da Fase 5 e ponto de parada

O pedido de implementação posterior à importação autorizou a Fase 5. Foi entregue a página detalhada do **Critical Skills Employment Permit**, na rota `/ireland/visas/critical-skills-employment-permit`, conectada a `/ireland/work`.

Inclui título, descrição, categoria, público potencial, requisitos, etapas, atributos, fontes com autoridades, data de consulta e disclaimer. Conteúdo local tipado, pesquisado no DETE e ISD em 10/09/2026, sem revisão jurídica e sem consultas externas em runtime. General Employment, Estudo e Família mantêm seus estados anteriores. Banco, autenticação e IA real pertencem às fases posteriores.

Validação desta entrega: `pnpm lint`, `pnpm typecheck`, `pnpm test` (23 testes) e `pnpm build` aprovados. Smoke no navegador integrado: Home → Irlanda → Trabalho → Critical Skills e retorno, teclado, skip link, foco visível e âncoras; sem overflow horizontal em 320, 390, 768 e 1440 px. Revisões com code-review e security-review sem findings relevantes. Não há suíte E2E instalada; leitor de tela e outros navegadores não foram verificados. Detalhes no [plano da Fase 5](exec-plans/phase-5-visa-details.md).

**Fase 5 aprovada pelo usuário no pedido da Fase 6; sem nova certificação da Fase 5. Fase 6 aprovada pelo usuário no pedido da Fase 7, sem nova certificação da entrega anterior. Fase 7 implementada: repositórios públicos, páginas com leitura real e preparação explícita de Critical Skills no desenvolvimento. Aguardar revisão do usuário. Fase 8 não iniciada.**

## Marcos de produto

- A — Portfolio Preview: landing, Irlanda e detalhes de uma opção migratória.
- B — Full Product Flow: autenticação, questionário, recomendação, processo e checklist sem IA.
- C — AI Product: explicações e personalização com validação e fallback.
- D — Production Ready: segurança, testes, acessibilidade, desempenho, privacidade, CI e dados revisados.
- E — Portfolio Ready: publicação, GitHub, README, screenshots, arquitetura e case study.

A sequência detalhada das fases 5 a 48 permanece em [ROADMAP.md](ROADMAP.md).

## Referências e manutenção

- [Contexto original enviado pelo usuário](context/2026-09-10-conversa-gpt.txt): cópia histórica integral, sem atualização automática.
- [Roadmap](ROADMAP.md): escopo e progresso das fases.
- [Planos de execução](exec-plans/): decisões e evidências de cada implementação.

Atualizar este registro quando uma fase for concluída ou o usuário mudar uma decisão de acompanhamento. Distinguir sempre relato histórico, implementação inspecionada e validação realmente executada. Orientações operacionais ou recomendações de modelos no arquivo histórico devem ser conferidas no ambiente atual antes de uso.

## Entrega da Fase 7

CountryRepository, VisaRepository e OfficialSourceRepository implementados como módulos server-only. Cinco rotas públicas da Irlanda leem PostgreSQL; país/visto ACTIVE, fontes e vínculos filtrados, consultas limitadas/ordenadas, contratos sem Prisma. Renderização por requisição com connection(); build validado com DATABASE_URL inválida. Conteúdo editorial complementar permanece local; fatos persistidos não têm fallback.

Critical Skills: DRAFT → ACTIVE somente no desenvolvimento, com resumo do cartão aprovado restaurado. Procedimento verificou consistência com o conteúdo anterior e segunda execução retornou ALREADY_ACTIVE. Sem migration, reset ou aprovação de produção. Runtime auditado com mvf_catalog_reader, SELECT permitido, escrita negada e TLS ativo.

Gate final: db:validate, db:generate, lint, typecheck, 63 testes unitários/UI, integração PostgreSQL (três casos transacionais) e build passaram. Revisões de código e segurança concluídas; limite de detalhe agora falha de forma segura em vez de cortar requisitos. [Plano e evidências](exec-plans/phase-7-repository-layer.md).

Validação visual da Fase 7: fluxo Home → Irlanda → Trabalho → Critical Skills, breadcrumbs, Estudo/Família, teclado, skip link e foco visível; cinco rotas sem overflow em 320/768/1440 px e detalhe também em 390 px. Sem suíte E2E instalada; outros navegadores e leitor de tela não testados. Status READY para revisão, sem início da Fase 8.
