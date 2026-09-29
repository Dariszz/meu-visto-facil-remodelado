# Fase 9 — Validação segura de URLs oficiais

## Goal

Implementar `validateOfficialSourceUrl()` no servidor para verificar disponibilidade técnica de fontes cadastradas, com proteção SSRF, resultado estruturado e metadados persistidos. Concluir somente a Fase 9.

## Current State

A Fase 8 centralizou HTTPS, allowlist exata (`enterprise.gov.ie` e `www.irishimmigration.ie`) e correspondência do hostname em `src/features/sources/source-link-policy.ts`. Essa política serve à apresentação e ainda não faz HTTP ou DNS. `OfficialSource` já armazena status, consulta editorial, última tentativa, último sucesso e código HTTP. A UI apresenta as datas separadamente e somente expõe links ACTIVE. Não há operação pública de verificação. O schema ainda não contém URL resolvida e duração, exigidas por `SECURITY.md`, seção 56.

## Scope

- Reutilizar a política central sem ampliar hosts; validar URL, hostname armazenado, HTTPS, credenciais, porta padrão e limites de entrada.
- Resolver DNS e rejeitar IPs privados, locais, reservados, multicast ou de tradução/túnel inseguros. Rejeitar a resolução inteira se houver endereço proibido.
- Fixar a conexão no IP aprovado, preservando hostname original em TLS/SNI/Host e validação de certificado.
- Revalidar URL, DNS e IP de cada redirect, com máximo de três redirects e deadline global curto incluindo DNS e toda a cadeia.
- Usar somente HEAD; respostas 405/501 são indisponibilidade temporária. Encerrar no recebimento dos headers, sem baixar/processar corpo. Limitar headers.
- Retornar status, código HTTP, URL resolvida segura, instante da tentativa, duração e motivo estável.
- Persistir metadados por ID de fonte existente, com comparação otimista; nunca alterar URL editorial, hostname, consulta editorial ou reativar ARCHIVED.
- Disponibilizar um comando manual de desenvolvimento por sourceId, protegido pelos mesmos tipos de confirmação explícita usados no script de publicação do catálogo.

## Non-goals

Endpoints públicos, formulário de URL, Server Actions públicas, chamadas durante renderização, jobs, agendamento, crawler, leitura de conteúdo migratório, novos hosts, autenticação, revisão legal, produção, alteração da URL cadastrada após redirect ou início da Fase 10. Não executar verificações contra governos nos testes normais.

## Proposed Architecture

`source-link-policy.ts` permanece puro e utilizável pela apresentação. Código de rede, aplicação e banco usa `server-only` e módulos nativos Node, sem novas dependências.

`validateOfficialSourceUrl({ url, hostname }, dependencies?, options?)` coordena política, DNS, request limitado, redirects e classificação. As dependências de DNS/HTTP são substituíveis por fakes. O resultado possui `status`, `reason`, `httpStatus`, `resolvedUrl`, `checkedAt` e `durationMs`.

Transporte HTTPS recebe a URL aprovada e o endereço validado, usa conexão isolada sem reutilização insegura e não resolve novamente o hostname ao conectar. O hostname original continua a autoridade para certificado e SNI. Timeout aborta conexões e listeners são limpos. HEAD é encerrado nos headers; não há parsing nem armazenamento do corpo. Limite inicial: dez segundos totais e 16 KiB de headers; timeout pode ser configurado pelo código dentro de limites validados, até trinta segundos. Não se aceita configuração externa de allowlist.

Classificação inicial: 2xx produz ACTIVE; 404/410 ou bloqueio determinístico da política/SSRF produz BROKEN; timeout, DNS/rede/TLS, limite excedido e demais respostas não exitosas produzem TEMPORARILY_UNAVAILABLE. Status técnico não atesta correção ou atualidade de regras migratórias. `resolvedUrl` nunca recebe um destino inseguro vindo de Location: representa somente URL aprovada, ou null quando nenhuma foi aprovada.

Serviço por sourceId carrega registro não arquivado, chama o validador e persiste com comparação de `id`, `url`, `hostname`, `status` e `updatedAt`. Alteração concorrente descarta resultado em vez de sobrescrever dados novos. `lastSuccessfulVerificationAt` só avança em ACTIVE; falhas preservam o último sucesso. A CLI recebe ID, nunca URL arbitrária, exige confirmação de desenvolvimento e não roda automaticamente.

## Implementation Steps

1. Fechar contrato de resultado, transporte e limites; manter divisão dos agentes por arquivos independentes.
2. Implementar classificação robusta de IPs com parsing nativo e faixas explícitas; transporte com IP fixado, TLS normal, aborto e limite de headers.
3. Implementar validador, política de redirects, deadline, HEAD e resultados estáveis com testes usando DNS/HTTP falsos.
4. Acrescentar migration aditiva de metadados, serviço/repositório de verificação e comando manual limitado a desenvolvimento.
5. Cobrir persistência, preservação editorial, falhas, ARCHIVED e conflitos concorrentes com fakes e integração transacional no banco de teste.
6. Executar revisão independente de código e segurança; corrigir findings e repetir testes afetados.
7. Rodar lint, typecheck, testes, build e integração pertinente; revisar diff e atualizar apenas documentação afetada com evidências reais.

## Files Expected to Change

- `src/features/sources/server/`: contratos, validador, serviço e testes.
- `src/features/sources/source-link-policy.ts`: somente reuso explícito da política existente se necessário.
- `src/lib/sources/` ou módulo server de fontes: transporte HTTPS, resolução DNS, política de IP e testes.
- `src/lib/db/repositories/`: consultas e persistência da verificação.
- `prisma/schema.prisma` e nova migration em `prisma/migrations/`.
- `scripts/verify-official-source.ts`, `package.json` e testes de integração pertinentes.
- `docs/SECURITY.md`, `docs/DATA-MODEL.md`, `docs/DATABASE-SETUP.md`, `docs/ROADMAP.md`, `docs/PROJECT-CONTEXT.md` conforme comportamento efetivamente implementado.

## Data Changes

Migration aditiva com campos nullable `verificationResolvedUrl` (String) e `verificationDurationMs` (Int). Metadados existentes continuam intactos; nenhum seed recebe sucesso inventado. Não aplicar migration ou executar comandos de verificação em produção. O esquema existente fornece status, HTTP e datas; a alteração estreita satisfaz a obrigação de persistência de `SECURITY.md`, seção 56, sem criar histórico ou nova tabela.

## Security Considerations

Revisão explícita de segurança obrigatória. Equality exata de hosts; nenhum sufixo/subdomínio implícito. Não confiar no hostname persistido sem compará-lo à URL. Revalidar todos os redirects, inclusive relativos, e impedir downgrade HTTPS. DNS check isolado é insuficiente: conexão deve usar o endereço aprovado. IPv6 requer parsing correto e política conservadora para endereços especiais e embutidos. Não aceitar proxy ou cookies/credenciais da aplicação; TLS nunca é relaxado. Não registrar URLs brutas, Location, secrets ou conteúdo de respostas. Não criar superfície pública suscetível a abuso; CLI limitada a um ID e execução manual.

## Testing

- URL: hosts válidos, semelhantes/falsos, hostname divergente, localhost, IP literal, protocolos inválidos, credenciais, portas e URL malformada/excessiva.
- DNS/IP: IPv4 e IPv6 públicos; loopback, privados, link-local, metadata, reservados, multicast, mapped IPv4 e resolução mista; DNS vazio/falhando/lento.
- Transporte: IP efetivamente fixado, hostname TLS preservado, certificado obrigatório, não seguir redirects sozinho, HEAD sem fallback GET, headers excessivos e aborto/limpeza.
- Redirect: sucesso relativo e entre hosts autorizados, downgrade, host desconhecido, IP privado na resolução do destino, Location inválido/ausente, loop e limite.
- Resultado: 2xx, 404/410, 403/429/5xx, timeout global, falha de rede/TLS, duração e códigos estáveis sem erro bruto.
- Persistência: sucesso, falha preservando último sucesso, ausência/ARCHIVED sem request, URL/hostname/datas editoriais preservados, concorrência descartada e metadados nullable da migration.
- Gate: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:integration` no banco controlado. Nenhum teste normal requer conexão com sites governamentais.

## Risks

HEAD pode receber bloqueios ou divergir do navegador; falha temporária não implica link legalmente inválido. Política conservadora de IPv6 ou redirect pode negar destinos legítimos até revisão explícita. Sites com proteção anti-bot podem responder 403/429. O mecanismo verifica disponibilidade técnica, não conteúdo. Resultado concorrente pode ser descartado e precisar de nova execução. Migração precisa preceder uso da persistência no ambiente correspondente.

## Definition of Done

Validador completo e testado; conexão protegida contra SSRF/rebinding; resultados e persistência coerentes; comando limitado e documentado; migration aditiva validada; revisões de código/segurança concluídas; checks relevantes passando e diff revisado. Documentação informa exatamente quais verificações foram executadas. Nenhuma entrega da Fase 10 iniciada.


## Evidências — 29/09/2026

Implementação por agentes de planejamento, rede, testes de aplicação/persistência e revisão independente de segurança; coordenação implementou serviço/repositório/CLI/migration. Sem dependências novas.

- `pnpm db:generate` e `pnpm db:validate`: passaram.
- Migration aditiva aplicada em DEV com confirmação de desenvolvimento e em TESTE pelo runner; nenhum ambiente de produção alterado.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`: passaram.
- `pnpm test`: 206 testes em 14 arquivos passaram (132 adicionais).
- Testes dirigidos: 111 de IP/rede/validador e 21 de serviço/CLI passaram.
- `pnpm test:integration`: passou; quatro casos transacionais, incluindo metadados nullable, atualização otimista e preservação editorial/último sucesso.
- `git diff --check`: passou.
- Revisão independente de segurança: sem findings acionáveis.
- Revisão independente de código completa: aprovada, sem findings relevantes. Status final: READY para revisão do usuário.

Correções durante desenvolvimento: `family` explícita evita seleção automática de família sem usar opção não declarada por RequestOptions; tipagem de mock ajustada sem supressões TypeScript.

Limitações: testes de transporte inspecionam opções/mocks de Node HTTPS; não houve handshake real ou consulta a sites governamentais. A CLI de verificação não foi executada em dados de desenvolvimento e as datas das fontes não foram artificialmente alteradas. HEAD pode ser bloqueado por sites legítimos; 405/501/403/429 ficam temporariamente indisponíveis. DNS nativo em andamento não é cancelável pelo AbortSignal; a operação retorna no prazo e impede HTTP posterior. Sem UI nova, E2E ou nova revisão jurídica. Fase 10 não iniciada.
