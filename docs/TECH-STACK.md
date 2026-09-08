# Meu Visto Fácil — Technical Stack

## 1. Objetivo técnico

O Meu Visto Fácil será desenvolvido como uma aplicação web Full Stack moderna, utilizando TypeScript de ponta a ponta.

A stack deve atender quatro objetivos principais:

1. proporcionar uma boa experiência ao usuário;
2. permitir desenvolvimento Full Stack real;
3. possuir arquitetura adequada para produção;
4. demonstrar conhecimento técnico relevante em um portfólio profissional.

O projeto deve evitar complexidade desnecessária.

Toda dependência adicionada deverá resolver um problema real da aplicação.

---

# 2. Visão geral da stack

## Aplicação

* Next.js 16
* React
* TypeScript

## Estilização

* Tailwind CSS
* shadcn/ui

## Banco de dados

* PostgreSQL

## ORM

* Prisma ORM

## Autenticação

* Supabase Auth

## Validação

* Zod

## Formulários

* React Hook Form

## Estado

* Server State: recursos nativos do Next.js e TanStack Query quando necessário
* Client State: estado local do React
* Global State: evitar inicialmente

## Inteligência Artificial

* OpenAI API
* Structured Outputs

## Testes

* Vitest
* React Testing Library
* Playwright

## Qualidade

* ESLint
* Prettier
* TypeScript strict mode

## Deploy

* Vercel

## CI

* GitHub Actions

## Observabilidade

* Vercel Analytics
* Vercel Speed Insights
* logs estruturados

---

# 3. Framework — Next.js

## Escolha

Next.js será utilizado como framework principal.

O projeto utilizará:

* App Router;
* React Server Components;
* Client Components quando necessários;
* Route Handlers;
* Server Actions quando fizerem sentido;
* renderização no servidor;
* geração estática quando apropriada.

---

# 4. Por que Next.js em vez de React + Vite?

React + Vite seria tecnicamente suficiente para construir o produto.

Entretanto, o Meu Visto Fácil possui características que se beneficiam de um framework Full Stack.

Entre elas:

* páginas públicas;
* SEO;
* autenticação;
* páginas protegidas;
* acesso ao banco;
* APIs;
* chamadas de IA;
* conteúdo indexável;
* metadata;
* server-side rendering;
* deploy na Vercel.

Com Next.js podemos manter frontend e backend no mesmo projeto sem precisar inicialmente manter dois serviços separados.

Arquitetura:

```text
Browser
   │
   ▼
Next.js
   │
   ├── UI
   │
   ├── Server Components
   │
   ├── Server Actions
   │
   └── Route Handlers
             │
             ├── Database
             ├── AI
             └── External Sources
```

Isso reduz complexidade operacional sem eliminar desenvolvimento backend.

---

# 5. Node.js

O runtime backend principal será Node.js.

As operações executadas no servidor incluirão:

* acesso ao banco;
* autenticação e autorização;
* geração de checklists;
* chamadas à OpenAI;
* validação de URLs;
* processamento das respostas do questionário;
* regras de recomendação;
* tarefas administrativas.

Nenhuma chave privada deverá ser enviada ao navegador.

---

# 6. TypeScript

Todo o projeto será desenvolvido utilizando TypeScript.

Configuração:

```text
strict: true
```

Princípios:

* evitar `any`;
* validar dados externos;
* diferenciar tipos internos de schemas externos;
* inferir tipos de Zod quando apropriado;
* manter tipos próximos de seus respectivos domínios;
* evitar interfaces gigantes compartilhadas globalmente.

Objetivo:

```text
Browser
   ↓
TypeScript
   ↓
Backend
   ↓
Database
```

Uma única linguagem ao longo de praticamente toda a aplicação.

---

# 7. React

React será utilizado para a camada de interface.

Preferências:

* componentes funcionais;
* composição;
* componentes pequenos;
* hooks para comportamento reutilizável;
* Server Components por padrão;
* Client Components apenas quando necessários.

Evitar:

* `useEffect` desnecessário;
* estado duplicado;
* prop drilling excessivo;
* componentes monolíticos;
* lógica de negócio diretamente na UI.

---

# 8. Server Components

No Next.js, componentes deverão permanecer no servidor quando não precisarem de comportamento interativo no navegador.

Exemplos:

* página pública de um visto;
* catálogo;
* conteúdo de fontes;
* dashboard inicial;
* dados do usuário carregados no servidor.

Benefícios:

* menor JavaScript enviado ao browser;
* acesso seguro ao backend;
* melhor performance;
* melhor separação entre servidor e cliente.

---

# 9. Client Components

Client Components serão utilizados quando houver necessidade de:

* eventos;
* estado local;
* formulários interativos;
* drag and drop;
* componentes dinâmicos;
* APIs do navegador.

Exemplo:

```text
VisaPage                 Server Component
   │
   ├── VisaInformation   Server Component
   │
   ├── OfficialSources   Server Component
   │
   └── Checklist         Client Component
```

Não utilizar `"use client"` como padrão.

---

# 10. API

O projeto poderá utilizar Route Handlers do Next.js.

Estrutura conceitual:

```text
app/
└── api/
    ├── profile/
    ├── recommendations/
    ├── checklists/
    └── sources/
```

Entretanto, Route Handlers não deverão conter diretamente toda a lógica do sistema.

Exemplo correto:

```text
Route Handler
      ↓
Service
      ↓
Domain
      ↓
Repository
      ↓
Database
```

Exemplo a evitar:

```text
route.ts

300 linhas contendo:
auth
validation
database
OpenAI
business rules
error handling
```

---

# 11. Organização por domínio

O código deverá preferencialmente ser organizado por domínio/feature, e não apenas por tipo de arquivo.

Estrutura conceitual:

```text
src/
├── app/
│
├── components/
│   └── ui/
│
├── features/
│   │
│   ├── auth/
│   ├── countries/
│   ├── visas/
│   ├── profile/
│   ├── recommendations/
│   ├── checklists/
│   └── sources/
│
├── lib/
│   ├── db/
│   ├── ai/
│   ├── auth/
│   ├── validation/
│   └── observability/
│
└── shared/
```

Exemplo:

```text
features/
└── checklists/
    ├── components/
    ├── schemas/
    ├── services/
    ├── repositories/
    ├── types/
    └── tests/
```

A estrutura definitiva será detalhada no `ARCHITECTURE.md`.

---

# 12. Banco de dados — PostgreSQL

O banco principal será PostgreSQL.

Motivos:

* modelo relacional adequado ao domínio;
* maturidade;
* bom suporte a transações;
* queries poderosas;
* fácil expansão;
* excelente integração com ferramentas modernas.

Entidades como:

```text
User
Country
Visa
VisaRequirement
OfficialSource
UserProfile
ImmigrationProcess
Checklist
ChecklistItem
```

possuem relações naturais entre si.

PostgreSQL é mais adequado para esse domínio do que utilizar um banco exclusivamente baseado em documentos.

---

# 13. Provider do PostgreSQL

O projeto deverá utilizar PostgreSQL gerenciado.

Inicialmente, a preferência será utilizar o PostgreSQL disponibilizado por um provedor serverless compatível com Vercel.

Possibilidades incluem:

* Supabase Postgres;
* Prisma Postgres;
* Neon.

A escolha final deverá considerar:

* free tier;
* integração com Vercel;
* connection pooling;
* observabilidade;
* experiência local;
* facilidade de backup.

A aplicação não deverá depender de funcionalidades proprietárias desnecessárias do provider.

Objetivo:

permitir trocar o provedor de PostgreSQL futuramente com impacto mínimo.

---

# 14. Prisma ORM

Prisma será utilizado como ORM.

Responsabilidades:

* schema;
* migrations;
* acesso tipado ao banco;
* relações;
* queries;
* desenvolvimento local.

Fluxo:

```text
Application
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
```

Componentes de UI não deverão utilizar Prisma diretamente.

---

# 15. Repository Layer

O acesso ao banco deverá ser isolado quando isso trouxer benefício arquitetural.

Exemplo:

```ts
visaRepository.findBySlug()
checklistRepository.findByUserId()
processRepository.create()
```

Isso reduz acoplamento entre regras de negócio e banco.

Não é necessário criar repositories artificiais para queries extremamente simples.

A abstração deve existir quando melhorar clareza ou testabilidade.

---

# 16. Autenticação — Supabase Auth

A autenticação será inicialmente realizada utilizando Supabase Auth.

Funcionalidades iniciais:

* cadastro com e-mail;
* login;
* logout;
* confirmação de e-mail quando aplicável;
* recuperação de senha;
* sessões;
* proteção de rotas.

Posteriormente poderão ser adicionados:

* Google;
* GitHub;
* outros providers.

A autenticação será separada dos dados de domínio da aplicação.

---

# 17. Usuário e autenticação

O provider de autenticação representa identidade.

O banco da aplicação representa o domínio.

Conceitualmente:

```text
Supabase Auth

auth.users
     │
     │ id
     ▼

Application Database

profiles
immigration_processes
checklists
```

Não espalhar lógica específica do provider de autenticação por toda a aplicação.

Deverá existir uma camada própria em:

```text
lib/auth/
```

---

# 18. Autorização

Autenticação responde:

> Quem é o usuário?

Autorização responde:

> O usuário pode acessar este recurso?

Toda operação envolvendo dados privados deverá validar propriedade no servidor.

Por exemplo:

```text
/checklists/:id
```

não poderá simplesmente buscar:

```text
WHERE id = checklistId
```

Deverá garantir também:

```text
WHERE
id = checklistId
AND
userId = currentUser.id
```

Nunca confiar apenas na interface para controle de acesso.

---

# 19. Validação — Zod

Zod será utilizado para validação de dados.

Áreas:

* formulários;
* Route Handlers;
* respostas de IA;
* environment variables;
* parâmetros;
* dados externos.

Princípio:

```text
External Data
     ↓
Zod
     ↓
Validated Data
     ↓
Application
```

Nenhum dado externo deve ser considerado confiável automaticamente.

---

# 20. Formulários — React Hook Form

Formulários interativos utilizarão React Hook Form quando a complexidade justificar.

Integração:

```text
React Hook Form
       +
      Zod
```

Será particularmente útil para:

* cadastro;
* login;
* perfil migratório;
* questionários;
* edição de processos.

---

# 21. Estado

Evitar adicionar bibliotecas de estado global inicialmente.

Prioridade:

```text
Server state
      ↓
Server Components / Query

URL state
      ↓
searchParams

Form state
      ↓
React Hook Form

Local UI state
      ↓
useState
```

Somente utilizar uma solução global como Zustand se surgir uma necessidade concreta.

Não adicionar Redux no MVP.

---

# 22. TanStack Query

TanStack Query poderá ser utilizado em partes altamente interativas que necessitem:

* cache client-side;
* mutations;
* optimistic updates;
* polling;
* re-fetch;
* sincronização frequente com servidor.

Não deverá ser automaticamente utilizado para toda requisição.

Server Components deverão cuidar de grande parte da leitura inicial de dados.

---

# 23. Interface — Tailwind CSS

Tailwind CSS será utilizado para estilização.

Objetivos:

* velocidade de desenvolvimento;
* consistência;
* responsividade;
* design tokens;
* facilidade de manutenção.

Evitar valores arbitrários repetidos.

Preferir um design system consistente.

---

# 24. shadcn/ui

shadcn/ui será utilizado como fundação para componentes reutilizáveis.

Exemplos:

* Button;
* Input;
* Dialog;
* Dropdown;
* Tabs;
* Card;
* Tooltip;
* Sheet;
* Select;
* Progress.

O objetivo não é fazer a aplicação parecer um template padrão de shadcn.

Os componentes deverão ser customizados de acordo com a identidade visual do Meu Visto Fácil.

---

# 25. Ícones

Preferência:

Lucide Icons.

Evitar múltiplas bibliotecas de ícones.

---

# 26. Inteligência Artificial

A primeira implementação utilizará OpenAI API.

A camada de IA não deverá estar diretamente acoplada aos componentes.

Estrutura:

```text
lib/
└── ai/
    ├── client
    ├── prompts
    ├── schemas
    ├── services
    └── safeguards
```

---

# 27. Structured Outputs

Respostas utilizadas internamente pela aplicação deverão utilizar schemas estruturados sempre que possível.

Exemplo conceitual:

```json
{
  "summary": "...",
  "recommendations": [],
  "checklistItems": []
}
```

e não depender de parsing de texto livre como:

```text
1 - documento
2 - documento
3 - documento
```

A resposta deverá ser validada antes de entrar no domínio da aplicação.

Fluxo:

```text
Application data
      ↓
Prompt
      ↓
OpenAI
      ↓
Structured Output
      ↓
Schema validation
      ↓
Business validation
      ↓
Application
```

---

# 28. IA não será fonte de verdade

Regra arquitetural fundamental:

```text
Official structured data
          ↓
        Truth

AI
          ↓
Explanation / Personalization
```

A IA poderá:

* explicar;
* resumir;
* organizar;
* personalizar.

A IA não deverá decidir livremente fatos legais.

---

# 29. Fontes oficiais

Será criada uma camada específica para fontes.

Conceitualmente:

```text
OfficialSource
├── country
├── authority
├── url
├── domain
├── title
├── lastVerifiedAt
└── status
```

Será mantida uma allowlist de hosts oficiais.

Exemplo conceitual:

```text
enterprise.gov.ie
irishimmigration.ie
gov.ie
```

A lista definitiva deverá ser validada durante o desenvolvimento.

---

# 30. Validação de URLs

A validação de links deverá acontecer no backend.

Fluxo conceitual:

```text
Candidate URL
     ↓
Parse URL
     ↓
Validate protocol
     ↓
Check official-domain allowlist
     ↓
Perform safe HTTP validation
     ↓
Handle redirect
     ↓
Validate final host
     ↓
Store verification result
```

Requisições deverão possuir:

* timeout;
* limite de redirects;
* protocolos permitidos;
* proteção contra SSRF.

URLs fornecidas pelo usuário nunca deverão ser requisitadas livremente pelo servidor.

---

# 31. Testes — visão geral

A estratégia utilizará três níveis principais.

## Unit

Vitest.

## Component

React Testing Library.

## End-to-End

Playwright.

---

# 32. Vitest

Vitest será utilizado para testar principalmente:

* regras de negócio;
* validações;
* funções;
* recomendação;
* transformação de dados;
* serviços;
* tratamento de IA.

---

# 33. React Testing Library

Utilizada para componentes interativos.

Prioridade em comportamento percebido pelo usuário.

Evitar testes excessivamente acoplados à implementação interna.

---

# 34. Playwright

Playwright será utilizado para fluxos críticos.

Exemplos:

```text
Cadastro
   ↓
Login
   ↓
Questionário
   ↓
Recomendação
   ↓
Checklist
   ↓
Salvar progresso
```

O objetivo não será testar toda combinação possível via E2E.

Utilizar E2E para jornadas críticas.

---

# 35. Mock de IA

Testes automatizados não deverão depender regularmente de chamadas reais à OpenAI.

Deverá existir uma abstração:

```ts
AIProvider
```

permitindo:

```text
Production
   ↓
OpenAIProvider

Tests
   ↓
MockAIProvider
```

Isso torna os testes:

* rápidos;
* previsíveis;
* baratos;
* reprodutíveis.

---

# 36. ESLint

ESLint será utilizado para análise estática.

Deverá verificar:

* padrões de React;
* TypeScript;
* imports;
* possíveis bugs;
* práticas inseguras quando aplicável.

---

# 37. Prettier

Prettier ficará responsável apenas por formatação.

ESLint ficará responsável por qualidade/regras.

Evitar conflitos de responsabilidade entre os dois.

---

# 38. Package manager

Preferência inicial:

```text
pnpm
```

Motivos:

* rápido;
* eficiente;
* lockfile consistente;
* excelente suporte ao ecossistema Node.

O projeto deverá versionar:

```text
pnpm-lock.yaml
```

---

# 39. Versão do Node

Utilizar uma versão LTS moderna do Node suportada pela Vercel e pelas dependências do projeto.

A versão deverá ser explicitamente definida no projeto.

Exemplo:

```text
.nvmrc
```

e/ou:

```json
"engines": {
  "node": "..."
}
```

Não depender silenciosamente da versão padrão da máquina ou da plataforma.

---

# 40. Environment Variables

Variáveis deverão ser validadas na inicialização da aplicação.

Categorias:

```text
Database
Auth
OpenAI
Application
Observability
```

Nunca versionar:

```text
.env
.env.local
```

O projeto deverá fornecer:

```text
.env.example
```

sem valores secretos.

---

# 41. Deploy — Vercel

A aplicação será implantada na Vercel.

Ambientes:

```text
Local
Preview
Production
```

Pull Requests poderão gerar Preview Deployments.

Branch principal:

```text
main
    ↓
Production
```

---

# 42. GitHub

O código será hospedado no GitHub.

O repositório deverá possuir:

* README profissional;
* documentação;
* arquitetura;
* screenshots;
* instruções para rodar;
* testes;
* licença quando definida;
* histórico de commits organizado.

---

# 43. CI — GitHub Actions

Pull Requests deverão executar:

```text
Install
   ↓
Lint
   ↓
Typecheck
   ↓
Unit Tests
   ↓
Build
```

Quando adequado:

```text
E2E
```

Um PR com validações críticas falhando não deverá ser considerado pronto.

---

# 44. Scripts

O projeto deverá possuir scripts consistentes.

Exemplo conceitual:

```json
{
  "dev": "...",
  "build": "...",
  "start": "...",
  "lint": "...",
  "typecheck": "...",
  "test": "...",
  "test:watch": "...",
  "test:e2e": "...",
  "format": "...",
  "format:check": "..."
}
```

A definição concreta dependerá das versões instaladas.

---

# 45. Observabilidade

Inicialmente:

* logs;
* Vercel Analytics;
* Vercel Speed Insights.

Posteriormente poderá ser considerado:

* Sentry;
* tracing;
* métricas customizadas.

Erros importantes de backend deverão gerar logs contextualizados sem expor dados pessoais ou secrets.

---

# 46. Analytics

Analytics deverá servir para compreender a utilização da aplicação.

Possíveis eventos:

```text
questionnaire_started
questionnaire_completed
visa_viewed
recommendation_generated
checklist_created
checklist_item_completed
official_source_opened
```

Não coletar informações pessoais desnecessárias.

---

# 47. SEO

Páginas públicas deverão possuir boa indexação.

Exemplos:

```text
/ireland
/ireland/work
/ireland/visas/critical-skills-employment-permit
```

Cada página deverá possuir:

* title;
* description;
* canonical quando necessário;
* metadata social;
* estrutura semântica.

Páginas privadas:

```text
/dashboard
/processes/*
```

não deverão ser indexadas.

---

# 48. Performance

Prioridades:

* evitar JavaScript client-side desnecessário;
* otimização de imagens;
* lazy loading quando apropriado;
* caching consciente;
* queries eficientes;
* evitar waterfalls;
* monitorar Core Web Vitals.

Performance deverá ser medida, não apenas presumida.

---

# 49. Segurança

Princípios básicos:

* secrets apenas no servidor;
* validação de input;
* autorização server-side;
* queries parametrizadas;
* proteção contra SSRF;
* tratamento seguro de URLs;
* escape adequado de conteúdo;
* headers de segurança;
* rate limiting para endpoints sensíveis;
* proteção de endpoints de IA;
* limites de payload;
* logs sem dados sensíveis.

Detalhes serão definidos em `SECURITY.md`.

---

# 50. Rate limiting

Endpoints que gerem custo ou possam sofrer abuso deverão possuir proteção.

Especialmente:

```text
AI generation
authentication
questionnaire analysis
URL validation
```

A estratégia específica será definida posteriormente.

---

# 51. Arquitetura de provider

Serviços externos importantes deverão possuir limites claros.

Exemplo:

```ts
interface AIProvider {}
interface AuthProvider {}
```

Não é necessário criar abstrações genéricas para tudo.

O objetivo é reduzir acoplamento justamente nas integrações que possuem maior probabilidade de troca.

---

# 52. Dependências

Regra:

> Não instalar uma biblioteca para resolver algo trivial que pode ser feito de maneira clara utilizando recursos existentes.

Antes de adicionar dependência, avaliar:

* necessidade;
* manutenção;
* bundle size;
* segurança;
* frequência de atualização;
* compatibilidade;
* benefício real.

---

# 53. Monorepo

O MVP NÃO utilizará monorepo.

Estrutura:

```text
meu-visto-facil/
```

com uma única aplicação Next.js.

Não haverá inicialmente:

```text
apps/web
apps/api
packages/shared
```

Não existe necessidade suficiente para justificar essa complexidade.

Se futuramente surgir:

* aplicativo mobile;
* backend independente;
* biblioteca compartilhada;

a decisão poderá ser revista.

---

# 54. Backend separado

O MVP NÃO utilizará inicialmente um servidor Express/Nest separado.

Isso não significa ausência de backend.

O backend estará implementado utilizando o runtime Node.js através do Next.js.

Exemplo:

```text
Next.js Application
│
├── Frontend
│
└── Backend
    ├── authentication
    ├── domain services
    ├── repositories
    ├── database
    ├── AI
    └── integrations
```

Caso a evolução do produto exija processamento independente, filas ou outros serviços, a arquitetura poderá ser separada futuramente.

---

# 55. Decisão arquitetural principal

Para o MVP:

```text
                 Vercel
                    │
                    ▼
              Next.js App
              /         \
             /           \
       Frontend          Backend
                          │
          ┌───────────────┼──────────────┐
          ▼               ▼              ▼
     PostgreSQL        OpenAI       Supabase Auth
          │
          ▼
       Prisma
```

---

# 56. Princípios técnicos

## Simplicidade

Resolver o problema com a menor complexidade razoável.

## Type Safety

TypeScript de ponta a ponta.

## Server First

Executar no servidor o que não precisa estar no navegador.

## Secure by Default

Nunca confiar no cliente para regras de autorização ou integridade.

## Testable

Regras de negócio devem ser testáveis sem depender de UI ou serviços externos.

## Observable

Erros relevantes precisam ser identificáveis.

## Replaceable Integrations

Integrações externas importantes não devem contaminar todo o domínio.

## AI as a Tool

IA complementa o domínio; não controla o domínio.

---

# 57. Stack final resumida

```text
Meu Visto Fácil
│
├── Framework
│   └── Next.js
│
├── UI
│   ├── React
│   ├── TypeScript
│   ├── Tailwind
│   ├── shadcn/ui
│   └── Lucide
│
├── Forms
│   ├── React Hook Form
│   └── Zod
│
├── Backend
│   ├── Next.js
│   └── Node.js
│
├── Database
│   ├── PostgreSQL
│   └── Prisma
│
├── Auth
│   └── Supabase Auth
│
├── AI
│   ├── OpenAI
│   ├── Structured Outputs
│   └── Zod validation
│
├── Testing
│   ├── Vitest
│   ├── React Testing Library
│   └── Playwright
│
├── Quality
│   ├── ESLint
│   ├── Prettier
│   └── TypeScript strict
│
├── CI
│   └── GitHub Actions
│
└── Deploy
    └── Vercel
```

---

# 58. Regra final

Tecnologias não devem ser utilizadas apenas para aumentar a lista de ferramentas do projeto.

Cada tecnologia deverá possuir uma responsabilidade clara.

O objetivo do Meu Visto Fácil não é demonstrar a maior quantidade possível de ferramentas.

O objetivo é demonstrar que decisões técnicas apropriadas foram tomadas para construir um produto Full Stack confiável, testável e sustentável.
