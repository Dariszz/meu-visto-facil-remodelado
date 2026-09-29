# Meu Visto Fácil — Roadmap

## 1. Objetivo

Este documento define a sequência de implementação do Meu Visto Fácil.

O projeto será desenvolvido em fases incrementais.

Cada fase deve:

* possuir objetivo claro;
* depender apenas do necessário das fases anteriores;
* gerar uma entrega verificável;
* incluir testes proporcionais à mudança;
* manter o projeto executável;
* evitar grandes blocos de trabalho impossíveis de revisar.

O Codex deverá trabalhar seguindo este roadmap, salvo quando houver uma razão técnica documentada para alterar a ordem.

---

# 2. Princípio de desenvolvimento

Evitar:

```text id="jl4fzm"
Build the entire application.
```

Preferir:

```text id="w19iqp"
Bootstrap
 ↓
Foundation
 ↓
Public experience
 ↓
Authentication
 ↓
Data
 ↓
Recommendation
 ↓
Checklist
 ↓
AI
 ↓
Hardening
 ↓
Production
```

Cada etapa deve deixar o projeto em um estado utilizável.

---

# 3. Objetivo do MVP

A primeira versão pública deve permitir:

```text id="gj6s5k"
Visitor
 ↓
Open Meu Visto Fácil
 ↓
Explore Ireland
 ↓
Understand visa options
 ↓
Create account
 ↓
Answer profile questionnaire
 ↓
Receive recommendations
 ↓
Select a visa
 ↓
Generate personalized checklist
 ↓
Save process
 ↓
Mark progress
 ↓
Return later
```

Tudo publicado na Vercel.

---

# 4. Fase 0 — Repository Foundation

## Objetivo

Criar a base do repositório antes da aplicação.

## Entregas

```text id="a2k1m7"
AGENTS.md
README.md

docs/
├── PRODUCT.md
├── TECH-STACK.md
├── ARCHITECTURE.md
├── DATA-MODEL.md
├── AI-ARCHITECTURE.md
├── SECURITY.md
├── TESTING.md
└── ROADMAP.md
```

Também:

```text id="k0v4m8"
docs/decisions/
docs/exec-plans/
```

## Resultado

Um repositório vazio de aplicação, mas completamente especificado.

---

# 5. Fase 1 — Bootstrap técnico

## Objetivo

Criar a aplicação Next.js e infraestrutura mínima de desenvolvimento.

## Implementar

* Next.js;
* React;
* TypeScript;
* App Router;
* `src/`;
* Tailwind CSS;
* ESLint;
* Prettier;
* pnpm;
* `.nvmrc`;
* `.env.example`;
* TypeScript strict;
* scripts básicos.

## Estrutura inicial

```text id="pw5bmf"
src/
├── app/
├── components/
├── features/
├── lib/
├── shared/
└── test/
```

## Scripts esperados

```text id="pizwja"
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Verificação

```text id="4ttjli"
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Todos devem passar.

---

# 6. Fase 2 — Design foundation

Status: implementada. Tokens, componentes, composição e limites documentados em [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Demonstração visual em `/design-system`.

## Objetivo

Criar a base visual do produto.

## Implementar

* Tailwind configuration;
* design tokens;
* typography;
* spacing;
* colors;
* responsive breakpoints;
* shadcn/ui;
* base components;
* logo placeholder/final;
* favicon;
* global layout.

## Componentes iniciais

```text id="9cbm6m"
Button
Input
Card
Badge
Progress
Dialog
Select
Textarea
Skeleton
Alert
```

## Layout

```text id="bffhfb"
Header
Footer
Container
PageSection
```

## Resultado

A aplicação já deve possuir uma identidade visual coerente.

---

# 7. Fase 3 — Landing Page

Status: implementada em 08/09/2026. Home estática com apresentação do produto,
jornada, diferenciais, fontes, personalização, Irlanda e CTA. Navegação usa âncoras
válidas; catálogo da Irlanda e páginas legais permanecem explicitamente em breve.
Validação: lint, typecheck, 12 testes e build aprovados; revisão visual em
390, 768 e 1440 px. Plano e registro: `docs/exec-plans/landing-page.md`.

## Objetivo

Criar uma apresentação profissional do produto.

## Seções sugeridas

```text id="ak2x83"
Hero

Como funciona

Por que usar

Fontes oficiais

Personalização

Países

CTA

Footer
```

## Hero

Deve comunicar rapidamente:

> Entenda seus caminhos para morar, trabalhar ou estudar no exterior.

CTA principal:

```text id="pu8jwu"
Explorar Irlanda
```

CTA secundário:

```text id="62e89b"
Como funciona
```

## Requisitos

* responsiva;
* acessível;
* SEO;
* boa performance;
* visual profissional.

---

# 8. Fase 4 — Navegação pública da Irlanda

Status: implementada em 08/09/2026. Quatro rotas estáticas com metadata,
breadcrumbs, categorias e dados locais tipados. Header e landing conectados ao
destino; Trabalho apresenta Critical Skills e General Employment, com detalhes
em breve. Estudo e Família têm estados informativos de preparação.
Validação: lint, typecheck, 20 testes e build aprovados. Smoke no Edge em
390, 768 e 1440 px e fluxo Home → Irlanda → Trabalho → Irlanda aprovados.
Plano e registro: `docs/exec-plans/ireland-public-navigation.md`.

## Objetivo

Criar a primeira experiência real do produto.

Rotas:

```text id="f5iynj"
/ireland
/ireland/work
/ireland/study
/ireland/family
```

## Conteúdo

Ainda poderá utilizar dados locais controlados.

Não é obrigatório possuir PostgreSQL nesta fase.

Objetivo é validar:

* navegação;
* UI;
* arquitetura;
* experiência.

---

# 9. Fase 5 — Página de visto

**Implementada em 10/09/2026; aprovação da Fase 5 informada pelo usuário no pedido da Fase 6.** Página estática de Critical Skills com conteúdo editorial local, fontes DETE/ISD consultadas na mesma data, requisitos resumidos, etapas, distinção trabalho/entrada/residência, metadata, breadcrumbs e disclaimer. Trabalho conecta à página; General Employment, Estudo e Família preservados. Sem banco, autenticação, IA ou deploy.

Verificação: lint, typecheck, 23 testes e build aprovados. Smoke Home → Irlanda → Trabalho → Critical Skills, retorno, teclado e larguras 320/390/768/1440 px sem overflow horizontal. Revisões de código e segurança dos links sem findings relevantes. Sem infraestrutura E2E instalada; smoke via navegador integrado. Evidências e limitações em [phase-5-visa-details.md](exec-plans/phase-5-visa-details.md). Fase 6 autorizada posteriormente pelo usuário; os resultados acima pertencem à Fase 5.

## Objetivo

Criar página completa de uma opção migratória.

Primeiro caso:

```text id="0h51sz"
Critical Skills Employment Permit
```

Rota:

```text id="a6vrak"
/ireland/visas/critical-skills-employment-permit
```

## Conteúdo

* título;
* descrição;
* categoria;
* para quem pode ser relevante;
* requisitos;
* etapas;
* atributos;
* fontes;
* última revisão;
* disclaimer.

## Resultado

Já teremos uma página forte para screenshot e portfólio.

---

# 10. Fase 6 — Banco de dados

**Fase 6 aprovada pelo usuário no pedido da Fase 7, sem nova certificação desta entrega. Infraestrutura validada em Supabase em 10/09/2026.** Migration aplicada em teste vazio e desenvolvimento; integração real, seed repetido e persistência após reconectar aprovados. Escopo desta entrega: schema, migration, cliente, ambiente e seed. Na conclusão da Fase 6, páginas continuavam locais; a integração posterior está registrada na Fase 7. Ver [plano](exec-plans/phase-6-database-foundation.md) e [setup](DATABASE-SETUP.md).

## Objetivo

Substituir dados locais relevantes por PostgreSQL.

## Configurar

* PostgreSQL provider;
* Prisma;
* migrations;
* database client;
* environment validation.

## Primeiras entidades

```text id="ueeuol"
Country
VisaCategory
Visa
VisaRequirement
OfficialSource
RequirementSource
VisaSource
```

## Seed

Criar seed da Irlanda.

Inicialmente com poucos dados bem revisados.

---

# 11. Fase 7 — Repository Layer

**Implementada em 10/09/2026, pronta para revisão do usuário.** Três repositórios server-only conectam as cinco rotas da Irlanda ao PostgreSQL, com publicação ACTIVE, fontes associadas, ordenação/limites, erros seguros e renderização por requisição sem banco no build. Critical Skills preparado no desenvolvimento por procedimento limitado e repetível; sem migration ou aprovação de produção. General Employment, Estudo e Família preservados. Gate: db:validate, db:generate, lint, typecheck, 63 testes, integração real e build passaram. [Plano, divisão editorial e evidências](exec-plans/phase-7-repository-layer.md). Fase 8 não iniciada.

## Objetivo

Criar acesso estruturado aos dados.

Implementar:

```text id="95ru0a"
CountryRepository
VisaRepository
OfficialSourceRepository
```

Queries necessárias para páginas públicas.

## Refatorar

As páginas anteriores passam a carregar dados reais do banco.

---

# 12. Fase 8 — Fontes oficiais

## Objetivo

Criar infraestrutura de rastreabilidade.

## Implementar

* source registry;
* official hostname allowlist;
* source metadata;
* source status;
* última verificação.

## UI

Páginas devem mostrar:

```text id="2u7gm3"
Fonte oficial
Authority
Last reviewed
[Ver fonte]
```

---

# 13. Fase 9 — URL validation

## Objetivo

Implementar validação segura de fontes oficiais.

## Implementar

```text id="b61t9f"
validateOfficialSourceUrl()
```

incluindo:

* HTTPS;
* hostname allowlist;
* redirect validation;
* timeout;
* SSRF protection;
* status result.

## Testes obrigatórios

* host válido;
* host falso;
* localhost;
* private IP;
* protocol inválido;
* redirect malicioso;
* timeout.

---

# 14. Fase 10 — Autenticação

## Objetivo

Permitir criação e acesso a conta.

## Configurar

Supabase Auth.

## Fluxos

```text id="zoou8h"
Register
Login
Logout
Forgot Password
```

## Rotas

```text id="lioc2m"
/login
/register
/forgot-password
```

## Server helpers

```text id="lf2287"
getCurrentUser()
requireUser()
```

---

# 15. Fase 11 — Perfil da aplicação

## Objetivo

Criar `UserProfile` associado à identidade Supabase.

## Entidades

```text id="2pu9zd"
UserProfile
```

## Implementar

* criação automática/controlled profile;
* display name;
* locale;
* lookup por auth user ID.

---

# 16. Fase 12 — Dashboard

## Objetivo

Criar área autenticada inicial.

Rota:

```text id="f66pyi"
/dashboard
```

## Inicialmente

```text id="1bnodh"
Olá, usuário

Seus processos
(empty state)

Comece sua jornada
[Explorar Irlanda]
```

## Requisitos

* server-side auth;
* private metadata;
* empty states;
* mobile responsivo.

---

# 17. Fase 13 — Questionário

## Objetivo

Coletar perfil migratório.

## Entidades

```text id="rmvv71"
ProfileQuestion
QuestionOption
ProfileAnswer
```

## Primeiras perguntas

Exemplo:

* objetivo;
* nacionalidade;
* oferta de emprego;
* área profissional;
* nível de formação;
* intenção de estudar;
* familiares no país.

O conjunto real deve ser pequeno e relevante.

---

# 18. Fase 14 — Questionário dinâmico

## Objetivo

Perguntas subsequentes podem depender das respostas anteriores.

Exemplo:

```text id="mk2coi"
Tem oferta de emprego?
       │
       ├── sim
       │    ↓
       │ área profissional
       │
       └── não
            ↓
       pula perguntas específicas
```

Não criar engine excessivamente complexa.

---

# 19. Fase 15 — Normalização do perfil

## Objetivo

Transformar respostas configuráveis em um objeto de domínio.

Exemplo:

```ts id="5ptxts"
ImmigrationProfile
```

Application Layer:

```text id="9l9wc0"
ProfileAnswer[]
       ↓
normalizeProfile()
       ↓
ImmigrationProfile
```

Testes fortes nesta etapa.

---

# 20. Fase 16 — Recommendation Engine V1

## Objetivo

Criar recomendação determinística sem IA.

Primeiras opções:

```text id="tplz1c"
Critical Skills Employment Permit
General Employment Permit
```

Se houver dados suficientemente confiáveis para estudo/família, adicionar gradualmente.

---

# 21. Recommendation Result

Retorno:

```text id="icye6x"
compatibility
matchedCriteria
missingCriteria
blockers
```

Sem texto de IA ainda.

---

# 22. Fase 17 — Recommendation UI

## Objetivo

Mostrar resultados de forma clara.

Exemplo:

```text id="mw3qfk"
Critical Skills Employment Permit

Alta compatibilidade

Por que apareceu:
✓ objetivo de trabalho
✓ oferta de emprego

Ainda precisamos confirmar:
• condição X

[Ver detalhes]
```

---

# 23. Fase 18 — Testes do Rule Engine

## Obrigatório antes de IA

Criar cenários para:

```text id="wbxzrg"
high compatibility
medium compatibility
low compatibility
missing information
blockers
```

A recommendation engine deve ser confiável independentemente da IA.

---

# 24. Fase 19 — Immigration Process

## Objetivo

Permitir que usuário selecione uma opção e inicie processo.

Entidade:

```text id="d053lt"
ImmigrationProcess
```

Fluxo:

```text id="bx8jy2"
Recommendation
 ↓
Start Process
 ↓
ImmigrationProcess
 ↓
Dashboard
```

---

# 25. Fase 20 — Process Snapshot

## Objetivo

Preservar contexto da criação.

Entidade:

```text id="1z7oyr"
ProcessSnapshot
```

Guardar:

* perfil;
* visto;
* requisitos;
* rule engine version.

Nesta fase, `promptVersion` pode ainda ser nulo.

---

# 26. Fase 21 — Base Checklist Engine

## Objetivo

Criar checklist sem IA.

Fluxo:

```text id="wlr60z"
Visa requirements
       +
Requirement conditions
       +
Profile
       ↓
Base Checklist
```

## Entidades

```text id="09su8b"
Checklist
ChecklistItem
ChecklistItemSource
```

---

# 27. Fase 22 — Checklist UI

## Objetivo

Criar uma das telas principais do produto.

Rota:

```text id="wwzd90"
/processes/[id]
```

Mostrar:

* nome do processo;
* visto;
* progresso;
* itens;
* categorias;
* fontes;
* última referência.

---

# 28. Fase 23 — Checklist Progress

## Implementar

Usuário pode:

```text id="bpwmde"
PENDING
↓
IN_PROGRESS
↓
COMPLETED
```

Quando aplicável:

```text id="qllprw"
NOT_APPLICABLE
```

## Progresso

Calculado no domínio.

Não armazenar percentual inicialmente.

---

# 29. Fase 24 — Ownership Security

## Objetivo

Antes de continuar adicionando features, garantir isolamento de usuários.

Testes:

```text id="faey4q"
User A cannot read User B process.
User A cannot modify User B checklist.
User A cannot generate content for User B process.
```

Essa fase é obrigatória.

---

# 30. Fase 25 — AI Foundation

## Objetivo

Adicionar OpenAI sem alterar comportamento ainda.

Implementar:

```text id="avipwu"
AIProvider
OpenAIProvider
FakeAIProvider
```

Também:

* config;
* errors;
* timeout;
* logging;
* model selection.

---

# 31. Fase 26 — Structured AI

## Implementar

Base reutilizável:

```text id="3o5np2"
generateStructured()
```

com:

* schema;
* validation;
* errors;
* controlled retry;
* timeout.

---

# 32. Fase 27 — Recommendation Explanation AI

## Objetivo

A IA começa a explicar resultado já calculado.

Fluxo:

```text id="fqw7dv"
Recommendation Engine
       ↓
Structured Result
       ↓
AI
       ↓
Personalized Explanation
```

## Fallback

Se IA falhar:

mostrar explicação determinística.

---

# 33. Fase 28 — Checklist Personalization AI

## Objetivo

Enriquecer base checklist.

Fluxo:

```text id="u7xhfo"
Base Checklist
       ↓
AI enrichment
       ↓
Validation
       ↓
Mandatory merge
       ↓
Final Checklist
```

## Teste crítico

IA não remove requisito obrigatório.

---

# 34. Fase 29 — AI Observability

## Implementar

Metadata como:

```text id="tik6az"
operation
model
promptVersion
latency
status
fallbackUsed
```

Sem PII desnecessário.

---

# 35. Fase 30 — AI Rate Limiting

## Objetivo

Evitar abuso e custos inesperados.

Proteger:

```text id="0qlf4u"
recommendation explanation
checklist personalization
```

Usar solução distribuída compatível com Vercel.

---

# 36. Fase 31 — Process History

## Objetivo

Dashboard passa a mostrar processos existentes.

```text id="952g3f"
Meus processos

Critical Skills
68%

General Employment
32%
```

Permitir:

* continuar;
* pausar;
* arquivar.

---

# 37. Fase 32 — Account Settings

## Implementar

```text id="kx3sk0"
/settings
```

Inicialmente:

* nome;
* preferências básicas;
* logout;
* exclusão de conta.

Não criar painel complexo.

---

# 38. Fase 33 — Privacy and Terms

## Criar

```text id="vo070h"
/privacy
/terms
```

Conteúdo deve explicar:

* natureza informativa;
* dados utilizados;
* uso de IA;
* fontes;
* terceiros;
* exclusão de conta.

---

# 39. Fase 34 — Accessibility Pass

## Objetivo

Revisar produto como um todo.

Verificar:

* keyboard;
* focus;
* labels;
* headings;
* dialog;
* form errors;
* contrast;
* semantic HTML;
* screen reader basics.

---

# 40. Fase 35 — Responsive Pass

## Revisar

```text id="3pwvl9"
mobile
tablet
desktop
```

Especial atenção:

* dashboard;
* questionário;
* recommendation cards;
* checklist.

---

# 41. Fase 36 — Error UX

## Objetivo

Nenhuma falha importante deve gerar experiência quebrada.

Criar:

```text id="23oe7z"
loading states
error states
empty states
not-found states
retry controls
```

---

# 42. Fase 37 — SEO

## Público

Otimizar:

```text id="c2aoy4"
/
/ireland
/ireland/work
/ireland/study
/ireland/visas/*
```

Adicionar:

* metadata;
* Open Graph;
* canonical quando necessário;
* sitemap;
* robots.

---

# 43. Fase 38 — Analytics

## Implementar

Vercel Analytics.

Eventos relevantes:

```text id="funzea"
visa_viewed
questionnaire_started
questionnaire_completed
recommendation_generated
process_started
checklist_item_completed
official_source_opened
```

Sem PII.

---

# 44. Fase 39 — Performance

## Revisar

* Server/Client boundaries;
* bundle;
* images;
* caching;
* database queries;
* waterfalls;
* Core Web Vitals.

Não otimizar prematuramente antes de medir.

---

# 45. Fase 40 — GitHub Actions

## Pipeline

```text id="hjuy0x"
install
 ↓
lint
 ↓
typecheck
 ↓
tests
 ↓
build
```

Adicionar integration/E2E conforme infraestrutura.

---

# 46. Fase 41 — E2E Critical Flows

Automatizar:

## Visitor

```text id="qslcsk"
Landing
→ Ireland
→ Visa
```

## Authenticated User

```text id="rowq1z"
Login
→ Questionnaire
→ Recommendation
→ Process
→ Checklist
```

## Persistence

```text id="ny2rrh"
complete item
→ reload
→ state preserved
```

---

# 47. Fase 42 — Security Review

Antes de produção:

Executar revisão separada focada em:

```text id="pgkw9p"
authentication
authorization
IDOR
SSRF
XSS
CSRF
secrets
AI endpoints
rate limits
logs
privacy
dependencies
```

Resolver findings críticos/altos.

---

# 48. Fase 43 — Production Seed Review

## Objetivo

Revisar manualmente os dados da Irlanda.

Verificar:

* nomes;
* requisitos;
* fontes;
* URLs;
* autoridades;
* categorias;
* wording;
* datas de revisão.

Não publicar seed fictício.

---

# 49. Fase 44 — Production Database

Criar banco de produção.

Configurar:

```text id="olnwgh"
DATABASE_URL
migrations
connection strategy
backup
```

Não compartilhar banco com preview.

---

# 50. Fase 45 — Vercel Production

## Configurar

Projeto Vercel.

Ambientes:

```text id="som878"
Preview
Production
```

Variáveis:

* database;
* Supabase;
* OpenAI;
* application config;
* analytics.

---

# 51. Fase 46 — Production Deploy

Deploy inicial.

Validar:

```text id="72te9v"
homepage
auth
database
questionnaire
recommendation
process
checklist
AI
official sources
```

---

# 52. Fase 47 — Production Smoke Test

Após deploy:

```text id="m18ptq"
open home
 ↓
open Ireland
 ↓
open visa
 ↓
register test account
 ↓
questionnaire
 ↓
recommendation
 ↓
create process
 ↓
complete item
```

Depois excluir conta de teste quando apropriado.

---

# 53. Fase 48 — Portfolio Polish

## Objetivo

Transformar o projeto tecnicamente pronto em um case forte.

README deverá possuir:

```text id="056b4r"
Product overview
Problem
Solution
Screenshots
Architecture
Tech Stack
AI architecture
Security decisions
Testing
Local setup
Deployment
Roadmap
```

---

# 54. Screenshots

Capturar:

```text id="g4v3rf"
Landing
Visa page
Recommendation
Dashboard
Checklist
```

---

# 55. Architecture Diagram

Adicionar diagrama visual mostrando:

```text id="l7j2vk"
User
 ↓
Next.js
 ↓
Application
 ↓
Domain
 ↓
PostgreSQL / OpenAI / Sources
```

---

# 56. Portfolio Case Study

Preparar descrição curta:

```text id="b717bu"
Problema
Decisão técnica
Arquitetura
Desafios
Resultado
```

Esse material poderá ser utilizado no portfólio pessoal.

---

# 57. MVP Definition

Quando as fases críticas estiverem concluídas, o MVP deverá possuir:

```text id="5cic9s"
Landing
Ireland
Visa catalog
Visa details
Official sources

Authentication
Dashboard
Profile questionnaire

Deterministic recommendation

Immigration process
Checklist
Progress persistence

AI explanation
AI checklist personalization

Security
Tests
Responsive UI
Accessibility
Production deploy
```

---

# 58. Não bloquear deploy por features extras

A seguinte lista NÃO deve impedir lançamento:

```text id="as6c9x"
Portugal
Germany
Australia
premium plan
payments
admin dashboard
chatbot
document upload
mobile app
full RAG
notifications
```

O MVP deve ser publicado antes dessas funcionalidades.

---

# 59. Milestone A — Portfolio Preview

Primeiro marco interessante:

```text id="ps3xpj"
Landing
+
Ireland
+
Visa Details
```

Pode gerar Preview Deployment cedo.

Não precisa esperar autenticação e IA.

---

# 60. Milestone B — Full Product Flow

```text id="q9jmhv"
Auth
+
Questionnaire
+
Recommendation
+
Process
+
Checklist
```

Neste momento o produto já funciona de ponta a ponta sem IA.

---

# 61. Milestone C — AI Product

```text id="4qo96n"
AI Explanation
+
AI Checklist Personalization
+
Fallback
```

IA entra somente depois que o produto principal funciona.

---

# 62. Milestone D — Production Ready

```text id="ukdc7p"
Security
Tests
Accessibility
Performance
Privacy
CI
Production Data
```

---

# 63. Milestone E — Portfolio Ready

```text id="1i39z8"
Production URL
+
GitHub
+
README
+
Screenshots
+
Architecture
+
Case Study
```

---

# 64. Exec Plans

Cada fase complexa deverá possuir plano.

Exemplos:

```text id="95e0jc"
docs/exec-plans/
├── bootstrap.md
├── authentication.md
├── recommendation-engine.md
├── checklist-engine.md
├── ai-foundation.md
└── production-deploy.md
```

Não criar necessariamente todos antecipadamente.

Criar conforme a fase iniciar.

---

# 65. Formato de Exec Plan

Cada plano deve conter:

```text id="nbaiho"
Goal

Current State

Scope

Non-goals

Implementation Steps

Files Expected to Change

Data Changes

Security Considerations

Testing

Risks

Definition of Done
```

---

# 66. Uma feature por contexto

Agentes devem evitar trabalhar simultaneamente em features fortemente acopladas.

Exemplo ruim:

```text id="jw585k"
Agent A modifies Profile schema

Agent B simultaneously modifies Profile schema
```

Boa paralelização:

```text id="z96vtc"
Agent A:
Landing UI

Agent B:
Repository tests

Agent C:
Documentation
```

quando mudanças não conflitam.

---

# 67. Estratégia multiagente

Ao longo do desenvolvimento:

```text id="mugds5"
Lead / Planning Agent
       ↓
Implementation Agent
       ↓
Testing Agent
       ↓
Review Agent
       ↓
Security Agent
```

Nem toda tarefa precisa dos cinco.

---

# 68. Tasks pequenas

Uma tarefa ideal deve caber em um objetivo claro.

Exemplo bom:

```text id="qr4r1n"
Implement Country and Visa
Prisma models and seed.
```

Exemplo ruim:

```text id="1yomzg"
Implement the database and
all backend features.
```

---

# 69. Scope Discipline

Se uma tarefa for:

```text id="0ptsh0"
Implement VisaRepository
```

o agente não deve também:

```text id="v4gspc"
redesign landing
upgrade Tailwind
change auth provider
refactor unrelated code
```

---

# 70. Checkpoint Rule

Ao fim de cada fase relevante:

```text id="ru4uei"
review git diff
 ↓
run relevant tests
 ↓
run typecheck
 ↓
run build when appropriate
 ↓
commit
```

Manter checkpoints pequenos.

---

# 71. Commit Strategy

Preferir commits semânticos e pequenos.

Exemplos:

```text id="u9ri6q"
chore: bootstrap nextjs project

feat: add ireland visa catalog

feat: add user authentication

feat: implement recommendation engine

test: add ownership security tests
```

Não é obrigatório seguir Conventional Commits estritamente, mas histórico deve ser compreensível.

---

# 72. Não acumular centenas de mudanças

Evitar trabalhar dias antes de commit/checkpoint.

Agentes funcionam melhor quando estado do projeto é claro.

---

# 73. Branch Strategy

Inicialmente:

```text id="xirkbs"
main
feature/*
```

Pequeno projeto não precisa Git Flow complexo.

---

# 74. Main

`main` deve representar estado:

```text id="u9ftwc"
buildable
tested
deployable
```

---

# 75. Pull Requests

Mesmo trabalhando sozinho, PRs podem ser úteis para:

* Preview Deployments;
* CI;
* Code Review pelo Codex;
* histórico.

Não precisam ser usados para cada alteração mínima.

---

# 76. Review Agent

Antes de integrar feature grande:

```text id="n2yyh4"
Review git diff against main.

Focus on:
correctness
architecture
security
tests
performance
accessibility
```

Corrigir findings reais antes de merge.

---

# 77. Security Agent

Obrigatório especialmente em:

```text id="2uw7qr"
authentication
authorization
URL validation
AI
account deletion
```

---

# 78. Testing Agent

Útil após features como:

```text id="bq9k8h"
recommendation engine
checklist engine
authentication
```

Deve identificar gaps e adicionar testes relevantes.

---

# 79. Documentation Agent

Após decisões importantes:

```text id="8bvxk2"
update architecture
update ADR
update README
```

Não permitir documentação ficar completamente desatualizada.

---

# 80. Ordem de prioridade

Durante o MVP:

```text id="2jb6xt"
Correctness
   ↓
Security
   ↓
User Experience
   ↓
Maintainability
   ↓
Performance
   ↓
Extra Features
```

---

# 81. Produto funcional antes de IA

Regra importante:

```text id="h7klxo"
Recommendation works
without AI.

Checklist works
without AI.
```

Somente depois adicionamos IA.

Isso reduz risco e melhora arquitetura.

---

# 82. Dados reais antes de produção

Durante desenvolvimento podemos usar dados controlados provisórios.

Antes de produção:

toda informação migratória visível deve ser revisada contra fontes oficiais.

---

# 83. Não usar IA como atalho de pesquisa

O Codex poderá ajudar a implementar estrutura.

Mas não deve inventar conteúdo migratório.

Quando dados reais forem necessários:

* pesquisar fontes oficiais;
* registrar fontes;
* revisar manualmente.

---

# 84. Escopo inicial da Irlanda

Prioridade:

```text id="jm03gq"
Work
├── Critical Skills
└── General Employment
```

Depois:

```text id="b4cix3"
Study
Family
```

quando fontes e regras estiverem claras.

---

# 85. Estratégia de conteúdo

Preferir:

```text id="lpc1p4"
2 visas muito bem modelados
```

em vez de:

```text id="ej5eq8"
30 visas superficiais
```

para o lançamento inicial.

---

# 86. Quando publicar

Não esperar produto perfeito.

Publicar quando:

```text id="iph7zi"
core flow works
security baseline exists
data is reviewed
critical tests pass
UI is polished
```

Melhorias continuam após V1.

---

# 87. Pós-lançamento — V1.1

Prioridades possíveis:

* feedback;
* bugs;
* UX;
* SEO;
* performance;
* mais dados da Irlanda;
* analytics review.

---

# 88. Pós-lançamento — V1.2

Adicionar cobertura maior da Irlanda.

Possíveis:

```text id="9xpi52"
more employment routes
study flows
family routes
```

---

# 89. V2 — Segundo país

Adicionar:

```text id="5c7j83"
Portugal
```

ou país decidido posteriormente.

Objetivo principal:

provar que a arquitetura multi-país funciona.

---

# 90. Critério para novo país

Antes de adicionar:

* Irlanda está estável;
* abstrações não estão excessivamente acopladas;
* fontes podem ser modeladas;
* recommendation engine comporta extensão.

---

# 91. V3 — Advanced Intelligence

Somente depois considerar:

* RAG;
* ingestion de documentos;
* busca semântica;
* chat contextual;
* monitoramento automático de mudanças.

---

# 92. V4 — Productization

Possíveis futuras:

* subscription;
* email reminders;
* collaborative process;
* consultants;
* document management.

Não fazem parte do objetivo atual.

---

# 93. Definition of Done de uma fase

Uma fase termina quando:

```text id="i0n11x"
requirements complete
        ↓
relevant tests passing
        ↓
lint passing
        ↓
typecheck passing
        ↓
build passing when relevant
        ↓
diff reviewed
        ↓
documentation updated
```

---

# 94. Definition of Done do MVP

O MVP termina quando:

1. aplicação está em produção;
2. Irlanda está disponível;
3. catálogo possui conteúdo real revisado;
4. autenticação funciona;
5. questionário funciona;
6. recommendation engine funciona;
7. processo pode ser criado;
8. checklist pode ser salvo;
9. progresso persiste;
10. IA personaliza sem controlar fatos oficiais;
11. fallback funciona;
12. fontes estão disponíveis;
13. autorização isola usuários;
14. testes críticos passam;
15. CI passa;
16. mobile funciona;
17. acessibilidade básica foi revisada;
18. privacy/terms existem;
19. README está profissional;
20. URL de produção pode ser colocada no portfólio.

---

# 95. Regra para agentes

Antes de iniciar qualquer fase:

1. ler `AGENTS.md`;
2. ler documentos relacionados;
3. verificar estado atual do repositório;
4. criar Exec Plan quando a fase for complexa;
5. implementar apenas o escopo;
6. adicionar testes;
7. executar verificação;
8. revisar diff;
9. informar riscos;
10. não iniciar automaticamente a próxima fase.

---

# 96. Princípio final

O objetivo não é chegar ao maior número possível de features.

O objetivo é chegar rapidamente a um produto pequeno, confiável e profissional publicado em produção.

O roadmap deve proteger o projeto contra dois riscos:

```text id="so1l1e"
Overengineering
```

e:

```text id="2ds7m7"
AI-generated chaos
```

Cada fase deve aumentar o valor do produto sem destruir a clareza arquitetural construída nas fases anteriores.
