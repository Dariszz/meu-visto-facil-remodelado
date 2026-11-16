# Autenticação — fase 10

A identidade fica no Supabase Auth. A aplicação não grava senhas no Prisma. A fase 11 acrescenta [criação controlada de UserProfile](USER-PROFILE.md) em `/profile`, acessível após login.

## Configuração de desenvolvimento

Em `.env.local`, configure `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (chave pública `sb_publishable_...`) e `APP_ORIGIN` (`http://localhost:3000`). Nunca use chave secret ou service_role. Produção exige origens HTTPS. O catálogo público continua funcionando sem essas variáveis; as operações de autenticação falham de maneira controlada.

No projeto Supabase correto, habilite o provider Email e **Confirm email**, defina senha mínima de 8 caracteres e configure Site URL para a mesma origem de APP_ORIGIN. Adicione a URL exata `http://localhost:3000/auth/confirm` à lista de redirect URLs de desenvolvimento; em produção utilize a origem HTTPS correspondente. Configure entrega de e-mails/SMTP e limites de autenticação no provider conforme o ambiente. Não desative confirmação para contornar falhas de entrega.

Os templates de e-mail personalizados abaixo são obrigatórios. O callback padrão `?code=` não é usado. No template **Confirm signup**, o link deve ser:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=signup">Confirmar meu e-mail</a>
```

No template **Reset password**:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=recovery">Recuperar minha conta</a>
```

As ações passam APP_ORIGIN + `/auth/confirm` como RedirectTo. O usuário abre a página e pressiona Continuar: a verificação de token ocorre somente em POST, evitando consumo por pré-visualizadores de links. Não registrar query strings desta rota em proxies, analytics ou logs de acesso: elas contêm token temporário.

Referências: [SSR Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [templates de e-mail](https://supabase.com/docs/guides/auth/auth-email-templates).

## Comportamento e limites

- `/login` mostra login ou sessão ativa e logout; não é dashboard.
- `/register` e `/forgot-password` exibem respostas neutras, inclusive para rejeições retornadas pelo provider, para evitar enumeração. A mensagem não comprova entrega de e-mail; erros de configuração/transporte recebem falha genérica.
- `/auth/confirm` aceita somente token_hash e tipo signup/recovery; destinos são fixos.
- `/reset-password` e sua ação exigem identidade validada pelo servidor. Uma sessão válida também pode alterar sua senha por essa rota.
- `getCurrentUser()` consulta `getUser()`; `requireUser()` lança `AuthenticationError` com código AUTH_REQUIRED. Falhas de verificação negam acesso.
- SDK restrito a lib/auth e proxy. Cookies HttpOnly, SameSite=Lax e Secure em produção; nenhum cliente Supabase no browser. Logout encerra a sessão local.
- Proxy renova cookies nas rotas de auth e `/profile`, propaga a sessão à requisição/resposta e aplica no-store/no-referrer. Novas rotas privadas deverão ser adicionadas ao matcher quando implementadas.
- Server Actions usam as proteções de origem/POST do Next.js. Nunca configurar allowedOrigins amplo sem revisão.

## Verificação manual do ambiente configurado

1. Cadastrar conta de teste; confirmar que abrir o e-mail não consome o token sem pressionar Continuar.
2. Confirmar conta, atualizar a página /login e verificar persistência da sessão.
3. Sair, entrar com senha, testar senha incorreta e confirmar mensagem genérica.
4. Solicitar recuperação, abrir link, continuar e salvar nova senha; conferir login com a nova senha e rejeição da antiga.
5. Reabrir token usado e confirmar rejeição; conferir /reset-password sem sessão redireciona para login.
6. Verificar cookies e não-cache; testar mobile, teclado e leitor de tela.

Testes automatizados usam mocks controlados, sem Supabase real. Nesta entrega, configuração hospedada, entrega de e-mail e fluxo real não foram executados; smoke visual também depende de navegador disponível.
