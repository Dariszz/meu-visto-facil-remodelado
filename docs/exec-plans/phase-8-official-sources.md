# Fase 8 — Rastreabilidade das fontes oficiais

## Goal

Centralizar a política de hosts oficiais e apresentar a identidade, o estado e as datas das fontes já cadastradas, sem realizar validação HTTP.

## Current State

A Fase 7 consulta o registro persistido `OfficialSource`, restringe fontes às relações do visto e do país publicados, omite fontes arquivadas e limita resultados. O schema já contém hostname, autoridade, status, consulta editorial, última tentativa de verificação, último sucesso e código HTTP. A política de links está em `features/visas/safe-source-link.ts`, com dois hosts explícitos. O DTO público e a UI mostram autoridade e consulta editorial, mas não expõem as datas de verificação nem distinguem os estados publicamente.

## Scope

- Manter `OfficialSource` como registro único de fontes; não criar uma segunda lista de URLs.
- Centralizar a allowlist exata dos hosts existentes em `src/features/sources/`, reutilizada pela política de links.
- Preservar HTTPS, correspondência do hostname armazenado e rejeição de credenciais e portas não padrão.
- Expor hostname, última tentativa e último sucesso como metadados públicos; datas de verificação em ISO, preservando horário.
- Mostrar título, autoridade, hostname, status, consulta editorial, última tentativa e último sucesso, com estados explícitos para datas ausentes.
- Usar “Fonte cadastrada” para ACTIVE; cadastro e consulta editorial não significam verificação técnica.
- Manter links externos apenas para fontes ACTIVE com URL aprovada; preservar referências internas e metadados das fontes indisponíveis.

## Non-goals

Validação HTTP/DNS, redirects, jobs, mudanças de schema, operações de banco, publicação de conteúdo, revisão de fatos migratórios, novos hosts, novos vistos e início da Fase 9.

## Implementation Steps

1. Criar política central de hosts e links no domínio de fontes, com testes negativos de correspondência exata e protocolos.
2. Atualizar a projeção do repositório e `CatalogSource` com hostname e datas existentes. Preservar isolamento, publicação, ordenação e limite.
3. Apresentar metadados e status na seção de fontes do Critical Skills, preferindo componente de fontes coeso se a extração simplificar a página.
4. Cobrir apresentação de estados, ausência de datas e distinção entre consulta editorial, tentativa e sucesso. Atualizar testes de integração da projeção.
5. Executar checks relevantes, revisão de código e revisão explícita de segurança da política de links; registrar resultados reais.
6. Atualizar roadmap/contexto com a entrega e manter a Fase 9 não iniciada.

## Files Expected to Change

- `src/features/sources/`: política central e testes; componente/apresentação se necessário.
- `src/features/visas/safe-source-link.ts` e respectivo teste: mover política ou delegar à implementação central sem duplicação.
- `src/features/visas/catalog-types.ts`.
- `src/lib/db/repositories/official-source-repository.ts`.
- `src/features/visas/critical-skills-page.tsx`.
- `src/features/visas/catalog-presentation.ts`, apenas se necessário para formatação/reuso.
- `src/features/visas/catalog-pages.test.tsx` e fixtures afetadas.
- `tests/integration/repositories.test.ts`.
- `docs/ROADMAP.md`, `docs/PROJECT-CONTEXT.md` e documentação de arquitetura/segurança estritamente afetada.

## Data Changes

Nenhuma migration ou escrita de dados. Datas existentes continuam intactas. Campos nulos não recebem datas artificiais. `verificationStatusCode` permanece armazenado e só será incluído na projeção pública se tiver uso concreto na apresentação.

## Security Considerations

A allowlist usa igualdade exata; não autoriza subdomínios por sufixo. Não há requisições externas. URL inválida ou hostname divergente produz ausência de link, sem remover sua rastreabilidade. Não tratar esta política de renderização como proteção completa para futuros requests SSRF. Fontes ARCHIVED permanecem excluídas. Revisão de segurança é obrigatória por envolver URLs.

## Testing

- Unitários: hosts aprovados, domínio desconhecido, domínio parecido, subdomínio não autorizado, localhost/IP, protocolo inválido, credenciais, porta não padrão, URL malformada e hostname armazenado divergente.
- UI: autoridade/host, status ACTIVE sem alegação de verificação, indisponibilidade temporária, BROKEN, datas nulas, tentativa sem sucesso, tentativa posterior ao sucesso e consulta editorial independente.
- Integração: projeção real das datas e hostname, preservação dos filtros e links bloqueados; execução apenas no banco de teste configurado, com fixtures controladas e rollback.
- Gate: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; `pnpm test:integration` quando o ambiente de teste estiver disponível. Registrar qualquer verificação não executada.

## Risks

Confundir cadastro ou consulta editorial com verificação HTTP; perder horário em datas técnicas; ampliar a allowlist acidentalmente; criar fontes duplicadas fora do banco. Evitar inferência de sucesso apenas a partir de ACTIVE.

## Definition of Done

Política central única, metadados persistidos refletidos na UI, estados e datas honestos, referências preservadas, testes relevantes passando, diff revisado, revisão de segurança concluída e documentação coerente. Nenhuma funcionalidade da Fase 9 iniciada.

## Implementação e verificação — 29/09/2026

Implementação concluída com agentes separados de planejamento, desenvolvimento, testes, revisão de código e segurança. `OfficialSource` permanece o registro persistido único. Política em `src/features/sources/source-link-policy.ts`; `OfficialSourceItem` apresenta status, autoridade, hostname e datas. O repositório projeta os campos existentes sem alterar schema ou dados.

- `pnpm lint`: passou.
- `pnpm typecheck`: passou após corrigir inferência de tuplas no teste novo.
- `pnpm test`: 74 testes em 9 arquivos passaram (11 casos adicionais).
- `pnpm build`: passou; rotas de catálogo continuam dinâmicas.
- Testes direcionados: 27 casos em 3 arquivos passaram.
- Revisões independentes com skills `code-review` e `security-review`: sem findings relevantes.

A indisponibilidade inicial do ambiente foi resolvida após o usuário retomar os projetos Supabase. Antes disso, o desenvolvimento retornava `XX000` (tenant/usuário indisponível) e a integração retornava `DATABASE_TEST_MIGRATION_FAILED`. Nenhuma credencial foi exibida e não houve alteração de TLS/permissões nem fallback.

- `pnpm test:integration`: passou após a retomada, com `DATABASE_TEST_MIGRATION_APPLIED` e `DATABASE_INTEGRATION_PASSED`; validação de seed, constraints, repositórios e metadados com fixtures transacionais no banco de teste.
- Smoke no navegador integrado: detalhe Critical Skills carregado do PostgreSQL de desenvolvimento; três fontes com autoridade, hostname e consulta editorial; ausência de verificação técnica representada explicitamente.
- Layout inspecionado em 390/768/1440 px; também conferido em 320 px, sem overflow horizontal nas quatro larguras. Âncoras das referências existem; Enter em Consultar fontes oficiais chega a `#fontes`.
- `git diff --check`: passou.

Status: READY para revisão do usuário, sem findings pendentes. Sem nova migration, publicação ou alteração de dados de desenvolvimento. Sem suíte E2E persistente nem verificação por leitor de tela/outros navegadores nesta fase. Fase 9 não iniciada.
