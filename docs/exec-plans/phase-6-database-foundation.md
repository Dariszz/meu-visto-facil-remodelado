# Goal

Implementar somente a infraestrutura de persistência da Fase 6.

# Current State

Fase 5 aprovada pelo usuário em 10/09/2026, sem nova certificação nesta fase. Existem alterações locais dessa entrega; preservar. Node 24, Next 16, sem Prisma, banco configurado ou ferramentas PostgreSQL/Docker disponíveis no PATH.

# Scope

Sete entidades do catálogo, migration inicial, cliente server-side, validação de ambiente, seed editorial e testes PostgreSQL separados.

# Non-goals

Repositórios e páginas com banco (Fase 7), autenticação, IA, verificação HTTP, produção e deploy.

# Proposed Architecture

Supabase escolhido pelo usuário, substituindo a escolha inicial Neon antes de provisionar ou validar persistência. PostgreSQL padrão com Prisma e adapter pg; conexão pooled em DATABASE_URL para aplicação e Session pooler (5432, IPv4) ou direta (IPv6) em DIRECT_URL para migrations/seed. Cliente lazy em src/lib/db com server-only e cache global no desenvolvimento. Build não abre conexão nem migra dados. Configuração CLI carrega .env.local; integração carrega exclusivamente .env.test.local.

# Implementation Steps

1. Confirmar configuração atual do Prisma em documentação oficial e compatibilidade Node 24.
2. Implementar schema, gerar SQL de migration, configurar cliente e validação segura.
3. Mapear somente conteúdo existente e implementar seed transacional sem deleções.
4. Testar ambiente e integração real quando conexão isolada estiver disponível.
5. Revisar código e segurança; executar lint, typecheck, test, build, validate e generate.
6. Documentar resultados reais e pendências; parar antes da Fase 7.

# Files Expected to Change

prisma/, prisma.config.ts, src/lib/db/, tests/integration/, scripts/, configurações de testes e lint, package.json/lockfile, .env.example, README e documentação afetada.

# Data Changes

Country.code e slug globais únicos; VisaCategory.slug global; Visa.slug único por país; requisito.code único por visto; fontes com URL única por país e relações explícitas com chave composta. IDs estáveis no seed, timestamps em todas as tabelas, deleção RESTRICT. Campos editoriais não disponíveis ficam opcionais (autoridade/nome oficial/revisão); descrição de visto pode faltar em DRAFT. Nenhuma coluna monetária ou JSON.

Seed: Irlanda, categoria Trabalho, Critical Skills DRAFT (catálogo parcial ainda não integrado), quatro condições e três fontes da Fase 5. Consulta editorial 2026-09-10 em campo próprio da fonte; lastVerifiedAt e lastSuccessfulVerificationAt nulos. ACTIVE de fonte indica registro editorial utilizável, não verificação HTTP. Preservar todo conteúdo local: público, atributos, distinções de permissões, etapas e disclaimer ainda não têm relações estruturadas neste recorte; decidir mapeamento na Fase 7 antes de trocar leitura. General Employment, Estudo e Família não viram registros completos.

# Security Considerations

REQUIRED: credenciais, TLS, permissões e migration. Usar schema dedicado catalog não exposto por API do provider; nenhum grant PUBLIC. Aplicação futura com papel somente leitura; migrations com papel proprietário separado. URL remota exige TLS com verificação de certificado, erros sem valores. Seed somente com confirmação de ambiente de desenvolvimento. Integração hospedada exige projeto Supabase exclusivo de teste, banco postgres, porta 5432, confirmação supabase:<project-ref> correspondente ao hostname direto ou usuário do pooler e schema catalog vazio; PostgreSQL local mantém banco meu_visto_facil_test; não haverá reset/truncate/drop automático.

# Testing

Unitários para ambiente inválido, TLS e mensagens sem credenciais. Integração separada: migration em schema vazio, seed duas vezes, comparação de contagens/IDs, FKs, unicidade, RESTRICT e preservação de registro externo ao seed. Limpeza de fixtures por rollback de transação, sem limpeza global. Ausência de banco é falha explícita, nunca skip ou aprovação simulada.

# Risks

Validação real depende de configuração externa local pelo usuário, sem credenciais na conversa. Seed não aprovado para produção (Fase 43). Conteúdo parcial não permite antecipar integração de páginas.

# Definition of Done

Infraestrutura implementada, revisões concluídas e verificações essenciais executadas. Sem banco acessível, status BLOCKED com requisito exato, preservando trabalho independente concluído.

# Results

**BLOCKED — infraestrutura implementada, persistência real ainda não validada.**

- Neon confirmado pelo usuário; nenhum recurso externo criado ou produção alterada. Falta TEST_DATABASE_URL e confirmação em `.env.test.local`, conforme [setup](../DATABASE-SETUP.md). Não existe `.env.local` com conexão disponível nesta execução.
- Prisma 7.10.0 estável, client/adapter de mesma versão, Node 24.21.0; dependências exatas e scripts nativos estritamente necessários autorizados no pnpm. Não adotado Prisma 8 release candidate.
- Schema de sete entidades, migration `20260910000000_catalog_foundation`, cliente lazy server-only com pool limitado, validação Zod, seed transacional create-only e integração separada implementados. Páginas não modificadas por esta fase; alterações anteriores preservadas.
- `pnpm db:validate` e `pnpm db:generate`: passaram. Diff offline gerou SQL, sem aplicar banco. Prisma 7.10 encerrou sem SQL quando datasource estava ausente; diagnóstico identificou exigência `--datasource` do engine. Gerado com datasource local fictício porta 1, sem acesso de rede. SQL revisado e acrescido de transação, search_path e revogação PUBLIC.
- `pnpm test src/lib/db/environment.test.ts`: passou durante desenvolvimento. Uma falha inicial de typecheck por NodeJS.ProcessEnv exigir NODE_ENV no teste foi corrigida usando contrato Record de entradas opcionais.
- Gate final executado após alterações de código: `pnpm lint`, `pnpm typecheck`, `pnpm test` (**35 testes em 5 arquivos**), `pnpm build`, `pnpm db:validate`, `pnpm db:generate`: todos passaram. Build permaneceu estático, sem conexão de banco.
- `pnpm test:integration`: primeira execução impedida pelo sandbox no carregamento tsx (`uv_os_get_passwd`). Reexecutado com aprovação fora do sandbox: falhou de forma segura com `DATABASE_CONFIG_INVALID: TEST_DATABASE_URL`. Não foram executados migration, seed real ou assertions de integridade. Não se declara persistência validada.
- Integração implementada cobre migration em alvo vazio, contagens, seed duas vezes, preservação de edição e registro alheio, datas editoriais, vínculos e constraints/RESTRICT. Usa PostgreSQL real e rollback de fixtures; sem mocks, skips, DROP ou TRUNCATE.
- Code review com skill: revisão de schema, SQL, CLI, cliente, seed, testes, lockfile e documentação. Corrigida dependência implícita do search_path exigindo schema=catalog, configurando adapter e fixando search_path na migration. Sem findings de código CRITICAL/HIGH identificados; execução PostgreSQL pendente é bloqueio de verificação.
- Security review REQUIRED com skill: fronteira server-only, ausência de leitura do banco pelas páginas, credenciais não públicas, mensagens seguras, TLS verify-full e parâmetros duplicados rejeitados, grants PUBLIC revogados, seed sem deleções e proteção do alvo de teste. Configuração real de papéis, TLS e Data API no Neon não pôde ser auditada sem ambiente. Não implementados auth ou SSRF.
- README, contexto, roadmap e documentação de modelo/setup atualizados. Aprovação da Fase 5 registrada como relato do usuário. Não instalada suíte E2E nem iniciada Fase 7.

# Mudança de provider — Supabase

Pedido posterior do usuário substituiu Neon por Supabase antes de qualquer provisionamento. Os resultados anteriores acima são históricos. Configuração atual: dois projetos separados, desenvolvimento e teste, banco postgres e schema catalog; DIRECT_URL/TEST_DATABASE_URL com Session pooler na porta 5432 ou conexão direta IPv6.

A proteção de testes agora exige DB_TEST_CONFIRM=supabase:<project-ref> correspondente ao endpoint/usuário. Continua recusando produção e schema com tabelas, sem reset. PostgreSQL local mantém nome dedicado. Nenhuma entidade, migration ou regra do seed precisou mudar.

Code review e security review focados: hostname ancorado, confirmação exata, porta 5432, TLS preservado, sem credenciais públicas e sem exposição de catalog pela Data API. Nove testes adicionados cobrem conexões válidas, projeto divergente, confirmação ausente, domínio falso, porta Transaction e produção. A finalidade real do projeto e seus grants ainda exigem verificação no painel.

Documentação, .env.example e continuidade atualizados. Nenhum SDK, auth, repositório, deploy ou recurso remoto criado. Integração tentou executar, mas parou antes da conexão com DATABASE_CONFIG_INVALID: TEST_DATABASE_URL. Status de persistência continua BLOCKED.

Verificação após a troca: pnpm lint, pnpm typecheck, pnpm test (44 testes em 5 arquivos), pnpm build, pnpm db:validate e pnpm db:generate passaram. git diff --check sem problemas. Migration e seed reais continuam pendentes.

# Validação real concluída — 10/09/2026

**READY — Fase 6 concluída tecnicamente, aguardando revisão do usuário.** Este resultado substitui os bloqueios históricos descritos acima.

- O usuário criou projetos Supabase distintos de desenvolvimento e teste e forneceu as conexões e certificados. Configurados .env.local/.env.test.local e .certs/ (todos ignorados pelo Git). Nenhuma credencial incluída nesta documentação.
- pnpm test:integration passou em projeto de teste com catalog inicialmente vazio: migration 20260910000000_catalog_foundation aplicada; seed repetido, vínculos, contagens, unicidade, FKs, RESTRICT e preservação de edição/registro externo aprovados. Fixtures revertidas por rollback; schema/migration permanecem para inspeção.
- pnpm db:deploy passou no desenvolvimento; pnpm db:seed executado duas vezes, ambas com sucesso. Duas conexões novas confirmaram 1 país, 1 visto, 4 requisitos e 3 fontes persistidos, sem duplicações.
- Criado mvf_catalog_reader no desenvolvimento, senha aleatória salva somente no arquivo local. NOSUPERUSER/NOCREATEDB/NOCREATEROLE/NOINHERIT/NOBYPASSRLS; grants CONNECT, USAGE em catalog e SELECT nas tabelas. DATABASE_URL configurada com esse papel em Session mode. Consultas verificaram leitura permitida e INSERT/UPDATE/DELETE/TRUNCATE negados.
- Revisão de segurança final: TLS ativo confirmado via pg_stat_ssl nos dois projetos; certificado CA explícito e verify-full no cliente. Os papéis anon/authenticated/service_role não possuem USAGE em catalog em ambos os bancos. Configuração da Data API desativada conforme telas do usuário; não houve auditoria da Management API. Nenhuma alteração em auth/storage, produção ou páginas.
- Gate final: pnpm lint, pnpm typecheck, pnpm test (45 testes, 5 arquivos), pnpm build, pnpm db:validate e pnpm db:generate passaram. Build estático. Revisão final do diff e git diff --check sem problemas.
- Scripts locais temporários de provisionamento/auditoria removidos. Os dois projetos foram provisionados pelo usuário; somente a migration, seed e papel de leitura autorizados foram criados pelo agente.
- Cuidado operacional: as senhas administrativas foram enviadas pelo usuário na conversa; recomenda-se rotacioná-las no Supabase e atualizar arquivos locais. A senha do papel de aplicação foi gerada localmente e não exibida.
- Não há E2E instalado; não necessário nesta fase. Nenhum trabalho da Fase 7 iniciado. Parar para revisão.
