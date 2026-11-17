# 0004 — BFF como camada de aplicação dentro do Next.js

Status: aceita em 16/11/2026, a partir da proposta do usuário de usar BFFs para concentrar a lógica e deixar o front apenas consumindo.

## Contexto

O objetivo do usuário é organização: a lógica fica fora das telas e a interface só consome resultados prontos. Um BFF (Backend for Frontend) é uma camada de servidor feita para servir uma interface específica. Num projeto Next.js com App Router, o próprio servidor do Next já ocupa esse lugar: Server Components e Server Actions rodam no servidor, chamam serviços de aplicação e entregam à tela dados já moldados para ela.

## Decisão

1. **O BFF é a camada de aplicação do próprio Next.js, não um serviço separado.** Cada feature mantém:
   - `application/` com serviços por caso de uso (ex.: `getDashboard`, `startProcess`, `updateChecklistItem`) que autenticam, autorizam, chamam domínio e repositórios e devolvem **view models** prontos para a tela (os tipos já criados em `features/*/types.ts`);
   - `domain/` com regras puras;
   - componentes que só recebem view models e disparam ações.
   Páginas e Server Actions ficam finas: ler parâmetros, chamar o serviço, renderizar ou devolver o resultado.
2. **API HTTP versionada só para clientes externos.** Quando existir um cliente fora do Next (ex.: app nativo da ADR 0003, se um dia for React Native), Route Handlers em `app/api/v1/` expõem **os mesmos serviços de aplicação**, no formato de resposta já definido em ARCHITECTURE.md. Nada de duplicar lógica nem de chamar a própria API internamente.
3. **Regra de revisão:** lógica de negócio em componente, página ou Server Action é finding de code review.

## Alternativas consideradas

- **BFF como serviço separado (outro processo ou deploy):** rejeitada por agora. Duplicaria autenticação, deploy e observabilidade, criaria uma chamada de rede extra entre o Next e o BFF e não traria ganho para um único front. Reavaliar se surgirem vários fronts com necessidades muito diferentes ou um time separado.
- **Front consumindo uma API REST interna via fetch:** rejeitada; é o padrão "chamada interna desnecessária" já desaconselhado em ARCHITECTURE.md §50.

## Consequências

- A estrutura atual já segue a decisão em parte: `features/*/types.ts` (view models), regras puras (`progress.ts`, `flow.ts`, `compatibility.ts`) e repositórios server-only. Falta formalizar `application/` por feature quando as fases de dados começarem (Fase 12 em diante).
- Os componentes de prévia continuam válidos: recebem view models e não sabem de onde vêm os dados.
- O app via PWA (ADR 0003) não precisa de API; a API v1 só nasce com um cliente nativo real.
