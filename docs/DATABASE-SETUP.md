# Banco de desenvolvimento — Supabase

O usuário escolheu Supabase no lugar de Neon antes de configurar conexões ou aplicar migrations. A Fase 6 mantém PostgreSQL padrão, Prisma 7.10.0, adapter pg, schema catalog e Node 24.x. Não há SDK Supabase nem autenticação implementada. A Fase 7 adiciona leitura pública pelas páginas com DATABASE_URL somente leitura.

## Preparação no painel

1. Acesse https://supabase.com/dashboard e crie um projeto de desenvolvimento chamado meu-visto-facil-dev.
2. Crie um segundo projeto exclusivo de testes chamado meu-visto-facil-test. Os nomes dos projetos são organizacionais: o banco de ambos normalmente se chama postgres.
3. Use recursos gratuitos disponíveis na sua conta; não habilite recursos pagos para esta fase. Não use projeto de produção ou um projeto compartilhado com outra aplicação.
4. Em cada projeto, clique em Connect e selecione Session pooler, porta 5432. Essa conexão funciona em redes IPv4. A conexão Direct também serve quando houver IPv6. Não use Transaction pooler (6543) para migrations e integração.
5. Copie somente a URL PostgreSQL, preenchendo a senha do banco localmente. Não confundir com Project URL, anon key ou service_role key: nenhuma dessas chaves é necessária nesta fase.

## Arquivos locais

Na raiz, ao lado de package.json, crie .env.local (ignorado pelo Git):

```dotenv
DIRECT_URL="URL_SESSION_DO_PROJETO_DEV"
DB_SEED_CONFIRM=development
```

Em .env.test.local (também ignorado):

```dotenv
TEST_DATABASE_URL="URL_SESSION_DO_PROJETO_TESTE"
DB_TEST_CONFIRM=supabase:IDENTIFICADOR_DO_PROJETO_DE_TESTE
```

O identificador de projeto é a referência de 20 caracteres usada pelo Supabase. A confirmação deve corresponder exatamente ao hostname db.<referência>.supabase.co ou ao sufixo do usuário postgres.<referência> na conexão Session. Nunca confirme o identificador do projeto de desenvolvimento/produção como alvo de teste. Essa confirmação protege contra erros de configuração, mas não identifica a finalidade do projeto no painel automaticamente.

Todas as URLs devem ter sslmode=verify-full e schema=catalog. Exemplo fictício de formato:

```text
postgresql://postgres.PROJECT_REF:SENHA_CODIFICADA@aws-0-REGIAO.pooler.supabase.com:5432/postgres?sslmode=verify-full&schema=catalog
```

Copie hostname e usuário reais do Connect, sem construí-los a partir do exemplo. Codifique caracteres especiais da senha para URL. Se houver erro de certificado, interrompa e configure a cadeia de confiança oficial; não reduza sslmode nem desabilite a verificação de certificados. Não imprimir URLs ou erros brutos com credenciais.

Variáveis do processo prevalecem sobre dotenv. A CLI lê .env.local; integração lê somente .env.test.local/TEST_DATABASE_URL, sem fallback para a conexão de desenvolvimento. DB_SEED_CONFIRM=development é confirmação humana do alvo, não detecção automática de produção.

DATABASE_URL é a conexão da aplicação com papel dedicado à leitura. Para o futuro runtime serverless, use Transaction pooler; para uso local pode usar Session. Não é necessária para executar migration, seed e integração. Nunca use a senha do proprietário na aplicação pública. Nenhuma variável deve começar com NEXT_PUBLIC_.

## Permissões e Data API

O schema catalog não deve estar na lista de schemas expostos pela Data API do Supabase. Não conceder acesso a catalog para anon, authenticated ou service_role. A migration revoga PUBLIC no schema e nas tabelas, mas não remove grants específicos existentes: revisar permissões externas antes de usar um projeto preexistente. Não seguir receitas que concedem acesso público ao schema.

Migrations/seed usam conexão administrativa somente em arquivos locais. Após a migration, preparar um papel de aplicação sem privilégios administrativos ou herança do proprietário, com USAGE ON SCHEMA catalog e SELECT ON ALL TABLES IN SCHEMA catalog. Usar suas credenciais em DATABASE_URL. O papel mvf_catalog_reader foi criado no desenvolvimento com acesso somente de leitura, sem herdar o proprietário. DATABASE_URL usa suas credenciais em Session mode (5432) para o ambiente local. Leitura permitida e escrita negada foram verificadas.

A migration altera apenas catalog: não altera auth, storage ou tabelas gerenciadas pelo Supabase. O uso de Supabase como banco não implementa a fase de autenticação.

## Validação

```bash
pnpm db:validate
pnpm db:generate
pnpm test:integration
pnpm db:deploy
pnpm db:seed
pnpm db:seed
```

Executar db:generate depois de instalar dependências e antes de typecheck/integração. db:deploy e db:seed usam o projeto DEV; test:integration usa exclusivamente TESTE. A suíte confirma o alvo dedicado, executa migrate deploy de forma repetível (inclusive com migration já aplicada) e verifica seed repetido, relações, unicidade, RESTRICT e repositórios públicos. Fixtures são revertidas por transação; tabelas e registro da migration permanecem. Reexecuções usam rollback das fixtures, sem reset, DROP ou TRUNCATE. Os testes de seed reservam os identificadores seed-* e external-fixture; o alvo deve ser exclusivo de testes, sem catálogo editorial persistido com essas identidades.

Para alterações futuras: pnpm db:migrate --name descricao requer shadow database e permissões específicas; nunca aceitar reset de dados úteis. pnpm db:diff permite gerar SQL offline; no Prisma 7.10 o engine exige datasource mesmo sem consultar banco. A migration inicial foi gerada offline e recebeu transação, search_path explícito e REVOKEs. Aplicada e validada em PostgreSQL real de desenvolvimento e teste em 10/09/2026.

## Seed e limites

Seed transacional create-only, com upsert sem atualização, chaves naturais e IDs estáveis. Preserva edições posteriores e registros externos; não faz consultas HTTP. Inclui Irlanda, Trabalho, Critical Skills DRAFT, quatro condições e três fontes da Fase 5, com consulta editorial de 10/09/2026. Campos de verificação automática ficam nulos. Não aprovado para produção (Fase 43).

Público potencial, atributos, permissões, etapas e disclaimer continuam no módulo editorial local. A composição da Fase 7 os associa ao slug de Critical Skills e IDs seed-source-ie-*; nomes, descrições, requisitos, fontes e datas vêm do banco. A cópia histórica para seed fica em prisma/seed-data e não é importada pelo runtime público. General Employment, Estudo e Família não viram caminhos completos. Sem novas entidades, JSON genérico ou valores monetários inventados.

## Referências oficiais

- [Supabase com Prisma](https://supabase.com/docs/guides/database/prisma)
- [Conexões direta, Session e Transaction](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Exposição de schemas pela Data API](https://supabase.com/docs/guides/api/using-custom-schemas)

Estado: READY. Projetos criados pelo usuário; migration aplicada pelo agente em ambos, seed de desenvolvimento executado duas vezes e integração em banco de teste inicialmente vazio aprovada. Papéis anon, authenticated e service_role sem USAGE no schema catalog, TLS confirmado no servidor.

## Certificado CA local

Se a conexão apresentar SELF_SIGNED_CERT_IN_CHAIN, baixar o certificado CA no painel SSL Configuration do próprio projeto. A conexão local pode usar sslrootcert com o caminho absoluto codificado na URL, mantendo sslmode=verify-full. A pasta .certs/ é ignorada pelo Git; cada ambiente deve configurar o próprio caminho. Não usar sslcert (certificado de cliente no driver pg) no lugar de sslrootcert.

Nesta configuração local, o certificado fornecido pelo usuário foi copiado para .certs/supabase-ca.crt e adicionado à DIRECT_URL sem exibir credenciais. A consulta SELECT 1 passou com verificação TLS ativa. Posteriormente migration, seed e integração Prisma também passaram. O certificado do projeto de testes está em .certs/supabase-test-ca.crt, referenciado pela TEST_DATABASE_URL.

## Publicação limitada no desenvolvimento — Fase 7

Após configurar DIRECT_URL administrativa no projeto DEV e DB_SEED_CONFIRM=development:

```bash
pnpm db:seed
pnpm db:publish:development --confirm-development
```

O seed permanece create-only e cria DRAFT. A publicação é um comando separado, fora do runtime/build: transação Serializable confere país ACTIVE, slug/categoria, nome/descrição, quatro requisitos obrigatórios com vínculos PRIMARY e três fontes ACTIVE do mesmo país, URLs/autoridades/datas esperadas. Divergência editorial, registro ausente ou ARCHIVED fazem o comando falhar sem alterações; revisar localmente antes de tentar novamente. Não há atualização geral nem reativação de arquivados.

Em 10/09/2026, o comando executou DRAFT_TO_ACTIVE apenas no registro seed-visa-ie-critical-skills e restaurou o resumo aprovado do cartão de Trabalho. Reexecução retornou ALREADY_ACTIVE. Nenhuma outra tabela ou dado foi atualizado; não houve nova migration. Não constitui aprovação para dados de produção.

Runtime usa exclusivamente DATABASE_URL. Auditoria de leitura em 10/09/2026 confirmou mvf_catalog_reader, SELECT permitido, INSERT/UPDATE/DELETE/TRUNCATE negados em Visa e TLS ativo; um visto publicado. O servidor local acessou as cinco rotas. DIRECT_URL continua exclusivo de operações administrativas CLI.

Listagens públicas limitadas a 50 vistos; detalhes até 200 requisitos, 20 referências por requisito e 50 referências do visto; até 100 fontes distintas. Excesso no detalhe/fontes é detectado com um registro adicional e gera erro seguro, sem cortar requisitos silenciosamente. Catálogos maiores exigirão paginação revisada. Sem cache persistente: connection() coloca leituras após a chegada de uma requisição. Build não executa seed, migration ou consulta.

## Verificação manual de fontes — Fase 9

A migration aditiva `20260929000000_source_verification_metadata` precisa ser aplicada antes da operação. Após confirmar localmente DIRECT_URL de desenvolvimento e DB_SEED_CONFIRM=development:

```bash
pnpm sources:verify:development --confirm-development seed-source-ie-permit
```

O comando recebe um único ID cadastrado, nunca uma URL. Faz HEAD somente em domínios aprovados e persiste o resultado técnico. Não chama seed nem publica vistos. Não executa em NODE_ENV=production; a confirmação é operacional e não detecta automaticamente a finalidade do banco. Não rodar como parte de build, renderização ou CI. Conflitos concorrentes descartam o resultado; nenhuma transação fica aberta durante a espera HTTP. DIRECT_URL continua restrita à CLI; DATABASE_URL pública não ganha escrita. Consulte o plano da Fase 9 para resultados, limites de HEAD e proteção SSRF.
