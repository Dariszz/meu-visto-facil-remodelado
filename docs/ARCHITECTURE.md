# Meu Visto Fácil — Architecture

## 1. Objetivo

Este documento define a arquitetura técnica do Meu Visto Fácil.

Ele deve servir como referência para:

* desenvolvimento de novas funcionalidades;
* organização do código;
* decisões arquiteturais;
* revisão de código;
* criação de testes;
* trabalho realizado por agentes de IA;
* manutenção futura.

A arquitetura deve priorizar:

* simplicidade;
* separação clara de responsabilidades;
* segurança;
* testabilidade;
* escalabilidade gradual;
* legibilidade;
* facilidade de manutenção.

O projeto não deve utilizar complexidade arquitetural apenas por preferência técnica.

---

# 2. Visão geral

O Meu Visto Fácil será inicialmente uma aplicação Full Stack monolítica baseada em Next.js.

O termo monolítico aqui significa que frontend e backend estarão no mesmo projeto e serão implantados juntos.

Isso não significa que todas as responsabilidades ficarão misturadas.

A aplicação deverá possuir separação lógica clara entre:

* apresentação;
* regras de negócio;
* acesso a dados;
* autenticação;
* inteligência artificial;
* integrações externas.

Arquitetura geral:

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Next.js       │
                         │                     │
                         │   App Router / UI   │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Server Components   Server Actions    Route Handlers
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    ▼
                             Application Layer
                                    │
                                    ▼
                               Domain Layer
                                    │
                  ┌─────────────────┼──────────────────┐
                  ▼                 ▼                  ▼
            Repositories         AI Services      Integrations
                  │                 │                  │
                  ▼                 ▼                  ▼
             PostgreSQL         OpenAI          Official Sources
                  │
                  ▼
                Prisma
```

---

# 3. Princípio fundamental

A interface não deve conter regras de negócio importantes.

Fluxo preferencial:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

A UI é responsável principalmente por:

* receber interação;
* exibir informação;
* comunicar estados;
* chamar operações.

O domínio é responsável por:

* regras;
* decisões;
* validações de negócio;
* transformação de dados;
* consistência.

---

# 4. Estrutura de diretórios

Estrutura inicial recomendada:

```text
src/
│
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── countries/
│   ├── visas/
│   ├── profile/
│   ├── recommendations/
│   ├── processes/
│   ├── checklists/
│   └── sources/
│
├── lib/
│   ├── ai/
│   ├── auth/
│   ├── db/
│   ├── env/
│   ├── errors/
│   ├── http/
│   ├── observability/
│   ├── security/
│   └── utils/
│
├── shared/
│   ├── constants/
│   ├── schemas/
│   └── types/
│
└── test/
    ├── factories/
    ├── fixtures/
    ├── mocks/
    └── setup/
```

Essa estrutura poderá evoluir conforme necessidades reais surgirem.

Mudanças estruturais relevantes devem ser documentadas.

---

# 5. App Router

A pasta:

```text
src/app/
```

é responsável pela estrutura de rotas Next.js.

Ela não deve se transformar no local onde toda lógica da aplicação é implementada.

Exemplo:

```text
app/
└── (public)/
    └── ireland/
        └── visas/
            └── [slug]/
                └── page.tsx
```

`page.tsx` deve atuar principalmente como composição.

Exemplo:

```tsx
export default async function VisaPage({ params }) {
  const visa = await getVisaDetails(params.slug)

  return <VisaDetailsPage visa={visa} />
}
```

Evitar colocar dentro de `page.tsx`:

* queries Prisma complexas;
* chamadas à OpenAI;
* lógica de recomendação;
* regras de autorização;
* transformação extensa de dados.

---

# 6. Route Groups

Route Groups poderão ser utilizados para organizar áreas sem alterar URLs.

Exemplo:

```text
app/
├── (public)/
├── (auth)/
└── (dashboard)/
```

Possível estrutura:

```text
(public)
├── page.tsx
├── ireland/
├── about/
└── privacy/

(auth)
├── login/
├── register/
└── forgot-password/

(dashboard)
├── dashboard/
├── profile/
├── processes/
└── settings/
```

---

# 7. Server Components por padrão

Componentes serão Server Components por padrão.

Adicionar:

```text
"use client"
```

somente quando existir necessidade concreta.

Exemplos que normalmente devem permanecer no servidor:

* páginas informativas;
* catálogo de vistos;
* detalhes de visto;
* fontes;
* dashboard com leitura inicial;
* metadata;
* páginas SEO.

---

# 8. Client Components

Client Components serão utilizados para comportamento que dependa do navegador.

Exemplos:

* formulário;
* modal;
* dropdown;
* filtros interativos;
* botão de marcar checklist;
* progresso animado;
* estados temporários de interface.

O Client Component deve ser colocado o mais baixo possível na árvore.

Preferir:

```text
VisaPage             Server
│
├── VisaHeader       Server
├── VisaDetails      Server
├── Sources          Server
└── ProgressControl  Client
```

em vez de:

```text
VisaPage             Client
│
├── tudo client-side
```

---

# 9. Feature Modules

Funcionalidades relevantes serão organizadas por domínio.

Exemplo:

```text
features/
└── checklists/
    ├── components/
    ├── application/
    ├── domain/
    ├── repositories/
    ├── schemas/
    ├── types/
    └── tests/
```

Nem toda feature precisa possuir todas essas pastas.

Criar apenas as camadas necessárias.

Uma feature simples poderá ser:

```text
features/
└── countries/
    ├── components/
    ├── queries.ts
    └── types.ts
```

Evitar estruturas vazias apenas para seguir um padrão.

---

# 10. Domain Layer

O domínio contém regras que representam o comportamento do produto.

Exemplos:

```text
recommendVisaOptions()
calculateChecklistProgress()
determineRequirementStatus()
validateOfficialSource()
canUserAccessProcess()
```

O domínio deve preferencialmente não depender de:

* React;
* Next.js;
* Prisma;
* OpenAI SDK;
* Supabase SDK.

Ideal:

```ts
calculateProgress(items)
```

Não ideal:

```ts
calculateProgress(prisma, request, cookies, openai)
```

Isso permite testes simples e independentes.

---

# 11. Application Layer

A camada Application coordena operações.

Exemplo:

```text
CreateChecklist
```

poderá:

1. validar usuário;
2. carregar o visto;
3. carregar perfil;
4. aplicar regras;
5. obter conteúdo complementar da IA;
6. validar resposta;
7. persistir checklist;
8. retornar resultado.

A camada Application coordena.

Ela não deve necessariamente conter todas as regras internamente.

Exemplo:

```text
Application Service
       │
       ├── Domain Rules
       ├── Repository
       ├── AI Provider
       └── Source Validator
```

---

# 12. Exemplo de fluxo de criação de checklist

```text
User
 ↓
Create checklist
 ↓
Server Action / Route Handler
 ↓
Authentication
 ↓
Input validation
 ↓
CreateChecklistService
 ↓
Load:
 ├── User Profile
 ├── Visa
 └── Requirements
 ↓
Domain rules
 ↓
AI enrichment
 ↓
Structured validation
 ↓
Business validation
 ↓
Persist checklist
 ↓
Return result
 ↓
UI
```

---

# 13. Repositories

Repositories isolam persistência quando isso melhora clareza ou testabilidade.

Exemplo:

```ts
interface ChecklistRepository {
  findById(id: string): Promise<Checklist | null>
  findByUserId(userId: string): Promise<Checklist[]>
  create(input: CreateChecklistInput): Promise<Checklist>
  updateProgress(...): Promise<void>
}
```

Implementação:

```text
PrismaChecklistRepository
```

Isso permite que regras importantes não dependam diretamente de Prisma.

---

# 14. Prisma

Prisma deverá ficar restrito à camada de infraestrutura.

Preferencialmente:

```text
lib/db/
```

e implementações de repositories.

Evitar:

```tsx
export default async function Component() {
  const users = await prisma.user.findMany()
}
```

quando essa query representar uma operação de domínio relevante.

Queries simples e puramente de leitura poderão ser feitas de forma mais direta quando a abstração adicional não trouxer benefício.

---

# 15. Database Client

Deverá existir uma única configuração central para Prisma.

Exemplo:

```text
lib/db/client.ts
```

Responsabilidades:

* inicialização;
* configuração;
* evitar múltiplas instâncias desnecessárias;
* ambiente local;
* logging adequado.

---

# 16. Data Transfer

Objetos vindos do banco não deverão ser enviados cegamente ao navegador.

Antes de retornar dados ao cliente:

* remover campos internos;
* remover dados sensíveis;
* transformar tipos não serializáveis;
* retornar apenas o necessário.

Exemplo:

```text
Database Model
      ↓
Mapper
      ↓
DTO
      ↓
Client
```

---

# 17. DTOs

DTOs poderão ser utilizados nas fronteiras da aplicação.

Exemplo:

```ts
type VisaSummaryDTO = {
  slug: string
  name: string
  description: string
  category: string
}
```

DTO não deve necessariamente ser o mesmo tipo do Prisma.

---

# 18. Schemas

Zod schemas deverão existir próximos da responsabilidade relevante.

Exemplo:

```text
features/
└── profile/
    └── schemas/
        ├── create-profile.schema.ts
        └── update-profile.schema.ts
```

Schemas realmente globais poderão ficar em:

```text
shared/schemas/
```

---

# 19. Server Actions

Server Actions poderão ser utilizadas para operações originadas diretamente da interface.

Exemplos:

* marcar checklist;
* salvar perfil;
* criar processo;
* alterar configuração.

Server Actions deverão:

1. autenticar;
2. validar;
3. autorizar;
4. chamar Application Service;
5. retornar resultado apropriado.

Não deverão conter toda lógica de negócio.

---

# 20. Route Handlers

Route Handlers serão preferidos quando existir necessidade de interface HTTP explícita.

Exemplos:

* webhooks;
* callbacks;
* endpoints públicos;
* integrações;
* endpoints consumidos fora do frontend Next.js;
* streaming;
* APIs que precisam de semântica HTTP específica.

Estrutura:

```text
app/api/
```

Route Handler:

```text
HTTP
 ↓
Validation
 ↓
Authentication / Authorization
 ↓
Application Service
 ↓
Response Mapping
```

---

# 21. API Response Pattern

APIs deverão possuir formato previsível.

Sucesso:

```json
{
  "data": {}
}
```

Erro:

```json
{
  "error": {
    "code": "CHECKLIST_NOT_FOUND",
    "message": "Checklist not found."
  }
}
```

Detalhes internos nunca devem ser retornados ao usuário.

---

# 22. Error Handling

O projeto deverá possuir erros de domínio e aplicação consistentes.

Possíveis categorias:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
ExternalServiceError
RateLimitError
```

Evitar:

```ts
throw new Error("deu ruim")
```

em lógica de aplicação.

---

# 23. Error Codes

Erros importantes devem possuir códigos estáveis.

Exemplos:

```text
AUTH_REQUIRED
ACCESS_DENIED
VISA_NOT_FOUND
PROCESS_NOT_FOUND
INVALID_PROFILE
AI_RESPONSE_INVALID
OFFICIAL_SOURCE_UNAVAILABLE
RATE_LIMIT_EXCEEDED
```

Isso facilita:

* UI;
* logs;
* debugging;
* testes;
* analytics.

---

# 24. Logging

Logs serão estruturados.

Evitar:

```ts
console.log("erro aqui", user)
```

Preferir conceitualmente:

```json
{
  "level": "error",
  "event": "checklist_generation_failed",
  "requestId": "...",
  "processId": "...",
  "errorCode": "AI_RESPONSE_INVALID"
}
```

Nunca registrar:

* senha;
* tokens;
* secrets;
* documentos pessoais;
* conteúdo sensível desnecessário.

---

# 25. Request ID

Requisições importantes poderão possuir identificador para rastreamento.

Exemplo:

```text
requestId
```

Isso ajuda a correlacionar:

```text
HTTP Request
   ↓
Application Service
   ↓
AI
   ↓
Database
   ↓
Logs
```

---

# 26. Autenticação

Supabase Auth será responsável pela identidade.

Fluxo conceitual:

```text
Browser
 ↓
Supabase Auth
 ↓
Session Cookie
 ↓
Next.js Server
 ↓
Current User
```

A sessão deve ser validada no servidor quando necessário.

---

# 27. Auth Adapter

Código específico do Supabase ficará concentrado em:

```text
lib/auth/
```

Exemplo:

```text
lib/auth/
├── client.ts
├── server.ts
├── get-current-user.ts
├── require-user.ts
└── types.ts
```

Features não devem depender diretamente do SDK do Supabase quando isso puder ser evitado.

---

# 28. Require User

Operações privadas deverão utilizar helper comum.

Conceitualmente:

```ts
const user = await requireUser()
```

Se não houver sessão válida:

```text
AuthenticationError
```

Evitar implementar verificação de sessão de maneiras diferentes em cada feature.

---

# 29. Autorização

Autorização sempre acontece no servidor.

Exemplo:

Usuário solicita:

```text
/processes/abc
```

A aplicação deverá verificar:

```text
process.id = abc
AND
process.userId = currentUser.id
```

O ID vindo da URL nunca concede acesso automaticamente.

---

# 30. Middleware

Middleware deverá ser utilizado com moderação.

Pode ser útil para:

* redirects simples;
* proteção superficial de áreas;
* internacionalização futura;
* headers.

Não deverá ser considerado a única camada de autorização.

Mesmo que middleware proteja:

```text
/dashboard
```

as operações no backend ainda devem validar o usuário.

---

# 31. Inteligência Artificial

Toda interação com IA ficará atrás de uma camada própria.

```text
lib/ai/
```

Estrutura conceitual:

```text
ai/
├── providers/
├── prompts/
├── schemas/
├── services/
├── safeguards/
└── types/
```

---

# 32. AI Provider

O domínio não deve depender diretamente do SDK da OpenAI.

Interface conceitual:

```ts
interface AIProvider {
  generateStructured<T>(
    input: AIRequest<T>
  ): Promise<T>
}
```

Implementação:

```text
OpenAIProvider
```

Testes:

```text
FakeAIProvider
```

---

# 33. Prompts

Prompts não deverão ser espalhados em:

```text
page.tsx
route.ts
component.tsx
```

Eles ficarão em:

```text
lib/ai/prompts/
```

ou dentro da feature relevante.

Exemplo:

```text
features/checklists/ai/
```

quando o prompt for altamente específico daquele domínio.

---

# 34. Versionamento de prompts

Prompts importantes poderão possuir versão.

Exemplo:

```text
checklist-generation.v1.ts
```

ou metadata:

```text
promptVersion: "1.0"
```

Isso facilitará:

* debugging;
* comparação;
* testes;
* evolução;
* rastreabilidade.

---

# 35. Structured Outputs

A IA deverá retornar estruturas tipadas.

Exemplo:

```ts
const ChecklistAIResponseSchema = z.object({
  summary: z.string(),
  items: z.array(...)
})
```

Fluxo:

```text
OpenAI
 ↓
Structured Output
 ↓
Schema Validation
 ↓
Domain Validation
 ↓
Use
```

Não confiar apenas no fato de o modelo ter sido instruído corretamente.

---

# 36. Contexto fornecido à IA

A IA deverá receber dados relevantes já coletados pela aplicação.

Exemplo:

```text
User profile
+
Visa structured data
+
Official requirements
+
Allowed sources
```

Não pedir:

> Pesquise na internet e diga os requisitos atuais.

Preferir:

> Com base nestes requisitos oficiais fornecidos pela aplicação, gere uma explicação personalizada.

---

# 37. Fontes oficiais

Fontes serão parte do domínio.

A arquitetura deve garantir:

```text
Official Data
    │
    ├── Source
    ├── Authority
    ├── URL
    ├── Verified At
    └── Status
```

Informações críticas devem ter relação com uma fonte.

---

# 38. Source Registry

Poderá existir um registro de domínios permitidos.

Exemplo conceitual:

```text
sources/
└── ireland.ts
```

contendo hosts oficialmente autorizados.

Não depender de listas geradas dinamicamente pela IA.

---

# 39. URL Validation

Validação de URL acontecerá somente no servidor.

Fluxo:

```text
URL
 ↓
Parse
 ↓
Protocol validation
 ↓
Hostname allowlist
 ↓
DNS / SSRF protections
 ↓
Request
 ↓
Redirect
 ↓
Final hostname validation
 ↓
Status result
```

A segurança dessa funcionalidade será detalhada em `SECURITY.md`.

---

# 40. Recommendation Engine

A recomendação de vistos não deverá depender exclusivamente de IA.

Arquitetura:

```text
Profile
 ↓
Deterministic Rules
 ↓
Candidate Visas
 ↓
Ranking / Compatibility
 ↓
AI Explanation
```

Exemplo:

```text
Rule Engine:
Critical Skills
possible = true

AI:
"Esta opção apareceu porque..."
```

A IA explica.

As regras determinísticas controlam a elegibilidade aproximada.

---

# 41. Regras de recomendação

Regras deverão ser testáveis.

Exemplo conceitual:

```ts
evaluateCriticalSkills(profile, visa)
```

Retorno:

```ts
{
  compatibility: "high",
  matchedCriteria: [],
  missingCriteria: [],
  blockers: []
}
```

---

# 42. Não usar "porcentagem mágica"

Evitar apresentar:

```text
87% compatível
```

se esse número não possuir modelo real e explicável.

Preferir:

```text
Alta compatibilidade
Média compatibilidade
Baixa compatibilidade
```

com explicação clara.

Se futuramente existir scoring formal, ele deverá ser documentado.

---

# 43. Checklist Engine

O checklist combinará:

```text
Base Requirements
+
Conditional Requirements
+
Profile
+
AI Personalization
```

Exemplo:

```text
Base:
Passaporte

Conditional:
Comprovante de casamento

Rule:
Somente se married = true
```

A IA poderá melhorar:

* explicação;
* contexto;
* ordem;
* observações.

A IA não deverá remover requisitos obrigatórios.

---

# 44. Immutability de requisitos essenciais

Itens críticos provenientes de fonte oficial poderão possuir:

```text
required = true
sourceControlled = true
```

A IA não poderá eliminar ou contradizer esses itens.

---

# 45. Process Snapshot

Quando um usuário criar um processo, determinadas informações poderão ser armazenadas como snapshot.

Motivo:

Uma regra migratória pode mudar futuramente.

Exemplo:

```text
Visa
current version

Process
snapshot of version used
```

Assim é possível saber em quais dados o checklist original foi baseado.

A estratégia completa será definida no modelo de dados.

---

# 46. Caching

Caching será utilizado apenas quando apropriado.

Conteúdo público relativamente estável:

```text
visa catalog
country information
official sources
```

poderá ser cacheado.

Conteúdo privado:

```text
user profile
process
checklist
```

não deverá utilizar caching público.

---

# 47. Revalidation

Quando dados oficiais forem atualizados, páginas públicas poderão ser revalidadas.

Evitar rebuild completo quando não necessário.

---

# 48. Mutations

Após mutations relevantes, invalidar/revalidar somente dados necessários.

Exemplo:

```text
complete checklist item
 ↓
update database
 ↓
revalidate process
```

Evitar refresh global desnecessário.

---

# 49. Data Fetching

Ordem de preferência:

## Server Components

Para leitura inicial.

## Server Actions

Para mutations diretamente ligadas à UI.

## Route Handlers

Quando API HTTP explícita for necessária.

## TanStack Query

Para interações client-side complexas.

Não criar uma API REST interna apenas para Server Components chamarem o mesmo servidor via HTTP sem necessidade.

---

# 50. Evitar chamadas internas desnecessárias

Ruim:

```text
Server Component
 ↓
fetch("/api/visas")
 ↓
Next.js Route
 ↓
Database
```

Preferir:

```text
Server Component
 ↓
VisaService
 ↓
Repository
 ↓
Database
```

Route Handlers existem para fronteiras HTTP.

Não precisam ser usados internamente em todo lugar.

---

# 51. Dependency Direction

Dependências deverão apontar aproximadamente desta forma:

```text
UI
 ↓
Application
 ↓
Domain
 ↑
Infrastructure implementations
```

O domínio não deve importar:

```text
next/*
react
@prisma/*
@supabase/*
openai
```

sempre que possível.

---

# 52. Dependency Injection

Não será utilizado um framework de dependency injection.

Dependências poderão ser passadas diretamente.

Exemplo:

```ts
createChecklist({
  checklistRepository,
  visaRepository,
  aiProvider
})
```

ou configuradas através de factories simples.

Evitar containers complexos.

---

# 53. Factory Composition

Um local poderá compor dependências de produção.

Exemplo:

```text
features/checklists/application/factories/
```

ou:

```text
lib/container/
```

somente se a necessidade realmente surgir.

Não criar um Service Locator global prematuramente.

---

# 54. Shared Code

A pasta:

```text
shared/
```

deve conter apenas elementos realmente compartilhados.

Não transformar `shared` em uma pasta genérica para qualquer coisa.

Evitar:

```text
shared/utils/helpers/misc.ts
```

Funções devem permanecer próximas do domínio que as utiliza.

---

# 55. Components

Tipos de componentes:

## UI

```text
components/ui/
```

Primitivos:

* Button;
* Input;
* Card;
* Dialog.

## Layout

```text
components/layout/
```

Exemplos:

* Header;
* Sidebar;
* Footer.

## Feature

```text
features/checklists/components/
```

Exemplos:

* ChecklistCard;
* ChecklistProgress;
* ChecklistItem.

---

# 56. Component Responsibility

Componentes devem possuir responsabilidade clara.

Evitar componentes contendo simultaneamente:

* query;
* business logic;
* mutation;
* analytics;
* rendering;
* formatting;
* modal;
* validation.

Quando necessário, dividir responsabilidades.

---

# 57. Hooks

Hooks deverão representar comportamento reutilizável de UI.

Evitar criar hooks apenas para esconder qualquer função.

Bom exemplo:

```text
useChecklistProgressAnimation()
```

Possível exemplo:

```text
useUpdateChecklistItem()
```

quando envolver lógica client-side relevante.

Não colocar regra de domínio dentro de hooks quando ela puder ser função pura.

---

# 58. Formatting

Formatação de valores deverá utilizar utilitários consistentes.

Exemplos:

```text
formatCurrency()
formatDate()
formatDuration()
```

Não repetir lógica de formatação em componentes.

---

# 59. Dates

Datas deverão possuir convenção consistente.

Banco:

```text
UTC
```

Apresentação:

```text
locale do usuário
```

Não depender do timezone do servidor para lógica de negócio.

---

# 60. IDs

Entidades internas deverão utilizar IDs não previsíveis.

Exemplo:

* UUID;
* CUID;
* outro formato suportado pela ferramenta escolhida.

URLs públicas poderão preferir slugs quando apropriado.

Exemplo:

```text
/ireland/visas/critical-skills-employment-permit
```

---

# 61. Slugs

Slugs representam navegação amigável.

Não devem substituir IDs para autorização.

Exemplo:

```text
Visa
id
slug
```

---

# 62. SEO Architecture

Páginas públicas serão server-rendered ou estaticamente geradas quando apropriado.

Exemplo:

```text
/
 /ireland
 /ireland/work
 /ireland/visas/[slug]
```

Essas páginas poderão ser indexadas.

---

# 63. Private Routes

Áreas privadas:

```text
/dashboard
/profile
/processes
/settings
```

deverão:

* exigir autenticação;
* não ser indexadas;
* validar acesso no servidor.

---

# 64. Progressive Enhancement

Sempre que possível, operações importantes devem continuar compreensíveis sem depender de JavaScript complexo.

Não significa suportar aplicação completamente sem JavaScript.

Significa evitar dependência desnecessária de lógica client-side.

---

# 65. Accessibility Architecture

Acessibilidade não será tratada somente no final.

Componentes base devem já considerar:

* labels;
* focus;
* keyboard;
* aria;
* semântica;
* estados.

Isso reduz correções tardias.

---

# 66. Feature Flags

O MVP não precisa de sistema avançado de feature flags.

Quando necessário, poderão existir flags simples via ambiente ou configuração.

Não instalar plataforma dedicada sem necessidade.

---

# 67. Analytics Boundary

Analytics deverá ficar atrás de helper.

Exemplo:

```ts
trackEvent("checklist_created", {
  visaSlug
})
```

Evitar chamadas diretas do provider espalhadas pelo projeto.

Isso permite trocar Analytics posteriormente.

---

# 68. External Services

Integrações externas deverão ser encapsuladas.

Exemplos:

```text
OpenAI
Supabase
Vercel Analytics
future email provider
```

Não espalhar SDKs por features sem necessidade.

---

# 69. Email

Caso e-mails sejam adicionados:

```text
lib/email/
```

Possíveis usos:

* confirmação;
* recuperação;
* notificações.

Não faz parte do domínio principal neste momento.

---

# 70. Background Jobs

O MVP deve evitar jobs complexos.

Tarefas periódicas futuras poderão incluir:

```text
verify official links
refresh source metadata
detect stale information
```

Essas tarefas devem ser adicionadas apenas quando houver infraestrutura apropriada.

---

# 71. Link Verification Job

A validação inicial poderá acontecer:

* ao cadastrar fonte;
* manualmente;
* sob demanda administrativa.

Futuramente:

```text
Scheduled Job
 ↓
Load Official Sources
 ↓
Validate URLs
 ↓
Update status
```

---

# 72. Admin

O MVP não terá painel administrativo avançado.

Dados iniciais poderão ser gerenciados por:

* seed;
* scripts;
* acesso ao banco;
* pequenas ferramentas internas.

Quando houver necessidade real, um admin poderá ser desenvolvido.

---

# 73. Seed

O projeto deverá possuir seed para dados essenciais.

Exemplo:

```text
Ireland
 ↓
Visa Categories
 ↓
Visas
 ↓
Requirements
 ↓
Official Sources
```

Isso facilita:

* desenvolvimento;
* testes;
* preview;
* onboarding.

---

# 74. Development Data

Dados locais devem ser previsíveis.

Devemos conseguir executar:

```text
pnpm db:seed
```

e possuir ambiente funcional.

---

# 75. Database Migrations

Toda alteração estrutural de banco deve utilizar migration.

Evitar alterações manuais diretamente em produção.

Fluxo:

```text
Schema change
 ↓
Migration
 ↓
Review
 ↓
CI
 ↓
Production
```

---

# 76. Migration Safety

Alterações destrutivas deverão ser avaliadas cuidadosamente.

Exemplo:

Evitar:

```text
drop column
```

diretamente quando houver dados importantes.

Preferir migrações progressivas quando necessário.

---

# 77. Testing Architecture

A arquitetura deve permitir testes sem depender excessivamente de infraestrutura externa.

Camada Domain:

```text
pure unit tests
```

Application:

```text
fake repositories
fake AI
```

Infrastructure:

```text
integration tests
```

UI:

```text
component tests
```

Fluxos:

```text
Playwright
```

---

# 78. Test Factories

Testes deverão utilizar factories para objetos complexos.

Exemplo:

```ts
makeUserProfile()
makeVisa()
makeChecklist()
```

Isso reduz fixtures gigantes e duplicação.

---

# 79. Não mockar o que não precisa

Evitar mocks excessivos.

Preferir:

```text
Pure Domain Function
```

em vez de criar mocks para 10 módulos.

Arquitetura testável reduz necessidade de mocks.

---

# 80. Security Boundary

Todo dado vindo de fora da aplicação é não confiável.

Inclui:

```text
Browser
AI
External APIs
URLs
Environment
Database legacy data
```

Todos devem ser validados na fronteira apropriada.

---

# 81. Browser Trust Model

Nunca confiar no cliente para:

* userId;
* permissions;
* ownerId;
* checklist ownership;
* preço;
* status interno;
* acesso a processo.

Esses valores devem ser determinados ou validados no servidor.

---

# 82. AI Trust Model

Resposta de IA também deve ser tratada como input externo.

Fluxo:

```text
AI Response
 ↓
Schema
 ↓
Business Validation
 ↓
Application
```

IA não é uma fonte confiável apenas porque foi chamada pelo backend.

---

# 83. Environment Validation

Variáveis de ambiente devem ser validadas.

Exemplo:

```text
DATABASE_URL
OPENAI_API_KEY
SUPABASE_URL
SUPABASE keys
```

Aplicação deve falhar cedo quando configuração obrigatória estiver ausente.

---

# 84. Architecture Decisions

Decisões relevantes deverão ser documentadas utilizando ADRs.

Estrutura:

```text
docs/
└── decisions/
    ├── 0001-use-nextjs.md
    ├── 0002-use-postgresql.md
    └── ...
```

ADRs não precisam existir para decisões triviais.

---

# 85. Architecture Decision Record

Formato simples:

```text
Title

Status

Context

Decision

Consequences
```

---

# 86. Exec Plans

Features complexas deverão possuir plano antes da implementação.

Estrutura:

```text
docs/
└── exec-plans/
```

Exemplo:

```text
authentication.md
visa-recommendation.md
checklist-generation.md
```

Após conclusão, poderão continuar como histórico técnico.

---

# 87. Regra para mudanças grandes

Antes de implementar mudanças que envolvam múltiplos domínios:

1. investigar o código atual;
2. identificar impacto;
3. criar plano;
4. definir riscos;
5. implementar incrementalmente;
6. testar;
7. revisar diff.

---

# 88. Definition of Done

Uma feature não é considerada concluída apenas porque funciona visualmente.

Antes de ser considerada pronta:

```text
Requirements implemented
        ↓
Validation
        ↓
Authorization
        ↓
Tests
        ↓
Lint
        ↓
Typecheck
        ↓
Build
        ↓
Diff Review
        ↓
Documentation if necessary
```

---

# 89. Anti-patterns proibidos

Evitar:

## God Components

Componentes enormes com múltiplas responsabilidades.

## God Services

Serviços contendo todo o sistema.

## Utility Dump

```text
utils.ts
helpers.ts
misc.ts
```

com funções sem relação.

## Business Logic in UI

Regras importantes em componentes.

## Direct AI Usage Everywhere

SDK OpenAI importado diretamente em várias features.

## Direct DB Usage Everywhere

Prisma usado em toda camada da aplicação sem controle.

## Trusting Client IDs

Aceitar userId do navegador como verdade.

## Boolean Explosion

Entidades com dezenas de flags sem modelo adequado.

## Premature Abstraction

Criar abstração antes de existir necessidade.

## Premature Microservices

Separar serviços sem motivo operacional real.

---

# 90. Regra de abstração

Preferir começar concreto.

Após identificar repetição ou responsabilidade clara, abstrair.

Não seguir:

```text
"Talvez um dia precisemos..."
```

como justificativa suficiente para criar infraestrutura complexa.

---

# 91. Arquitetura inicial completa

```text
                               USER
                                │
                                ▼
                         ┌──────────────┐
                         │    Vercel    │
                         └──────┬───────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │      Next.js        │
                    │                     │
                    │     App Router      │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
     Server Components   Server Actions    Route Handlers
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Application Layer   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Domain Layer     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Repositories      AI Services     Source Services
              │                │                │
              ▼                ▼                ▼
           Prisma           OpenAI        Official Sites
              │
              ▼
         PostgreSQL

Authentication:
Supabase Auth
      │
      ▼
Next.js Server
      │
      ▼
Authorization
      │
      ▼
Domain / Data
```

---

# 92. Exemplo de feature completa

Feature:

```text
Create Immigration Process
```

Fluxo:

```text
User clicks
"Start process"
       ↓
Server Action
       ↓
requireUser()
       ↓
Zod validation
       ↓
CreateProcessService
       ↓
VisaRepository
       ↓
ProfileRepository
       ↓
Recommendation rules
       ↓
Create initial checklist
       ↓
ProcessRepository
       ↓
PostgreSQL
       ↓
redirect
       ↓
/processes/:id
```

---

# 93. Exemplo de AI flow

```text
User Profile
      +
Visa
      +
Official Requirements
      │
      ▼
ChecklistGenerationService
      │
      ▼
Prompt Builder
      │
      ▼
AIProvider
      │
      ▼
OpenAI
      │
      ▼
Structured Output
      │
      ▼
Zod
      │
      ▼
Business Validation
      │
      ▼
Merge with mandatory requirements
      │
      ▼
Persist
```

A etapa:

```text
Merge with mandatory requirements
```

é fundamental.

Mesmo que a IA deixe algo de fora, requisitos obrigatórios continuam presentes.

---

# 94. Exemplo de Recommendation Flow

```text
User Profile
      │
      ▼
Profile Normalization
      │
      ▼
Visa Rule Engine
      │
      ├── Critical Skills
      ├── General Employment
      └── Study
      │
      ▼
Compatibility Result
      │
      ▼
AI Explanation
      │
      ▼
Recommendations UI
```

---

# 95. Evolução futura

Essa arquitetura deverá suportar evolução para:

```text
Multiple Countries
```

sem alterar o núcleo.

Exemplo:

```text
Country
  │
  ├── Ireland
  ├── Portugal
  ├── Germany
  └── Australia
```

Dados e regras específicas poderão ser adicionados por país.

---

# 96. Possível evolução para serviços separados

Somente considerar separar backend caso surjam necessidades como:

* processamento pesado;
* filas;
* jobs contínuos;
* múltiplos clientes;
* aplicativo mobile;
* APIs externas;
* escala independente.

Nesse cenário:

```text
Next.js
   ↓
API
   ↓
Backend Service
```

poderá ser introduzido.

O MVP não precisa disso.

---

# 97. Arquitetura orientada ao produto

A arquitetura deve facilitar mudanças no produto.

Nunca devemos chegar à situação:

> "Não conseguimos alterar essa jornada porque a arquitetura não permite."

Arquitetura existe para suportar o produto.

O produto não existe para justificar a arquitetura.

---

# 98. Instruções para agentes

Antes de modificar uma feature, agentes devem:

1. ler este documento;
2. localizar o domínio relevante;
3. analisar padrões já existentes;
4. seguir a direção de dependências;
5. evitar criar nova camada sem necessidade;
6. evitar duplicar serviços existentes;
7. manter alterações limitadas à tarefa;
8. executar testes relevantes;
9. revisar o próprio diff.

---

# 99. Quando divergir desta arquitetura

Se uma tarefa exigir violar uma regra deste documento:

não ignorar silenciosamente.

O agente ou desenvolvedor deve:

1. identificar o conflito;
2. explicar por que a arquitetura atual não atende;
3. propor alternativa;
4. avaliar impactos;
5. registrar ADR quando a decisão for relevante;
6. somente então alterar o padrão.

---

# 100. Princípio final

O Meu Visto Fácil seguirá uma arquitetura simples no nível operacional e rigorosa na separação de responsabilidades.

Externamente:

```text
Uma aplicação Next.js.
```

Internamente:

```text
UI
│
Application
│
Domain
│
Infrastructure
```

A arquitetura deverá permitir que novas funcionalidades sejam adicionadas sem transformar a aplicação em um conjunto de componentes, APIs, queries e chamadas de IA fortemente acoplados.

A prioridade é manter um sistema compreensível, seguro, testável e evolutivo.
