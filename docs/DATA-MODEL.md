# Meu Visto Fácil — Data Model

## 1. Objetivo

Este documento define o modelo de dados inicial do Meu Visto Fácil.

O modelo deverá suportar:

* múltiplos países;
* catálogo de vistos e permissões;
* requisitos oficiais;
* fontes oficiais;
* perfil migratório do usuário;
* recomendação de opções;
* criação de processos;
* checklists personalizados;
* acompanhamento de progresso;
* rastreabilidade das informações utilizadas;
* evolução futura sem reconstrução completa do banco.

O banco principal será PostgreSQL.

O acesso será feito através do Prisma.

Implementação da Fase 6: somente Country, VisaCategory, Visa, VisaRequirement, OfficialSource, RequirementSource e VisaSource em `prisma/schema.prisma`, schema PostgreSQL `catalog`. O restante deste documento permanece conceitual. Foi acrescentado `OfficialSource.editorialConsultedAt` para separar consulta editorial de verificação HTTP. Campos indisponíveis em rascunhos são opcionais; relações usam RESTRICT, requisitos têm código único por visto e slugs de visto são únicos por país. Mapeamento parcial e justificativas em [DATABASE-SETUP.md](DATABASE-SETUP.md) e no [plano](exec-plans/phase-6-database-foundation.md).

---

# 2. Princípios do modelo

O modelo deve seguir os seguintes princípios:

## Dados oficiais separados de dados do usuário

Informações sobre vistos não devem ficar misturadas com informações dos processos pessoais.

## Rastreabilidade

Requisitos relevantes devem poder apontar para suas fontes.

## Histórico

Um processo criado pelo usuário deve manter informação suficiente para entendermos com quais regras ele foi criado.

## Extensibilidade

A arquitetura deve permitir adicionar novos países e vistos sem criar novas tabelas específicas para cada país.

## Dados mínimos

Não armazenar informações pessoais que não sejam necessárias ao funcionamento do produto.

## Integridade

Relacionamentos importantes deverão utilizar constraints do banco.

---

# 3. Visão geral das entidades

Modelo conceitual:

```text
Auth User
    │
    ▼
UserProfile
    │
    ├────────────────────────────┐
    │                            │
    ▼                            ▼
ImmigrationProcess         ProfileAnswer
    │
    ├──────────────┐
    │              │
    ▼              ▼
Checklist      ProcessSnapshot
    │
    ▼
ChecklistItem


Country
    │
    ▼
Visa
    │
    ├───────────────┐
    │               │
    ▼               ▼
VisaRequirement   VisaSource
    │               │
    ▼               ▼
OfficialSource ◄────┘
```

---

# 4. Autenticação e usuário

A identidade será inicialmente gerenciada pelo Supabase Auth.

Portanto, credenciais como:

* senha;
* hash de senha;
* tokens de sessão;

não serão armazenadas nas tabelas de domínio da aplicação.

O identificador do usuário autenticado será usado como referência no banco da aplicação.

---

# 5. UserProfile

Representa o perfil da aplicação associado ao usuário autenticado.

Exemplo conceitual:

```text
UserProfile

id
authUserId
displayName
preferredLocale
createdAt
updatedAt
```

## Campos

### id

Identificador interno da aplicação.

### authUserId

Identificador correspondente ao usuário no provider de autenticação.

Deve possuir constraint UNIQUE.

### displayName

Nome utilizado na interface.

Pode ser opcional.

### preferredLocale

Preferência de idioma.

Inicialmente:

```text
pt-BR
```

A estrutura deve permitir idiomas futuros.

### createdAt

Data de criação.

### updatedAt

Última atualização.

---

# 6. Country

Representa um país suportado pela plataforma.

```text
Country

id
code
slug
name
status
createdAt
updatedAt
```

## code

Código ISO do país.

Exemplo:

```text
IE
PT
DE
AU
```

Deve ser único.

## slug

Identificador amigável para URLs.

Exemplo:

```text
ireland
portugal
germany
australia
```

Deve ser único.

## name

Nome exibido.

Exemplo:

```text
Irlanda
```

## status

Possíveis estados:

```text
ACTIVE
COMING_SOON
DISABLED
```

No MVP:

```text
Ireland = ACTIVE
```

Outros países poderão aparecer como:

```text
COMING_SOON
```

---

# 7. VisaCategory

Representa uma categoria de imigração.

Exemplos:

```text
WORK
STUDY
FAMILY
RESIDENCE
```

Modelo:

```text
VisaCategory

id
slug
name
description
```

Isso evita armazenar categorias como strings inconsistentes em múltiplos registros.

---

# 8. Visa

Representa um visto, permit, permission ou caminho migratório suportado.

O nome `Visa` será utilizado no domínio por simplicidade, mesmo que legalmente determinados mecanismos não sejam classificados literalmente como vistos.

Modelo:

```text
Visa

id
countryId
categoryId
slug
name
shortDescription
description
status
officialName
authorityName
lastReviewedAt
createdAt
updatedAt
```

---

# 9. Visa.status

Estados possíveis:

```text
DRAFT
ACTIVE
ARCHIVED
```

## DRAFT

Informação ainda sendo preparada.

## ACTIVE

Disponível ao público.

## ARCHIVED

Não deve aparecer como uma opção ativa, mas é mantida para histórico.

Não excluir permanentemente vistos utilizados em processos históricos sem necessidade.

---

# 10. Visa.lastReviewedAt

Indica quando o conteúdo estruturado do visto foi revisado.

Isso é diferente de:

```text
OfficialSource.lastVerifiedAt
```

Um link pode estar funcionando mesmo que o conteúdo do visto ainda não tenha sido revisado recentemente.

---

# 11. VisaRequirement

Representa uma condição ou requisito relacionado ao visto.

Modelo conceitual:

```text
VisaRequirement

id
visaId
code
title
description
category
requirementType
importance
isMandatory
sourceControlled
sortOrder
createdAt
updatedAt
```

---

# 12. Requirement Category

Categorias possíveis:

```text
IDENTITY
EMPLOYMENT
EDUCATION
FINANCIAL
FAMILY
HEALTH
APPLICATION
AFTER_ARRIVAL
OTHER
```

Isso ajuda a organizar:

* telas;
* checklists;
* regras;
* filtros.

---

# 13. Requirement Type

Nem todo requisito representa um documento.

Possíveis valores:

```text
DOCUMENT
CONDITION
ACTION
INFORMATION
FEE
DEADLINE
```

Exemplo:

```text
Passaporte válido
→ DOCUMENT

Possuir oferta de emprego
→ CONDITION

Enviar formulário
→ ACTION
```

---

# 14. Requirement Importance

```text
CRITICAL
HIGH
NORMAL
LOW
```

Isso poderá ajudar o sistema a ordenar o checklist.

---

# 15. isMandatory

Indica que o requisito deve estar presente no processo quando aplicável.

Exemplo:

```text
isMandatory = true
```

A IA não poderá simplesmente removê-lo.

---

# 16. sourceControlled

Indica que a informação é controlada por fonte oficial e não pode ser alterada livremente pela camada de IA.

Exemplo:

```text
sourceControlled = true
```

A IA poderá explicar a informação.

Não poderá substituí-la por outra regra.

---

# 17. Requisitos condicionais

Alguns requisitos não se aplicam a todos os usuários.

Exemplo:

```text
comprovante de relacionamento
```

somente pode ser relevante para determinados processos familiares.

Para suportar isso, requisitos poderão possuir uma regra condicional.

Inicialmente, evitar armazenar código executável no banco.

Modelo recomendado:

```text
VisaRequirementCondition

id
requirementId
field
operator
value
```

---

# 18. RequirementCondition

Exemplo:

```text
field: hasSpouse
operator: EQUALS
value: true
```

Outro exemplo:

```text
field: employmentOffer
operator: EQUALS
value: true
```

Operadores iniciais:

```text
EQUALS
NOT_EQUALS
IN
NOT_IN
EXISTS
GREATER_THAN
GREATER_THAN_OR_EQUAL
LESS_THAN
LESS_THAN_OR_EQUAL
```

A implementação deverá manter uma lista de campos permitidos.

Não executar expressões arbitrárias provenientes do banco.

---

# 19. Regras complexas

Caso regras futuras se tornem complexas demais para `RequirementCondition`, deverão ser implementadas no domínio.

Exemplo:

```ts
evaluateCriticalSkillsRequirement(profile)
```

Não transformar o banco em uma linguagem de programação genérica.

---

# 20. OfficialSource

Representa uma fonte confiável.

Na Fase 9, a migration `20260929000000_source_verification_metadata` acrescenta `verificationResolvedUrl` e `verificationDurationMs`, ambos opcionais. A duração tem restrição não negativa. A URL resolvida é apenas metadado técnico: não substitui `url` nem `hostname` editoriais. Tentativas malsucedidas preservam `lastSuccessfulVerificationAt`; atualizações concorrentes invalidam o resultado da verificação.

Modelo:

```text
OfficialSource

id
countryId
authority
title
url
hostname
status
lastVerifiedAt
lastSuccessfulVerificationAt
verificationStatusCode
createdAt
updatedAt
```

---

# 21. OfficialSource.status

Possíveis valores:

```text
ACTIVE
TEMPORARILY_UNAVAILABLE
BROKEN
ARCHIVED
```

---

# 22. hostname

Armazenar o hostname normalizado.

Exemplo:

```text
enterprise.gov.ie
```

Isso facilita:

* allowlist;
* auditoria;
* validação;
* consultas.

---

# 23. lastVerifiedAt

Data da última tentativa de validação.

---

# 24. lastSuccessfulVerificationAt

Última vez que a fonte foi verificada com sucesso.

Essa distinção permite representar:

```text
última tentativa = hoje
último sucesso = ontem
```

sem perder histórico básico.

---

# 25. Relação entre requisito e fonte

Um requisito pode possuir mais de uma fonte.

Uma fonte pode suportar vários requisitos.

Portanto:

```text
many-to-many
```

Tabela intermediária:

```text
RequirementSource

requirementId
sourceId
relationType
```

---

# 26. relationType

Possíveis valores:

```text
PRIMARY
SUPPORTING
```

## PRIMARY

Fonte principal daquele requisito.

## SUPPORTING

Fonte complementar.

---

# 27. Relação entre Visa e OfficialSource

Além dos requisitos, um visto poderá possuir fontes gerais.

Tabela:

```text
VisaSource

visaId
sourceId
relationType
```

Exemplo:

```text
overview
application
fees
official guide
```

Poderemos futuramente substituir `relationType` por categorias mais específicas.

---

# 28. VisaMetadata

Determinadas informações de vistos são naturalmente estruturadas.

Exemplos:

* taxa;
* duração;
* possibilidade de renovação;
* dependentes;
* tempo estimado.

Não queremos criar dezenas de colunas opcionais em `Visa`.

Também não queremos jogar tudo em um JSON sem estrutura.

Para o MVP, propriedades importantes poderão possuir tabela:

```text
VisaAttribute

id
visaId
key
label
value
valueType
sourceId
sortOrder
```

---

# 29. VisaAttribute.valueType

Possíveis tipos:

```text
TEXT
BOOLEAN
INTEGER
DECIMAL
MONEY
DURATION
DATE
```

Exemplo:

```text
key: application_fee
label: Taxa de solicitação
value: ...
valueType: MONEY
```

Valores sujeitos a mudança devem possuir fonte associada.

---

# 30. Evitar atributos mágicos

`VisaAttribute` deve ser utilizado principalmente para informação apresentacional estruturada.

Não utilizar:

```text
key/value
```

como substituto de um modelo de domínio bem definido.

Se uma propriedade passar a participar intensamente de regras de negócio, ela deve receber modelagem explícita.

---

# 31. ProfileQuestion

O questionário deverá ser configurável.

Modelo:

```text
ProfileQuestion

id
countryId
code
question
description
type
required
sortOrder
status
```

---

# 32. ProfileQuestion.type

Possíveis tipos:

```text
TEXT
BOOLEAN
SINGLE_SELECT
MULTI_SELECT
NUMBER
DATE
```

Exemplo:

```text
code:
has_employment_offer

question:
Você já possui uma oferta de emprego?

type:
BOOLEAN
```

---

# 33. QuestionOption

Para perguntas com opções:

```text
QuestionOption

id
questionId
value
label
sortOrder
```

Exemplo:

```text
Software Development
Engineering
Healthcare
Education
Other
```

---

# 34. ProfileAnswer

Representa uma resposta atual do usuário.

```text
ProfileAnswer

id
userProfileId
questionId
value
createdAt
updatedAt
```

---

# 35. Tipo de ProfileAnswer

O armazenamento deverá permitir diferentes tipos sem perder validação.

Uma abordagem aceitável será utilizar JSON para o campo:

```text
value
```

desde que:

* o schema da pergunta determine o tipo esperado;
* Zod valide o valor;
* regras de domínio nunca trabalhem com JSON arbitrário.

Exemplos:

```json
true
```

```json
"software-development"
```

```json
["software-development", "engineering"]
```

---

# 36. NormalizedProfile

As regras do domínio não devem consultar diretamente dezenas de `ProfileAnswer`.

Antes da recomendação, as respostas serão transformadas em um perfil normalizado.

Exemplo conceitual:

```ts
type ImmigrationProfile = {
  nationality?: string
  objective: ImmigrationObjective
  hasEmploymentOffer?: boolean
  occupationArea?: string
  educationLevel?: string
  intendsToStudy?: boolean
  hasFamilyInCountry?: boolean
}
```

Essa estrutura não precisa necessariamente existir como tabela.

Ela pode ser construída na Application Layer.

---

# 37. RecommendationRun

Quando o usuário executar uma análise, poderá ser interessante registrar a execução.

Modelo:

```text
RecommendationRun

id
userProfileId
countryId
profileSnapshot
engineVersion
createdAt
```

---

# 38. Por que armazenar RecommendationRun?

Permite futuramente responder:

* qual perfil gerou essa recomendação?
* qual versão das regras estava ativa?
* por que o resultado mudou?

Também ajuda:

* debugging;
* métricas;
* testes;
* auditoria.

---

# 39. RecommendationResult

Cada resultado encontrado poderá ser armazenado.

```text
RecommendationResult

id
recommendationRunId
visaId
compatibility
matchedCriteria
missingCriteria
blockers
explanation
createdAt
```

---

# 40. compatibility

Valores:

```text
HIGH
MEDIUM
LOW
NOT_RECOMMENDED
```

Evitar porcentagem artificial.

---

# 41. matchedCriteria

Critérios atendidos.

Pode ser armazenado como JSON estruturado.

---

# 42. missingCriteria

Critérios ainda não confirmados.

Não significa necessariamente que o usuário não atende.

Pode significar que a aplicação ainda não possui informação suficiente.

---

# 43. blockers

Critérios que potencialmente tornam aquela opção incompatível.

A aplicação deve apresentar blockers com linguagem cuidadosa e fonte quando apropriado.

---

# 44. explanation

Texto explicativo apresentado ao usuário.

Poderá ser produzido pela IA a partir do resultado determinístico.

O resultado determinístico deve continuar existindo separadamente.

---

# 45. ImmigrationProcess

Representa um processo salvo pelo usuário.

```text
ImmigrationProcess

id
userProfileId
countryId
visaId
status
title
startedAt
completedAt
createdAt
updatedAt
```

---

# 46. ImmigrationProcess.status

Possíveis estados:

```text
ACTIVE
PAUSED
COMPLETED
ARCHIVED
```

---

# 47. title

O usuário poderá futuramente personalizar o nome.

Exemplo:

```text
Meu processo para Irlanda
```

Inicialmente poderá ser gerado automaticamente.

---

# 48. ProcessSnapshot

No momento da criação de um processo, informações importantes utilizadas para gerar o checklist poderão ser preservadas.

Modelo:

```text
ProcessSnapshot

id
processId
visaSnapshot
profileSnapshot
requirementsSnapshot
ruleEngineVersion
promptVersion
createdAt
```

---

# 49. Por que snapshot?

Imagine:

```text
Janeiro:
requisito X

Junho:
requisito X foi atualizado
```

Não queremos perder completamente a informação de que o checklist original foi gerado utilizando a versão anterior.

O snapshot permite rastreabilidade.

---

# 50. Snapshot não substitui dados atuais

A aplicação poderá mostrar:

```text
Seu processo foi criado com informações de 10/01/2027.

Encontramos atualizações desde então.
```

Essa capacidade poderá ser implementada futuramente.

O snapshot é a base necessária para isso.

---

# 51. Checklist

Representa o checklist principal associado ao processo.

Inicialmente:

```text
1 ImmigrationProcess
→
1 Checklist
```

Modelo:

```text
Checklist

id
processId
version
generatedBy
generatedAt
createdAt
updatedAt
```

---

# 52. generatedBy

Possíveis valores:

```text
SYSTEM
SYSTEM_WITH_AI
```

No futuro:

```text
ADMIN
USER_CUSTOMIZED
```

---

# 53. ChecklistItem

Modelo:

```text
ChecklistItem

id
checklistId
requirementId
title
description
category
priority
status
isMandatory
sourceControlled
sortOrder
completedAt
createdAt
updatedAt
```

---

# 54. requirementId

Pode ser opcional.

Isso permite diferenciar:

### Item baseado em requisito oficial

```text
requirementId != null
```

### Item personalizado

```text
requirementId = null
```

Exemplo personalizado:

```text
Separar documentos em uma pasta
```

---

# 55. ChecklistItem.status

Possíveis valores:

```text
PENDING
IN_PROGRESS
COMPLETED
NOT_APPLICABLE
```

---

# 56. NOT_APPLICABLE

Necessário para cenários em que um item existe no checklist, mas posteriormente descobre-se que não se aplica ao usuário.

Itens obrigatórios controlados pelo sistema não poderão ser marcados como `NOT_APPLICABLE` sem validação apropriada.

---

# 57. ChecklistItemSource

Para preservar fontes utilizadas pelo item:

```text
ChecklistItemSource

checklistItemId
officialSourceId
```

Assim um item do checklist pode mostrar diretamente:

```text
Ver fonte oficial
```

---

# 58. Conteúdo personalizado do item

Pode haver diferença entre:

```text
VisaRequirement.description
```

e:

```text
ChecklistItem.description
```

Exemplo:

Requirement:

```text
Provide evidence of qualification.
```

Checklist personalizado:

```text
Como você informou possuir graduação na área, separe seu diploma e documentação acadêmica correspondente.
```

A regra original permanece vinculada.

---

# 59. Progresso

O progresso não precisa inicialmente ser armazenado como percentual.

Pode ser calculado.

Exemplo:

```text
completed actionable items
/
total actionable items
```

Vantagem:

evita inconsistência.

---

# 60. Itens excluídos do progresso

Dependendo do modelo final, itens:

```text
NOT_APPLICABLE
```

não devem entrar no denominador.

Regra exata deverá ficar no domínio.

---

# 61. Checklist customizado pelo usuário

Futuramente poderá ser permitido:

* adicionar item;
* adicionar nota;
* reordenar certos itens.

Requisitos obrigatórios deverão permanecer protegidos.

Para isso, `ChecklistItem` poderá possuir:

```text
origin
```

Valores:

```text
OFFICIAL_REQUIREMENT
AI_ENRICHMENT
USER_CREATED
SYSTEM
```

---

# 62. Notes

Inicialmente, notas do usuário poderão estar no próprio ChecklistItem:

```text
userNotes
```

Se a funcionalidade crescer, poderá virar entidade separada.

Evitar criar sistema de notas complexo prematuramente.

---

# 63. User Activity

Não criar tabela genérica de eventos de usuário no MVP.

Analytics deve permanecer inicialmente no provider de analytics.

Eventos importantes de domínio poderão ser armazenados futuramente caso exista necessidade de auditoria.

---

# 64. AI Generation Record

Chamadas relevantes de IA poderão possuir registro técnico mínimo.

```text
AIGeneration

id
userProfileId?
processId?
operation
provider
model
promptVersion
status
latencyMs
createdAt
```

---

# 65. O que NÃO armazenar em AIGeneration

Não armazenar indiscriminadamente:

* prompts completos com dados pessoais;
* respostas completas;
* secrets;
* tokens;
* informações sensíveis.

O registro existe principalmente para observabilidade.

---

# 66. AI status

Valores:

```text
SUCCESS
FAILED
REJECTED
INVALID_OUTPUT
```

---

# 67. SourceVerification

Para manter histórico básico da validação de links:

```text
SourceVerification

id
sourceId
status
httpStatus
resolvedUrl
checkedAt
durationMs
```

---

# 68. Verification status

Possíveis valores:

```text
VALID
INVALID
TIMEOUT
REDIRECT_REJECTED
HOST_REJECTED
NETWORK_ERROR
```

---

# 69. Histórico de verificação

`OfficialSource` guarda o estado atual.

`SourceVerification` guarda execuções anteriores.

Exemplo:

```text
OfficialSource
status = ACTIVE
lastVerifiedAt = today

SourceVerification
├── yesterday VALID
├── last week TIMEOUT
└── two weeks ago VALID
```

---

# 70. Limpeza de histórico

Não é necessário preservar verificações para sempre.

Uma política futura poderá remover registros técnicos antigos.

---

# 71. CountrySourceDomain

A allowlist de hosts poderá ser representada no código ou banco.

Para o MVP, preferência:

```text
código versionado
```

Exemplo:

```ts
IRELAND_OFFICIAL_HOSTS
```

Motivos:

* code review;
* histórico Git;
* mudança consciente;
* menor risco de alteração acidental.

Caso futuramente exista painel administrativo, isso poderá mudar.

---

# 72. Dados legais e conteúdo editorial

Conteúdo de vistos deverá preferir dados estruturados.

Evitar um único campo:

```text
content: huge markdown
```

para representar todo o visto.

Usar entidades como:

```text
Visa
VisaRequirement
VisaAttribute
OfficialSource
```

Conteúdo editorial complementar pode existir quando necessário.

---

# 73. FAQ

Se houver FAQ específico:

```text
VisaFAQ

id
visaId
question
answer
sortOrder
sourceId?
```

Não é obrigatório na primeira migration.

Pode ser adicionado quando a página de detalhes exigir.

---

# 74. Dados derivados

Evitar armazenar informação facilmente derivável.

Exemplos:

Não armazenar necessariamente:

```text
checklistProgress = 68
```

se é calculável.

Não armazenar:

```text
countryVisaCount
```

se pode ser consultado.

Armazenar somente quando performance ou histórico justificar.

---

# 75. Soft Delete

Não utilizar `deletedAt` indiscriminadamente em todas as tabelas.

Utilizar status:

```text
ARCHIVED
```

em entidades onde histórico é importante.

Dados realmente descartáveis poderão ser excluídos.

---

# 76. Cascades

Cascades deverão ser definidos cuidadosamente.

Exemplo:

Excluir usuário:

poderá remover:

```text
profile
processes
checklists
answers
```

conforme política de privacidade.

Por outro lado:

Excluir Country não deve apagar silenciosamente:

```text
processos históricos
```

Entidades de referência importantes devem preferir arquivamento.

---

# 77. Foreign Keys

Relações importantes deverão utilizar foreign keys reais.

Exemplos:

```text
Visa.countryId
Visa.categoryId
VisaRequirement.visaId
ImmigrationProcess.userProfileId
Checklist.processId
ChecklistItem.checklistId
```

Evitar IDs relacionados armazenados apenas dentro de JSON.

---

# 78. Índices

Índices deverão ser criados com base em consultas esperadas.

Índices iniciais prováveis:

```text
Country.code UNIQUE
Country.slug UNIQUE

Visa.slug + countryId UNIQUE
Visa.countryId
Visa.categoryId
Visa.status

UserProfile.authUserId UNIQUE

ImmigrationProcess.userProfileId
ImmigrationProcess.status

Checklist.processId UNIQUE

ChecklistItem.checklistId
ChecklistItem.status

OfficialSource.url UNIQUE
OfficialSource.hostname

ProfileAnswer.userProfileId
ProfileAnswer.questionId
```

---

# 79. Unique Profile Answer

Deve existir no máximo uma resposta atual por:

```text
userProfileId + questionId
```

Constraint:

```text
UNIQUE(userProfileId, questionId)
```

---

# 80. Visa slug

O mesmo slug poderá teoricamente existir em países diferentes.

Portanto preferir:

```text
UNIQUE(countryId, slug)
```

em vez de exigir slug globalmente único.

---

# 81. OfficialSource URL

Normalizar URLs antes da persistência.

Considerar:

* fragmentos;
* trailing slash;
* hostname;
* protocolo.

Não criar duplicatas apenas por variações triviais da mesma URL.

---

# 82. Datas

Todas as datas do banco deverão utilizar timestamp adequado.

Internamente:

```text
UTC
```

Conversão de timezone apenas na apresentação.

---

# 83. Valores monetários

Nunca utilizar floating point para valores monetários críticos.

Uma possível modelagem:

```text
amountMinor
currency
```

Exemplo:

```text
100000
EUR
```

representando:

```text
€1.000,00
```

Se valores de taxas forem usados intensamente, criar entidade explícita futuramente.

---

# 84. Currency

Usar código ISO:

```text
EUR
USD
GBP
BRL
```

---

# 85. Country-specific rules

Evitar colunas:

```text
irelandSomething
portugalSomething
```

na estrutura principal.

Especificidades devem ser representadas através de:

* dados;
* regras de domínio por país;
* configurações;
* extensões controladas.

---

# 86. Rule Engine Version

As recomendações deverão possuir versão da regra.

Exemplo:

```text
ireland-work-v1
```

ou:

```text
1.0.0
```

Isso permite rastrear mudanças futuras.

---

# 87. Prompt Version

Processos que utilizem IA deverão registrar a versão relevante do prompt quando a rastreabilidade fizer sentido.

Exemplo:

```text
checklist-v1
recommendation-explanation-v2
```

---

# 88. Seed Data

Seed inicial deverá criar:

```text
Ireland

Visa Categories

Initial Visas

Requirements

Official Sources

Relations
```

O seed deverá ser idempotente sempre que possível.

Rodá-lo duas vezes não deve gerar duplicatas.

---

# 89. Dados iniciais da Irlanda

O primeiro conjunto deverá priorizar poucos caminhos bem documentados.

Exemplo inicial:

```text
Work
├── Critical Skills Employment Permit
└── General Employment Permit

Study
└── initial relevant study route

Family
└── initial family route
```

O conjunto final deverá ser validado contra fontes oficiais durante implementação.

Não criar dezenas de registros apenas para aumentar o catálogo.

---

# 90. Prisma Schema — direção conceitual

O schema real será criado pelo Codex posteriormente.

Ele deverá refletir este modelo.

Estrutura conceitual:

```prisma
model Country {
  id        String
  code      String
  slug      String
  name      String
  status    CountryStatus

  visas     Visa[]
  sources   OfficialSource[]
}
```

```prisma
model Visa {
  id          String
  countryId   String
  categoryId  String
  slug        String
  name        String

  country      Country
  category     VisaCategory
  requirements VisaRequirement[]
}
```

```prisma
model ImmigrationProcess {
  id            String
  userProfileId String
  visaId        String

  userProfile UserProfile
  visa        Visa
  checklist   Checklist?
}
```

O código acima é apenas direção arquitetural.

O schema final deve considerar as versões reais do Prisma e PostgreSQL no momento do bootstrap.

---

# 91. Diagrama simplificado

```text
                     ┌──────────────────┐
                     │     Country      │
                     └────────┬─────────┘
                              │
                              │ 1:N
                              ▼
                     ┌──────────────────┐
                     │       Visa       │
                     └────────┬─────────┘
                              │
                         1:N  │
                              ▼
                    ┌────────────────────┐
                    │ VisaRequirement    │
                    └────────┬───────────┘
                             │
                            N:M
                             │
                             ▼
                    ┌────────────────────┐
                    │ OfficialSource     │
                    └────────────────────┘


Supabase Auth
      │
      │ 1:1
      ▼
┌──────────────────┐
│   UserProfile    │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│ ImmigrationProcess   │
└────────┬─────────────┘
         │
         │ 1:1
         ▼
┌──────────────────┐
│    Checklist     │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│  ChecklistItem   │
└──────────────────┘
```

---

# 92. Fluxo de dados do questionário

```text
User
 ↓
ProfileQuestion
 ↓
ProfileAnswer
 ↓
Normalize Profile
 ↓
ImmigrationProfile
 ↓
Recommendation Engine
 ↓
RecommendationRun
 ↓
RecommendationResult
```

---

# 93. Fluxo de criação do processo

```text
RecommendationResult
        ↓
User selects Visa
        ↓
ImmigrationProcess
        ↓
ProcessSnapshot
        ↓
Checklist
        ↓
ChecklistItem
```

---

# 94. Fluxo das fontes

```text
OfficialSource
      ↓
RequirementSource
      ↓
VisaRequirement
      ↓
ChecklistItem
      ↓
User
```

Isso permite explicar:

> Por que este item está no meu checklist?

e mostrar sua origem.

---

# 95. Regras de privacidade

Não armazenar sem necessidade:

* CPF;
* número de passaporte;
* imagens de documentos;
* dados bancários;
* endereço completo;
* documentos médicos;
* credenciais de terceiros.

O MVP deve funcionar sem essas informações.

---

# 96. Nacionalidade

Nacionalidade poderá ser relevante para regras migratórias.

Caso coletada:

* deve possuir finalidade clara;
* deve ser utilizada apenas na recomendação;
* deve ser tratada como dado do perfil;
* não deve aparecer em logs.

---

# 97. Dados de perfil

As perguntas do formulário devem seguir o princípio:

```text
Coletar somente aquilo que altera
a experiência ou as recomendações.
```

Não perguntar informações “porque talvez sejam úteis no futuro”.

---

# 98. Exclusão de conta

A arquitetura deverá permitir exclusão de dados associados ao usuário.

Fluxo futuro:

```text
Delete account
 ↓
Delete / anonymize profile
 ↓
Delete processes
 ↓
Delete checklists
 ↓
Delete recommendation history
 ↓
Remove authentication identity
```

Detalhes serão definidos em `SECURITY.md` e políticas de privacidade.

---

# 99. Backup e recovery

Backup ficará inicialmente sob responsabilidade do provider de PostgreSQL.

A aplicação deverá utilizar migrations e seeds para permitir reconstruir estrutura e dados de referência.

Dados de usuários não deverão depender exclusivamente de seeds.

---

# 100. Modelo mínimo para o primeiro release

Embora este documento descreva a arquitetura completa, a primeira migration não precisa incluir toda entidade possível.

Mínimo recomendado:

```text
UserProfile

Country
VisaCategory
Visa
VisaRequirement

OfficialSource
RequirementSource
VisaSource

ProfileQuestion
QuestionOption
ProfileAnswer

ImmigrationProcess
ProcessSnapshot

Checklist
ChecklistItem
ChecklistItemSource
```

Adicionar quando necessário:

```text
RecommendationRun
RecommendationResult
SourceVerification
AIGeneration
VisaAttribute
VisaFAQ
```

Não construir antecipadamente funcionalidades sem uso.

---

# 101. Regra para JSON

JSON será permitido quando representar:

* snapshot;
* resultado estruturado;
* configuração limitada;
* valor de pergunta flexível.

JSON não deverá substituir:

* relações;
* foreign keys;
* entidades importantes;
* dados frequentemente consultados.

---

# 102. Regra para snapshots

Snapshots deverão ser:

* serializáveis;
* versionados implicitamente ou explicitamente;
* tratados como históricos;
* validados antes da persistência.

Nunca confiar em snapshot como fonte atual.

---

# 103. Evolução multi-país

Adicionar novo país deverá seguir aproximadamente:

```text
Country
 ↓
Visa Categories
 ↓
Visas
 ↓
Requirements
 ↓
Sources
 ↓
Rule Engine
 ↓
Profile Questions
```

Não deve exigir alteração estrutural grande no banco.

---

# 104. Modelo versus regras

O banco representa:

```text
dados
relações
estado
histórico
```

O domínio representa:

```text
comportamento
decisões
regras
```

Evitar colocar toda regra de negócio dentro do banco.

---

# 105. Exemplo: Critical Skills

Exemplo conceitual:

```text
Country
Ireland

Visa
Critical Skills Employment Permit

Requirements
├── valid employment offer
├── eligible occupation / conditions
├── salary conditions
├── qualification conditions
└── required documentation

Sources
├── official permit page
├── occupation list
└── official guidance
```

O banco armazena essas informações.

A função:

```text
evaluateCriticalSkills(profile)
```

determina como elas se aplicam ao usuário.

---

# 106. Identificadores legíveis em regras

Requisitos importantes deverão possuir `code`.

Exemplo:

```text
EMPLOYMENT_OFFER
MINIMUM_REMUNERATION
VALID_PASSPORT
QUALIFICATION
```

Regras de domínio devem preferir códigos estáveis em vez de nomes exibidos.

Nunca:

```ts
if (requirement.title === "Passaporte válido")
```

Preferir:

```ts
if (requirement.code === "VALID_PASSPORT")
```

---

# 107. Conteúdo traduzível

O MVP começará em português.

Entretanto, evitar arquitetura que impossibilite internacionalização futura.

Para conteúdo editorial grande, não implementar sistema de tradução completo inicialmente.

Quando necessário, o modelo poderá evoluir para:

```text
VisaTranslation
RequirementTranslation
```

Não antecipar isso no MVP sem necessidade.

---

# 108. Auditoria de conteúdo

Entidades importantes poderão possuir:

```text
createdAt
updatedAt
lastReviewedAt
```

Não é necessário guardar histórico completo de toda edição na primeira versão.

Snapshots de processos preservam o contexto mais crítico.

---

# 109. Dados administrativos

O MVP não precisa de modelo complexo:

```text
Admin
Role
Permission
Team
```

Se for necessário inserir dados administrativos manualmente, isso poderá ser feito via scripts seguros.

Autorização administrativa completa será adicionada somente quando existir painel administrativo.

---

# 110. Naming Convention

Banco:

```text
camelCase no Prisma
```

O Prisma poderá mapear nomes físicos no PostgreSQL conforme convenção definida posteriormente.

Evitar misturar estilos arbitrariamente.

---

# 111. Regra final para o Codex

Ao implementar o banco, o agente deverá:

1. ler `PRODUCT.md`;
2. ler `TECH-STACK.md`;
3. ler `ARCHITECTURE.md`;
4. ler este documento;
5. criar apenas entidades necessárias à fase atual;
6. manter compatibilidade com a arquitetura completa;
7. adicionar constraints;
8. adicionar índices relevantes;
9. criar migrations;
10. criar seed;
11. criar factories de teste quando necessário;
12. não alterar o modelo sem justificar a mudança.

---

# 112. Princípio final

O modelo de dados deverá permitir responder com clareza a três perguntas:

### De onde veio esta informação?

Através de `OfficialSource`.

### Por que este usuário recebeu esta recomendação?

Através de perfil, regras e resultados estruturados.

### Com quais informações este checklist foi criado?

Através de `ProcessSnapshot`, requisitos e versões utilizadas.

Essas três capacidades são fundamentais para o diferencial técnico e de confiabilidade do Meu Visto Fácil.
