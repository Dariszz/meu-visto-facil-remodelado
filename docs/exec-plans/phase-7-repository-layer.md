# Goal

Implementar somente a Fase 7: catálogo público lido de PostgreSQL.

# Current State

Fase 6 aprovada pelo usuário neste pedido, sem nova certificação. Alterações locais das fases anteriores preservadas. Schema catalog existente, seed create-only com Critical Skills DRAFT; integração exige schema vazio apesar de migration já aplicada.

# Scope

CountryRepository, VisaRepository e OfficialSourceRepository; cinco rotas públicas; publicação limitada em desenvolvimento; testes reais e UI.

# Non-goals

Fases 8/9, HTTP de fontes, auth, IA, novos vistos detalhados, produção, deploy, upgrades e modelagem editorial genérica.

# Proposed Architecture

Módulos server-only em lib/db/repositories, Prisma selecionando projeções mínimas, contratos em features/visas. Server Components chamam consultas diretamente. connection() antes de leituras impede acesso ao banco durante prerender/build, sem cache persistente. Referência: https://nextjs.org/docs/app/api-reference/functions/connection (Next 16.3.4).

Inventário: banco fornece país (nome/código/slug), nome e slug da categoria de vistos publicados, nomes/descrições do visto, requisitos com códigos/ordem e vínculos, fontes com títulos/autoridades/URLs/datas editoriais. Permanecem locais: introduções das categorias, cartões de navegação, General Employment em breve, público potencial, atributos, distinções de permissões, etapas e disclaimer. Conteúdo local associado ao slug de Critical Skills e IDs estáveis das fontes. Fatos persistidos ficam somente no seed histórico e fixtures, nunca como fallback de runtime.

Consultas públicas exigem Country ACTIVE e Visa ACTIVE. COMING_SOON/DISABLED não disponibilizam suas páginas ou vistos. Fontes ARCHIVED não aparecem; fontes temporariamente indisponíveis/BROKEN mantêm título e estado sem link. URLs só são clicáveis com HTTPS, hosts exatos já usados no catálogo, sem credenciais/porta alternativa. Nenhum HTTP. Fontes devem pertencer ao mesmo país e estar ligadas a visto publicado ou seus requisitos. Listas limitadas e ordenadas por nome/slug, sortOrder/code, ID; detalhe carrega vínculos em consultas de quantidade constante, sem N+1.

Ausência/não publicação resulta em notFound; falhas viram erro seguro com tentativa novamente, nunca catálogo local. Categorias vazias mantêm estado editorial. Metadata e layout preservados.

# Implementation Steps

1. Implementar contratos, repositórios e composição editorial.
2. Conectar rotas e estados; adaptar testes de UI para contratos controlados e componentes síncronos.
3. Tornar migrations de teste repetíveis e fixtures transacionais; cobrir filtros, isolamento e vínculos.
4. Procedimento transacional explícito verifica consistência do registro de desenvolvimento antes de mudar apenas DRAFT para ACTIVE. Seed permanece create-only/DRAFT; nenhuma migration necessária.
5. Testar, revisar código e segurança, verificar gate final e navegador.
6. Atualizar documentação e parar para revisão.

# Files Expected to Change

src/lib/db/repositories, src/features/visas, src/app/ireland, prisma/seed-data, scripts, tests/integration, documentação e package.json (script de publicação).

# Data Changes

Sem alteração de schema/migration. Preparar apenas Critical Skills do desenvolvimento; preservar dados editoriais não relacionados. Não representa aprovação para produção. Reexecução não reativa ARCHIVED nem sobrescreve fatos.

# Security Considerations

REQUIRED: revisão de publicação, links, consultas e fronteiras server-only. Runtime usa exclusivamente DATABASE_URL de leitura. DIRECT_URL apenas no procedimento CLI autorizado. TLS e confirmação do alvo de testes preservados. Erros internos não retornam ao browser nem são registrados em bruto.

# Testing

PostgreSQL isolado com rollback: países, ausência, status, mesmo slug em países diferentes, ordenação, vínculos e projeção de dados reais para apresentação. UI sem banco: conteúdo, navegação, vazios, erros/recuperação. Gate: db:validate, db:generate, lint, typecheck, test, test:integration, build. Navegador em celular/tablet/desktop, breadcrumbs e teclado.

# Risks

Dados de desenvolvimento não certificados para produção. Conteúdo editorial requer manutenção conjunta com fontes. Build independente não comprova disponibilidade do runtime; testar leitura com papel dedicado.

# Definition of Done

Escopo completo, verificações executadas, revisões sem findings relevantes, resultados registrados, Fase 8 não iniciada.

# Results — 10/09/2026

**READY — somente Fase 7 concluída, aguardando revisão do usuário.** Fase 8 não iniciada.

## Implementação

- Repositórios coesos em `src/lib/db/repositories/{country,visa,official-source}-repository.ts`; contratos em `src/features/visas/catalog-types.ts`, composição async em `catalog-pages.tsx` e projeção editorial em `catalog-presentation.ts`. Prisma e ambiente permanecem em infraestrutura server-only.
- `/ireland`, `/ireland/work`, `/ireland/study`, `/ireland/family` e detalhe de Critical Skills usam consultas reais. País não ACTIVE ou visto não ACTIVE resulta em ausência/notFound. Fontes arquivadas e fontes de outro país são excluídas; demais fontes indisponíveis mantêm texto sem link. Requisitos preservam seus vínculos PRIMARY/SUPPORTING; vínculos do visto preservam relationType.
- Nome/descrição/resumo/requisitos/fontes não têm fallback local. Conteúdo complementar editorial ficou separado; snapshot histórico da Fase 5 movido para `prisma/seed-data/critical-skills.ts`, usado somente por seed, publicação e fixtures de testes.
- Ordenação por nome/slug, sortOrder/code, título/ID. Limites: 50 vistos, 200 requisitos, 20 fontes por requisito, 50 referências diretas, 100 fontes distintas. Detalhes/fontes detectam excesso com registro adicional e falham de forma segura. Sem N+1 por requisito, APIs internas, HTTP de fontes ou novo cache.
- Estados de carregamento, vazio, erro com retry e not-found adicionados. Metadata e layout preservados. Datas agora vêm individualmente de cada fonte, sem confundir consulta editorial com verificação automática.

## Dados de desenvolvimento

`pnpm db:publish:development --confirm-development` executado após conferência transacional do conteúdo aprovado: `DRAFT_TO_ACTIVE`. Alterou somente status e shortDescription de `seed-visa-ie-critical-skills`; o resumo corresponde ao cartão de Trabalho aprovado anteriormente. Segunda execução: `ALREADY_ACTIVE`, sem escrita. Demais registros preservados. Seed continua create-only/DRAFT. Nenhuma alteração de schema ou migration; nenhuma operação em produção.

A publicação exige NODE_ENV diferente de production, DB_SEED_CONFIRM=development e confirmação explícita CLI. Divergências em dados esperados abortam a operação. A confirmação é operacional, não detecção automática do propósito do projeto Supabase. Não constitui aprovação de conteúdo para produção.

## Testes e comandos

| Comando | Resultado |
| --- | --- |
| `pnpm db:validate` | Passou |
| `pnpm db:generate` | Passou; Prisma 7.10.0 |
| `pnpm lint` | Passou |
| `pnpm typecheck` | Passou |
| `pnpm test` | 63 testes em 8 arquivos, todos aprovados |
| `pnpm test:integration` | Passou duas vezes no projeto TESTE já migrado; três casos transacionais |
| `pnpm build` | Passou com DATABASE_URL propositalmente inválida no processo; cinco rotas dinâmicas, sem conexão durante build |
| `git diff --check` | Passou |

Integração: mantém confirmação exata do alvo; migrate deploy repetível, fixtures em transações revertidas, nenhum DROP/TRUNCATE/reset. Casos cobrem seed/constraints anteriores, país ausente/inativo, DRAFT/ARCHIVED, isolamento por país/slug, ordem, relações de requisitos e fontes, fontes estrangeiras/arquivadas/indisponíveis, URL insegura, limite de requisitos e publicação repetível/divergente. O contrato retornado pelo PostgreSQL passa pelo mapper real usado pela página e preserva valores sentinela de nome/descrição/requisitos/autoridade. UI verifica a composição async por await e renderiza sua saída síncrona com contratos controlados, sem conexão.

Durante desenvolvimento: 27 testes direcionados de UI/links passaram; após revisão, 18 testes direcionados de composição/links/erros passaram. Typecheck inicial apontou import ausente e URL nullable durante a adaptação; corrigidos. Lint apontou componente Reference definido dentro do render; movido para escopo de módulo, sem desabilitar regras. Invocação `pnpm exec prettier` não encontrou o binário; formatação dos arquivos afetados executada pelo entrypoint local instalado.

O sandbox bloqueou o tsx da CLI de publicação antes da conexão; reexecução autorizada fora do sandbox passou. Servidor restrito também apresentou erro seguro ao ler o banco; após reinício autorizado fora do sandbox, leitura e navegação passaram. Não foi enfraquecido TLS ou permissão. A CLI emitiu aviso de depreciação de consultas concorrentes na combinação atual Prisma/pg; não houve falha nem upgrade fora do escopo.

## Code Review

Revisão com skill code-review sobre arquivos da Fase 7 e dependências diretas; alterações anteriores preservadas. Corrigidos: risco de corte silencioso de requisitos/referências nos limites e rótulo de apresentação fixado em trabalho para outras categorias. Regressão de limite coberta em PostgreSQL real. Revisão final sem findings CRITICAL/HIGH/MEDIUM pendentes. Não criada revisão por subagente; mudança de perspectiva realizada no mesmo fluxo.

## Security Review — REQUIRED

Skill security-review aplicada a consultas, publicação, URLs e fronteiras. Conferidos status ACTIVE em país/visto, fonte do mesmo país vinculada ao visto ou requisito, parâmetros validados, selects limitados, URLs HTTPS de hosts exatos sem credenciais/porta alternativa, nenhuma requisição externa de validação, erros/logs sem detalhes internos e nenhum import de configuração/Prisma pelo browser. Sem vulnerabilidade relevante pendente identificada.

Auditoria read-only por DATABASE_URL confirmou `mvf_catalog_reader`, SELECT permitido, INSERT/UPDATE/DELETE/TRUNCATE negados em Visa, TLS ativo e um visto publicado. Script temporário de auditoria removido. Aplicação iniciou com essa conexão e exibiu catálogo real. DIRECT_URL não é lida pelas páginas.

## Navegador

Smoke no navegador integrado: Home → Irlanda → Trabalho → Critical Skills; retorno por breadcrumbs; Estudo e Família mantêm estado em breve; General Employment continua sem detalhe. Cinco rotas sem overflow horizontal em 320, 768 e 1440 px. Detalhe também inspecionado em 390 px, com screenshots completos de celular/tablet/desktop. Enter abriu links e âncora de requisitos; skip link levou foco a main-content; Tab e anel de foco visível conferidos. Datas e três links oficiais presentes, referências levam às respectivas âncoras. Nenhum dado de desenvolvimento foi alterado para simular falhas.

## Limitações

Sem suíte E2E persistente instalada: smoke feito pelo navegador. Outros engines/navegadores e leitor de tela não foram testados. Sem nova pesquisa jurídica, verificação HTTP de URLs, certificação de produção ou deploy. Catálogo acima dos limites precisará de paginação revisada. Dados complementares continuam editoriais locais e exigem manutenção coordenada com suas fontes. Configuração completa da Data API não foi reauditada nesta fase; não foi alterada.
