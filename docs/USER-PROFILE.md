# Perfil da aplicação — fase 11

O perfil é criado explicitamente em `/profile`, acessível pelo link **Meu perfil** na tela de sessão ativa `/login`. Ler a página não cria registros. Nome de exibição é opcional (até 100 caracteres, espaços externos removidos); o idioma inicial é `pt-BR`. Nesta fase o perfil criado é apenas exibido: edição de conta fica para a fase 32.

## Identidade e persistência

O serviço chama `requireUser()` antes de consultar ou criar. Nenhum ID enviado pelo browser define o dono; a ação projeta apenas nome e idioma, e o serviço rejeita campos adicionais. O repositório busca por `authUserId`, que possui constraint UNIQUE. `createMany(skipDuplicates)` seguido de lookup mantém o primeiro registro e não sobrescreve nome/idioma em reenvios ou chamadas concorrentes. Não exige UPDATE.

`catalog.UserProfile` contém `id` UUID gerado pela aplicação, `authUserId` UUID único, `displayName` opcional, `preferredLocale`, `createdAt` e `updatedAt`. O DTO da UI só contém id interno, nome e idioma. Não copia e-mail, senha ou metadata de identidade; não altera tabelas gerenciadas do Supabase. Não há FK para auth.users: a vinculação é feita pelo serviço autenticado. Não usar o repositório como endpoint público.

## Configuração do banco

Aplicar a migration aditiva `20261006000000_user_profile` com a conexão administrativa de desenvolvimento revisada (`pnpm db:deploy`). O banco de testes recebe migrations exclusivamente por `pnpm test:integration`.

`DATABASE_URL` continua sendo do leitor do catálogo. `DIRECT_URL` continua exclusiva de operações administrativas. Configure `PROFILE_DATABASE_URL` com uma credencial dedicada que tenha somente USAGE no schema catalog e SELECT/INSERT em UserProfile. A URL exige as mesmas regras TLS (`sslmode=verify-full` remotamente) e `schema=catalog`. Não há fallback para outra URL.

Procedimento SQL para uma **nova role dedicada**, executado administrativamente no ambiente correto depois da migration:

```sql
CREATE ROLE mvf_profile_writer LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
GRANT USAGE ON SCHEMA catalog TO mvf_profile_writer;
GRANT SELECT, INSERT ON TABLE catalog."UserProfile" TO mvf_profile_writer;
```

Defina uma senha forte através de ferramenta administrativa segura, sem colocá-la no repositório ou na conversa. Use essa credencial em `.env.local` e no gerenciador de secrets do ambiente. Se a role já existir, primeiro audite seus atributos, memberships e grants; não reutilize uma role privilegiada. Nunca conceda SELECT em todas as tabelas catalog ao usuário de perfis nem ao leitor público novamente.

A migration revoga acesso à nova tabela de PUBLIC e das roles conhecidas `mvf_catalog_reader`, `anon`, `authenticated` e `service_role`, quando presentes. A privacidade depende também de não expor catalog pela Data API e não criar outros grants/memberships amplos. A role de perfil não é dona da tabela e não precisa de UPDATE, DELETE, TRUNCATE ou CREATE. A aplicação aplica isolamento por usuário nas queries; não existem policies RLS por usuário nesta fase.

## Validação

Testes unitários cobrem sessão ausente, identidade atual, validação, mass assignment, erros e cliente sem fallback; componentes cobrem criação e exibição. Integração PostgreSQL usa fixtures revertidas e verifica persistência, preservação e grants da migration. Logs registram apenas evento e código fixos, sem identidade ou mensagens de infraestrutura.

Para validar manualmente: configurar Supabase Auth conforme [AUTHENTICATION.md](AUTHENTICATION.md), entrar, abrir Meu perfil, criar com nome opcional, recarregar e conferir preservação. Outra conta deve ver seu próprio formulário/perfil. Um usuário sem sessão deve voltar a /login. No deploy, auditar grants reais antes de habilitar o fluxo.
