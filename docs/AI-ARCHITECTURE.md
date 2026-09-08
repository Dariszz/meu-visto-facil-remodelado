# Meu Visto Fácil — AI Architecture

## 1. Objetivo

Este documento define como inteligência artificial será utilizada no Meu Visto Fácil.

A IA deve melhorar:

* personalização;
* clareza;
* organização;
* explicação;
* experiência do usuário.

Ela não deve substituir:

* regras oficiais;
* fontes governamentais;
* validações determinísticas;
* autorização;
* regras de negócio críticas.

O sistema deve ser projetado para continuar funcionando de maneira segura mesmo quando a IA:

* falhar;
* retornar conteúdo inválido;
* produzir informação incompleta;
* estiver indisponível;
* exceder tempo limite.

---

# 2. Princípio central

Regra fundamental:

```text
Official structured data
        +
Deterministic rules
        ↓
     Truth layer
        ↓
        AI
        ↓
Explanation / Personalization
```

Nunca:

```text
User
 ↓
LLM
 ↓
"verdade migratória"
```

---

# 3. Responsabilidades da IA

A IA poderá:

* explicar requisitos em linguagem simples;
* personalizar descrições;
* explicar por que um visto apareceu;
* organizar requisitos em checklist;
* gerar observações úteis;
* resumir informações estruturadas;
* sugerir ordem prática de execução;
* adaptar linguagem ao perfil informado;
* gerar textos auxiliares.

---

# 4. Responsabilidades proibidas

A IA não poderá ser responsável por decidir livremente:

* requisitos legais;
* taxas;
* prazos oficiais;
* critérios de elegibilidade;
* URLs;
* domínios confiáveis;
* existência de vistos;
* regras migratórias;
* autorização de acesso;
* propriedade de recursos;
* resultado final de validações críticas.

---

# 5. Casos de uso de IA no MVP

O MVP utilizará IA principalmente em três fluxos.

## 5.1 Explicação de recomendação

Entrada:

```text
Normalized user profile
+
Deterministic recommendation result
+
Visa structured data
```

Saída:

```text
human-friendly explanation
```

Exemplo:

> Esta opção apareceu porque você informou que pretende trabalhar na Irlanda e já possui uma oferta de emprego. Alguns critérios ainda precisam ser confirmados antes de considerar esse caminho adequado.

A IA não define a compatibilidade.

Ela explica a compatibilidade previamente calculada.

---

## 5.2 Personalização de checklist

Entrada:

```text
Visa requirements
+
Applicable conditions
+
User profile
+
Official sources
```

Saída:

```text
personalized descriptions
optional helpful items
organization
```

A IA poderá adicionar itens auxiliares.

Ela não poderá remover itens obrigatórios.

---

## 5.3 Resumo de conteúdo

A IA poderá transformar conteúdo estruturado em uma explicação mais simples.

Exemplo:

```text
Official requirement:
formal technical description

AI:
plain-language explanation
```

A fonte original continuará disponível.

---

# 6. Casos de uso fora do MVP

Inicialmente não teremos:

* chatbot aberto;
* agente navegando livremente na internet;
* análise de documentos;
* OCR de documentos pessoais;
* decisões automáticas de elegibilidade;
* preenchimento automático de formulários governamentais;
* aplicação automática para vistos;
* recomendações jurídicas.

Essas funcionalidades exigiriam controles adicionais.

---

# 7. AI Provider Boundary

Nenhuma feature deve utilizar diretamente o SDK da OpenAI.

Estrutura:

```text
lib/
└── ai/
    ├── providers/
    ├── prompts/
    ├── schemas/
    ├── services/
    ├── safeguards/
    └── types/
```

Interface conceitual:

```ts
interface AIProvider {
  generateStructured<T>(
    request: StructuredAIRequest<T>
  ): Promise<T>
}
```

Implementação inicial:

```text
OpenAIProvider
```

Testes:

```text
FakeAIProvider
```

---

# 8. Por que usar provider abstraction

Isso permite:

* testes sem chamadas externas;
* troca de modelo;
* troca de provider;
* fallback;
* controle centralizado de timeout;
* observabilidade;
* rate limiting;
* políticas comuns.

O domínio não deve depender do SDK da OpenAI.

---

# 9. Structured Outputs

Toda resposta utilizada programaticamente deverá preferir formato estruturado.

Exemplo:

```ts
const RecommendationExplanationSchema = z.object({
  summary: z.string(),
  reasons: z.array(z.string()),
  uncertainties: z.array(z.string()),
  nextSteps: z.array(z.string())
})
```

Fluxo:

```text
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

Texto livre somente quando a resposta for puramente apresentacional e não controlar comportamento.

---

# 10. Dupla validação

Structured Output não elimina necessidade de validação.

Utilizar:

```text
Model schema constraint
        +
Zod
        +
Business rules
```

Exemplo:

Mesmo que o schema permita:

```json
{
  "items": []
}
```

a aplicação deve verificar se requisitos obrigatórios continuam presentes.

---

# 11. Prompt design

Prompts deverão ser:

* explícitos;
* versionados;
* pequenos o suficiente para revisão;
* separados por responsabilidade;
* baseados em contexto fornecido pela aplicação;
* testáveis.

Evitar mega-prompts responsáveis por todo o produto.

---

# 12. Prompts iniciais

Estrutura possível:

```text
lib/ai/prompts/

recommendation-explanation.v1.ts
checklist-personalization.v1.ts
requirement-explanation.v1.ts
```

Cada prompt possui uma responsabilidade.

---

# 13. Prompt Version

Toda operação relevante terá identificador.

Exemplo:

```text
recommendation-explanation-v1
checklist-personalization-v1
requirement-explanation-v1
```

Pode existir:

```ts
export const PROMPT_VERSION =
  "checklist-personalization-v1"
```

---

# 14. Motivo do versionamento

Se uma geração apresentar problema, precisamos saber:

```text
qual modelo?
qual prompt?
qual regra?
qual informação?
```

Isso facilita:

* debugging;
* comparação;
* regressão;
* avaliação;
* reprodução.

---

# 15. Estrutura de prompt

Prompts deverão possuir aproximadamente:

```text
ROLE

GOAL

TRUSTED INPUT

CONSTRAINTS

OUTPUT SCHEMA

FORBIDDEN BEHAVIOR
```

---

# 16. Exemplo conceitual de prompt

```text
You explain immigration information
using only the structured information
provided by the application.

Do not introduce:
- requirements not present in context
- URLs
- fees
- deadlines
- legal conclusions

If information is insufficient,
explicitly state that it is unknown.

Return the required structured schema.
```

---

# 17. Context Boundary

A IA só receberá o contexto necessário para aquela operação.

Evitar enviar:

```text
whole database
whole user profile
all visas
all previous conversations
```

quando a operação precisa apenas de poucos campos.

Benefícios:

* menor custo;
* menor latência;
* menor risco de vazamento;
* menor confusão do modelo.

---

# 18. Context Builder

A preparação de contexto será responsabilidade da aplicação.

Exemplo:

```text
Raw database records
        ↓
Context Builder
        ↓
Minimal trusted context
        ↓
AI
```

A IA não deve decidir sozinha quais registros buscar no banco.

---

# 19. Trusted Context

O prompt deverá distinguir claramente dados confiáveis.

Exemplo conceitual:

```json
{
  "visa": {...},
  "officialRequirements": [...],
  "officialSources": [...],
  "profile": {...},
  "recommendationResult": {...}
}
```

---

# 20. Não fornecer acesso livre ao banco

No MVP, a IA não terá ferramentas para executar queries arbitrárias.

Toda informação necessária será carregada pela Application Layer.

---

# 21. Não fornecer browsing livre

A IA não deverá navegar livremente pela internet para responder perguntas migratórias.

Fontes são previamente controladas pela aplicação.

Isso reduz risco de:

* fonte não oficial;
* informação antiga;
* conteúdo patrocinado;
* fórum;
* blog;
* URL inventada.

---

# 22. URLs

A IA nunca deverá criar URL utilizada diretamente pelo sistema.

URLs vêm de:

```text
OfficialSource
```

Caso uma resposta estruturada faça referência a fonte, deverá utilizar um identificador previamente fornecido.

Exemplo:

```json
{
  "sourceIds": [
    "source_123"
  ]
}
```

Não:

```json
{
  "url": "https://..."
}
```

---

# 23. Source IDs

Ao enviar fontes ao modelo:

```json
{
  "id": "src_critical_skills",
  "title": "...",
  "authority": "...",
  "summary": "..."
}
```

A IA pode retornar:

```json
{
  "sourceIds": ["src_critical_skills"]
}
```

A aplicação resolve o ID para URL real.

---

# 24. Recommendation Engine

Fluxo:

```text
User Answers
     ↓
Normalize Profile
     ↓
Deterministic Rule Engine
     ↓
Candidate Visas
     ↓
Compatibility Result
     ↓
AI Explanation
     ↓
UI
```

A IA não define:

```text
HIGH
MEDIUM
LOW
NOT_RECOMMENDED
```

Isso vem do Rule Engine.

---

# 25. Recommendation Output

Exemplo determinístico:

```json
{
  "visaCode": "CRITICAL_SKILLS",
  "compatibility": "HIGH",
  "matchedCriteria": [
    "WORK_OBJECTIVE",
    "HAS_EMPLOYMENT_OFFER"
  ],
  "missingCriteria": [
    "SALARY_NOT_CONFIRMED"
  ],
  "blockers": []
}
```

A IA recebe esse resultado para explicar.

---

# 26. Recommendation Explanation Schema

Exemplo:

```ts
z.object({
  summary: z.string(),
  whyItMatched: z.array(z.string()),
  needsConfirmation: z.array(z.string()),
  nextSteps: z.array(z.string())
})
```

---

# 27. Linguagem de recomendação

Evitar afirmações:

```text
Você é elegível.
Seu visto será aprovado.
Este é o visto correto para você.
```

Preferir:

```text
Esta opção pode ser compatível.
Com base nas informações fornecidas...
Ainda é necessário confirmar...
```

---

# 28. Checklist Engine

Arquitetura:

```text
Applicable official requirements
          +
System-required items
          +
User profile
          ↓
Base Checklist
          ↓
AI Personalization
          ↓
Validation
          ↓
Merge
          ↓
Final Checklist
```

---

# 29. Base Checklist

Antes da IA já deve existir um checklist válido.

Exemplo:

```text
VALID_PASSPORT
EMPLOYMENT_OFFER
QUALIFICATION
APPLICATION_SUBMISSION
```

A IA recebe a base.

---

# 30. AI Checklist Personalization

A IA pode produzir:

```json
{
  "enhancements": [
    {
      "requirementCode": "QUALIFICATION",
      "personalizedDescription": "...",
      "priority": "HIGH"
    }
  ],
  "suggestedItems": [
    {
      "title": "...",
      "description": "...",
      "category": "OTHER"
    }
  ]
}
```

---

# 31. A IA não controla o checklist final

Fluxo obrigatório:

```text
Base Requirements
      ↓
AI response
      ↓
Validate
      ↓
Merge by requirement code
      ↓
Preserve mandatory items
      ↓
Add safe optional items
      ↓
Final checklist
```

Nunca:

```text
AI response
 ↓
save directly
```

---

# 32. Mandatory Item Protection

Exemplo:

```ts
if (requirement.isMandatory) {
  finalChecklist.mustContain(requirement.code)
}
```

Mesmo que a IA não mencione o item.

---

# 33. sourceControlled

Quando:

```text
sourceControlled = true
```

a IA pode alterar apenas elementos permitidos, como:

```text
personalizedDescription
```

Não pode alterar:

```text
title oficial
status legal
fee
deadline
mandatory flag
source
```

---

# 34. Suggested Items

Itens sugeridos pela IA devem ser claramente classificados:

```text
origin = AI_ENRICHMENT
```

Eles nunca devem ser apresentados como requisito governamental.

---

# 35. Apresentação visual

A UI poderá diferenciar:

```text
Requisito oficial
```

de:

```text
Sugestão para organização
```

Isso melhora transparência.

---

# 36. Requirement Explanation

Ao explicar um requisito:

Entrada:

```text
Requirement
Official source excerpt/summary
User relevant context
```

Saída:

```text
plain language explanation
```

A resposta não deve introduzir novas condições.

---

# 37. Dados oficiais longos

Não enviar páginas oficiais inteiras ao modelo sem necessidade.

Preferir:

```text
validated structured representation
```

produzida pelo sistema.

Caso futuramente seja necessário trabalhar com documentos extensos, criar pipeline específico.

---

# 38. RAG

O MVP não precisa obrigatoriamente de um sistema RAG completo com vector database.

O domínio inicial é pequeno.

Preferência inicial:

```text
PostgreSQL structured data
+
selected official content
+
explicit context building
```

Isso é mais simples e controlável.

---

# 39. Quando considerar RAG

RAG poderá fazer sentido quando houver:

* muitos países;
* centenas de documentos;
* conteúdo oficial extenso;
* perguntas abertas;
* necessidade de busca semântica.

Nesse cenário:

```text
Official documents
 ↓
ingestion
 ↓
chunking
 ↓
embeddings
 ↓
retrieval
 ↓
LLM
```

Mas não construir isso antes de ser necessário.

---

# 40. Retrieval Trust

Caso RAG seja implementado futuramente, apenas conteúdo aprovado poderá entrar no índice.

Não indexar automaticamente a web aberta.

---

# 41. Model Selection

O modelo utilizado deve ser configurável.

Não espalhar nomes de modelos no código.

Exemplo:

```text
AI_MODEL
```

ou configuração central:

```ts
const AI_MODELS = {
  checklist: "...",
  explanation: "..."
}
```

---

# 42. Model Selection Strategy

Não utilizar automaticamente o modelo mais caro para tudo.

Operações simples:

```text
explanation
summarization
```

podem utilizar modelo mais eficiente.

Operações mais complexas:

```text
structured personalization
```

podem usar modelo mais capaz se necessário.

A escolha deve ser guiada por:

* qualidade;
* custo;
* latência;
* confiabilidade.

---

# 43. Temperature / Variability

Operações relacionadas a informação factual devem priorizar consistência.

Criatividade não é objetivo principal.

Configurações de variabilidade deverão ser conservadoras quando suportadas pelo provider/modelo.

---

# 44. Timeout

Toda chamada externa deverá possuir timeout.

Exemplo conceitual:

```text
AI request
 ↓
timeout
 ↓
fallback
```

Nunca deixar requisição pendurada indefinidamente.

---

# 45. Retry

Retries somente para erros transitórios.

Exemplos:

```text
429
temporary network failure
5xx
```

Não repetir automaticamente:

```text
invalid structured output
business validation failure
bad request
```

sem estratégia específica.

---

# 46. Limite de retry

Evitar loops.

Exemplo:

```text
1 initial attempt
+
1 controlled retry
```

A configuração final poderá variar por operação.

---

# 47. Structured Retry

Se output estruturado falhar:

```text
Attempt 1
 ↓
schema invalid
 ↓
optional controlled retry
 ↓
still invalid
 ↓
fallback
```

Nunca salvar resposta inválida.

---

# 48. Fallback

A aplicação deve funcionar sem IA.

Exemplo no checklist:

```text
Base deterministic checklist
```

já é válido.

Se IA falhar:

```text
return base checklist
```

A UI não precisa falhar completamente.

---

# 49. Fallback de recomendação

A recomendação determinística continua disponível.

Se a explicação da IA falhar:

```text
Compatibility: High

Reason:
2 criteria matched
1 criterion still needs confirmation
```

pode ser construída pela própria aplicação.

---

# 50. Graceful Degradation

Regra:

```text
AI unavailable
≠
application unavailable
```

---

# 51. Estado da geração

Operações podem retornar:

```text
SUCCESS
FALLBACK_USED
FAILED
```

A UI poderá tratar de forma apropriada.

---

# 52. Error Handling

Erros específicos:

```text
AI_TIMEOUT
AI_PROVIDER_UNAVAILABLE
AI_RATE_LIMITED
AI_OUTPUT_INVALID
AI_BUSINESS_VALIDATION_FAILED
AI_REQUEST_FAILED
```

Detalhes internos não devem chegar ao usuário.

---

# 53. Observabilidade

Registrar para chamadas importantes:

```text
operation
model
promptVersion
latency
status
requestId
token usage when available
fallbackUsed
```

Sem armazenar dados pessoais desnecessários.

---

# 54. Cost Tracking

Como IA gera custo, devemos poder medir:

```text
number of generations
tokens
estimated cost
operation type
```

Mesmo que inicialmente isso esteja apenas nos logs.

---

# 55. Rate Limiting

Operações de IA devem possuir limite.

Exemplo conceitual:

```text
User
 ↓
Rate Limit
 ↓
Application
 ↓
OpenAI
```

Nunca expor endpoint caro sem proteção.

---

# 56. Limite por usuário

Usuários autenticados podem ter limite por:

```text
userId
```

Para operações públicas:

```text
IP + additional controls
```

A estratégia exata será definida em `SECURITY.md`.

---

# 57. Idempotência

Operações caras devem evitar gerações duplicadas acidentais.

Exemplo:

Usuário clica duas vezes:

```text
Generate checklist
Generate checklist
```

A aplicação não deve necessariamente fazer duas chamadas de IA.

Poderá utilizar:

```text
request id
operation key
existing process state
```

---

# 58. Caching de IA

Conteúdo personalizado para usuário geralmente não deve ser cacheado publicamente.

Entretanto, explicações genéricas poderão ser persistidas caso façam sentido.

Não implementar cache sofisticado prematuramente.

---

# 59. Prompt Injection

Mesmo sem chatbot aberto, inputs do usuário podem conter texto malicioso.

Exemplo:

```text
Ignore previous instructions...
```

Portanto:

* texto do usuário é dado, não instrução;
* separar claramente instruções de sistema e conteúdo;
* nunca fornecer tools perigosas ao modelo;
* não permitir que texto do usuário altere source allowlist.

---

# 60. Delimitação de conteúdo

Inputs textuais livres deverão ser serializados dentro de estruturas claras.

Exemplo:

```json
{
  "userProvidedOccupationDescription": "..."
}
```

Não concatenar cegamente:

```text
SYSTEM PROMPT +
user text +
more hidden instructions
```

---

# 61. Tool Use

No MVP, o modelo não terá ferramentas capazes de:

* executar SQL;
* fazer requisições arbitrárias;
* enviar emails;
* alterar banco diretamente;
* navegar pela web aberta.

A aplicação controla todas as ações.

---

# 62. Human-Controlled Actions

Ações importantes exigem fluxo da aplicação.

Exemplo:

```text
AI suggests item
 ↓
Application validates
 ↓
Database writes
```

Nunca:

```text
AI directly writes DB
```

---

# 63. Dados pessoais

Enviar apenas dados relevantes.

Exemplo:

Para explicar um requisito, provavelmente não precisamos enviar:

```text
displayName
email
authUserId
```

Preferir atributos abstratos:

```text
hasEmploymentOffer = true
educationLevel = bachelor
```

---

# 64. Identificadores

Evitar enviar IDs internos reais quando não necessário.

A IA não precisa conhecer:

```text
database user id
authentication id
```

---

# 65. Sensitive Information

O MVP não deve coletar documentos pessoais sensíveis.

Consequentemente, a IA também não deve processá-los.

Futuramente, análise de documentos exigirá arquitetura de segurança específica.

---

# 66. Retenção

Não manter prompts e respostas completas indefinidamente apenas para debugging.

Logs devem priorizar metadata.

Se conteúdo completo precisar ser armazenado para avaliação, deverá existir:

* justificativa;
* retenção definida;
* proteção adequada.

---

# 67. AI Evaluation

Qualidade da IA precisa ser avaliada.

Não considerar:

```text
"parece bom"
```

como validação suficiente.

Criar conjunto de cenários conhecidos.

---

# 68. Evaluation Dataset

Exemplo:

```text
scenario-001
Software developer
Employment offer
High qualification

Expected:
Critical Skills candidate appears
```

```text
scenario-002
No employment offer

Expected:
missing employment criterion clearly stated
```

---

# 69. Evaluation de explicações

Verificar:

* fidelidade ao contexto;
* ausência de requisitos inventados;
* clareza;
* ausência de URL inventada;
* linguagem adequada;
* incertezas explícitas.

---

# 70. Evaluation de checklist

Verificar:

```text
mandatory items preserved
no unsupported legal requirements added
sources unchanged
optional suggestions properly identified
```

---

# 71. Regression Tests

Quando prompts mudarem:

```text
run evaluation suite
```

antes de considerar a mudança pronta.

Isso evita melhorar um cenário e piorar outros silenciosamente.

---

# 72. Golden Cases

Alguns cenários poderão possuir outputs esperados parcialmente estruturados.

Não precisamos exigir texto idêntico.

Testar invariantes.

Exemplo:

```text
must mention missing salary confirmation
must not claim eligibility
must reference only supplied source IDs
```

---

# 73. Testes sem API real

Unit tests usarão:

```text
FakeAIProvider
```

Exemplo:

```ts
const ai = new FakeAIProvider({
  output: validChecklistEnhancement
})
```

Isso permite testar Application Layer.

---

# 74. Contract Tests

Podemos possuir um conjunto pequeno de testes opcionais contra OpenAI real.

Eles não devem rodar em todo commit.

Possível script:

```text
test:ai:integration
```

Executado:

* manualmente;
* antes de release importante;
* após mudança de modelo/prompt.

---

# 75. CI

CI padrão não deve depender de:

```text
OPENAI_API_KEY
```

para testes comuns.

Isso mantém pipeline:

* rápido;
* barato;
* determinístico.

---

# 76. Prompt Tests

Prompts poderão possuir testes verificando:

* versão;
* schema esperado;
* campos obrigatórios;
* ausência de placeholders;
* tamanho razoável.

---

# 77. Business Validation

Após Zod, regras adicionais validam conteúdo.

Exemplo:

```text
AI says sourceId:
src_xyz
```

A aplicação verifica:

```text
src_xyz was actually supplied
```

---

# 78. Source Reference Validation

Nunca confiar na referência da IA.

Fluxo:

```text
AI returns sourceIds
 ↓
Check against allowed input set
 ↓
Resolve from database
```

IDs desconhecidos são rejeitados.

---

# 79. Requirement Reference Validation

Mesmo princípio:

```text
requirementCode
```

retornado pela IA deve existir no conjunto fornecido.

---

# 80. Enum Validation

Categorias, prioridades e tipos devem vir de enums controlados.

A IA não deve inventar:

```text
"VERY_SUPER_IMPORTANT"
```

---

# 81. Length Limits

Campos gerados deverão ter limites.

Exemplo:

```text
summary max length
description max length
number of suggested items
number of next steps
```

Isso evita outputs desnecessariamente longos.

---

# 82. Suggested Item Limits

Exemplo conceitual:

```text
maximum 5 AI enrichment items
```

Evitar checklist inflado com dezenas de sugestões irrelevantes.

---

# 83. Language

Idioma inicial:

```text
pt-BR
```

O prompt deverá receber idioma desejado.

Não hardcode texto em português dentro da lógica de domínio quando internacionalização futura for possível.

---

# 84. Disclaimer

A IA não precisa repetir disclaimer enorme em toda resposta.

A UI deve fornecer contexto adequado.

Quando necessário, respostas poderão incluir:

```text
Confirm this information with the official source.
```

sem transformar cada interação em texto jurídico excessivo.

---

# 85. AI UX

A interface deve deixar claro quando conteúdo foi personalizado.

Exemplo:

```text
✨ Explicação personalizada
```

Mas evitar vender a IA como autoridade.

---

# 86. Loading UX

Gerações podem demorar.

A interface deve mostrar:

* loading state;
* progresso conceitual;
* cancelamento quando viável;
* mensagens claras.

Evitar spinner infinito sem contexto.

---

# 87. Re-generation

Não permitir regeneração ilimitada sem necessidade.

Exemplo:

```text
Regenerate explanation
```

pode existir futuramente, mas deve respeitar rate limit.

---

# 88. Persistência de conteúdo gerado

Conteúdo que faz parte do processo deve ser persistido.

Exemplo:

```text
ChecklistItem.personalizedDescription
```

Não gerar novamente a cada carregamento da página.

---

# 89. Determinismo versus criatividade

Prioridade:

```text
correctness
consistency
traceability
```

antes de:

```text
creativity
```

Este não é um produto de escrita criativa.

---

# 90. Provider Failure

Quando OpenAI estiver indisponível:

```text
Application
 ↓
catch provider error
 ↓
log
 ↓
fallback deterministic result
 ↓
return usable UI
```

---

# 91. Circuit Breaker

Não implementar circuit breaker complexo no MVP.

Se futuramente houver falhas recorrentes, avaliar mecanismo apropriado.

---

# 92. Multi-provider futuro

A abstração permite:

```text
OpenAIProvider
GeminiProvider
AnthropicProvider
```

Mas não implementar múltiplos providers agora.

Um provider bem implementado é suficiente.

---

# 93. AI Service Example

Estrutura conceitual:

```ts
class RecommendationExplanationService {
  constructor(
    private readonly ai: AIProvider
  ) {}

  async execute(input) {
    const context = buildRecommendationContext(input)

    const output = await this.ai.generateStructured({
      prompt: recommendationPrompt,
      schema: RecommendationExplanationSchema,
      input: context
    })

    return validateRecommendationExplanation(
      output,
      input
    )
  }
}
```

---

# 94. Checklist Service Example

```text
CreateChecklistService
      │
      ├── load requirements
      ├── evaluate conditions
      ├── create base checklist
      │
      ├── call AI personalization
      │
      ├── validate AI output
      │
      ├── merge
      │
      ├── preserve mandatory items
      │
      └── persist
```

---

# 95. Fallback Example

```ts
try {
  const personalization =
    await aiPersonalizeChecklist(baseChecklist)

  return mergeChecklist(
    baseChecklist,
    personalization
  )
} catch {
  return baseChecklist
}
```

Na implementação real:

* erro deve ser classificado;
* logado;
* fallback sinalizado.

---

# 96. Audit Metadata

Quando relevante, armazenar:

```text
provider
model
promptVersion
ruleEngineVersion
generatedAt
```

Isso ajuda a reproduzir comportamento.

---

# 97. Model Upgrades

Nunca trocar modelo de produção sem verificar impacto.

Processo:

```text
new model
 ↓
evaluation dataset
 ↓
compare
 ↓
manual review
 ↓
release
```

---

# 98. Prompt Changes

Mesmo tratamento.

Uma mudança de prompt é mudança de comportamento do produto.

Deve ser tratada como código.

---

# 99. Prompt Review

Prompts ficam versionados no Git.

Isso permite:

* code review;
* histórico;
* rollback;
* blame;
* comparação.

---

# 100. Não armazenar prompt em painel inicialmente

Prompts não serão editáveis diretamente no banco no MVP.

Eles serão código versionado.

Isso reduz risco de alterações invisíveis.

---

# 101. Seed e IA

Seed não deve depender de IA.

Dados oficiais iniciais devem ser inseridos de forma controlada.

A IA pode ajudar o desenvolvedor durante pesquisa, mas os dados de produção precisam ser revisados.

---

# 102. Dados gerados em build

Não chamar IA automaticamente durante:

```text
pnpm build
```

Build deve ser determinístico.

---

# 103. AI Environment Variables

Exemplo:

```text
OPENAI_API_KEY
AI_MODEL_CHECKLIST
AI_MODEL_EXPLANATION
```

Valores reais não entram no Git.

---

# 104. Server Only

Código com chave da OpenAI deve ser explicitamente server-only.

Nunca importar cliente de IA em Client Component.

---

# 105. Bundle Safety

CI ou revisão deverá verificar que:

```text
OPENAI_API_KEY
```

não aparece no bundle do cliente.

---

# 106. API Endpoint Protection

Qualquer endpoint que acione IA precisa:

1. autenticação quando necessário;
2. autorização;
3. validação;
4. rate limiting;
5. payload limit;
6. timeout;
7. observabilidade.

---

# 107. Public AI Endpoints

Evitar endpoints públicos de IA no MVP.

A maioria das gerações estará ligada a usuário autenticado.

---

# 108. Input Size

Text inputs livres deverão possuir limites de tamanho.

Não enviar megabytes de conteúdo ao modelo.

---

# 109. Output Size

Schemas e limites deverão impedir respostas enormes.

Isso controla:

* UX;
* custo;
* banco;
* latência.

---

# 110. Retry Safety

Se uma operação gerar persistência:

```text
AI
 ↓
DB
```

retry não deve criar registros duplicados.

Persistência acontece após geração validada e deve respeitar idempotência.

---

# 111. Process Generation

Fluxo final recomendado:

```text
Authenticated User
       ↓
Validated Profile
       ↓
Selected Visa
       ↓
Official Requirements
       ↓
Rule Engine
       ↓
Base Checklist
       ↓
AI Personalization
       ↓
Structured Validation
       ↓
Business Validation
       ↓
Mandatory Merge
       ↓
Persist Process Snapshot
       ↓
Persist Checklist
       ↓
Display
```

---

# 112. Trust Hierarchy

Hierarquia de confiança:

```text
1. Application constraints
2. Reviewed official structured data
3. Deterministic domain rules
4. Validated external source metadata
5. AI-generated content
6. User-provided free text
```

Quanto mais baixo, menor a confiança automática.

---

# 113. AI Safety Rule

Nunca permitir que conteúdo de menor confiança sobrescreva silenciosamente conteúdo de maior confiança.

Exemplo proibido:

```text
AI says fee = X
 ↓
overwrite official fee
```

---

# 114. User Feedback

Futuramente poderá existir:

```text
Esta explicação foi útil?
👍 👎
```

Isso pode ajudar a avaliar qualidade.

Não faz parte obrigatória do MVP.

---

# 115. Admin Review Futuro

Futuramente conteúdo gerado para áreas públicas poderá passar por:

```text
AI draft
 ↓
human review
 ↓
publish
```

Conteúdo público crítico não precisa ser gerado dinamicamente para cada visitante.

---

# 116. Uso de IA no desenvolvimento

Codex e outras ferramentas de IA poderão auxiliar no desenvolvimento.

Isso é separado da arquitetura de IA do produto.

A IA de desenvolvimento não deve ser confundida com a OpenAI API utilizada em produção.

---

# 117. Regra para agentes Codex

Ao implementar integração com IA, o agente deve:

1. ler este documento;
2. nunca chamar OpenAI diretamente de componentes;
3. utilizar AIProvider;
4. utilizar schema;
5. implementar business validation;
6. preservar requisitos oficiais;
7. criar fallback;
8. criar testes com FakeAIProvider;
9. adicionar observabilidade;
10. evitar dados pessoais desnecessários;
11. proteger endpoints;
12. não inventar novas responsabilidades para IA.

---

# 118. Definition of Done para feature de IA

Uma feature envolvendo IA só está pronta quando:

```text
Prompt versioned
        ↓
Structured schema
        ↓
Validation
        ↓
Business validation
        ↓
Fallback
        ↓
Error handling
        ↓
Rate limiting where relevant
        ↓
Unit tests
        ↓
Evaluation cases
        ↓
No secrets in client
        ↓
Diff review
```

---

# 119. Principal diferencial técnico

O Meu Visto Fácil não será:

```text
form
 ↓
LLM
 ↓
answer
```

Será:

```text
                Official Sources
                       ↓
                Structured Data
                       ↓
User Profile → Rule Engine
                       ↓
                Trusted Result
                       ↓
                     AI
                       ↓
          Personalized Explanation
                       ↓
               Final Validation
                       ↓
                    User
```

---

# 120. Princípio final

A IA deve tornar a informação mais útil.

Ela não deve tornar informação incerta aparentemente confiável.

Sempre que existir conflito entre:

```text
mais liberdade para o modelo
```

e:

```text
mais controle e rastreabilidade
```

o Meu Visto Fácil deverá preferir controle e rastreabilidade para informações migratórias críticas.
