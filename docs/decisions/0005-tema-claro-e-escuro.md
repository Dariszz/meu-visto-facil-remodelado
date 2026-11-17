# 0005 — Tema claro e escuro

Status: aceita em 16/11/2026, por pedido do usuário. Substitui a decisão da Fase 2 de manter apenas o tema claro.

## Contexto

O usuário quer as opções de tema claro e escuro no site e no futuro app (ADR 0003). O design system define as cores em tokens no `globals.css`, mas parte dos valores estava fixa em hexadecimal.

## Decisão

1. Todos os tokens de cor passam a ser variáveis CSS com valores para claro e escuro. Componentes continuam usando só os tokens; cores fixas em componentes são proibidas.
2. Três preferências: **sistema** (padrão, segue `prefers-color-scheme`), **claro** e **escuro**. A escolha fica no `localStorage` do navegador; nenhum dado vai ao servidor.
3. Um script mínimo no `<head>` aplica o tema antes da primeira pintura, evitando o flash de tema errado sem tornar as páginas dinâmicas. É o único uso justificado de `suppressHydrationWarning`, no elemento `<html>`.
4. `color-scheme` e `theme-color` acompanham o tema, para controles nativos, barras de rolagem e a barra do navegador no celular.
5. O tema escuro mantém a identidade: base em azul-petróleo escuro, não preto. Contraste mínimo WCAG AA verificado por script para texto, texto secundário, botões, foco e bordas de controle.

## Alternativas consideradas

- **Biblioteca `next-themes`:** resolve o mesmo problema, mas o caso é pequeno; uma dependência a menos (AGENTS.md §43).
- **Cookie lido no servidor:** evitaria o script, mas tornaria todas as páginas dinâmicas por ler cookies no layout raiz.

## Consequências

- Revisão visual das telas nos dois temas passa a fazer parte da verificação de UI.
- Prévias e páginas públicas foram ajustadas na mesma entrega; telas futuras devem nascer usando só tokens.
