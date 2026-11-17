# 0003 — App Android a partir do site, via PWA publicado na Play Store

Status: aceita em 16/11/2026, por pedido do usuário. Executar depois do deploy de produção, que segue adiado até o produto estar construído.

## Contexto

O usuário quer alcançar mais pessoas com um app Android, mantendo o site. O projeto é server-first (Server Components e Server Actions do Next.js) e é mantido por uma pessoa.

## Decisão

1. Tornar o site um **PWA**: manifest, ícones, tema, instalação na tela inicial e uso básico sem internet (ex.: consultar o checklist salvo), sem cache de dados privados de outra conta.
2. Publicar na Play Store como **Trusted Web Activity** (empacotamento do PWA), com Digital Asset Links ligando o app ao domínio de produção. Um único código; atualizações do site chegam ao app sem nova versão na loja.
3. Planejar o teste fechado exigido pela Play Store para contas pessoais novas (mínimo de 12 testadores por 14 dias contínuos, conforme a Central de Ajuda do Google Play consultada em 16/11/2026) ou usar conta de organização.

## Alternativas consideradas

- **Capacitor:** mais acesso a recursos nativos, mas cada atualização exige nova versão na loja. Reavaliar se notificações nativas ou arquivos locais se tornarem necessários.
- **React Native/Expo:** melhor experiência nativa, porém um segundo projeto de interface e uma API HTTP completa para consumir. Reavaliar com usuários e necessidade concreta.

## Consequências

- Nenhuma mudança na arquitetura atual: Server Components e Server Actions continuam funcionando dentro do app.
- Requisitos extras de qualidade móvel: alvos de toque, áreas seguras, desempenho em rede lenta, modo sem internet e tema escuro (ADR 0005).
- A autenticação por cookie funciona dentro da Trusted Web Activity porque ela usa o navegador do sistema; validar no teste fechado.
