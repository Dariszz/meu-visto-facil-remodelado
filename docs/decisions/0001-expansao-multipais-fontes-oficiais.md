# 0001 — Expansão para vários países com fontes oficiais e níveis de cobertura

Status: aceita em 16/11/2026, por pedido do usuário. Substitui a premissa de "Irlanda apenas" do MVP para a evolução pós-MVP; o MVP continua sendo a Irlanda.

## Contexto

O usuário quer que o Meu Visto Fácil atenda qualquer país escolhido: listar os vistos disponíveis, montar o checklist de documentos do visto escolhido e apoiar o planejamento da mudança. O risco central é a IA inventar requisitos, taxas, prazos ou links. Pesquisa de 16/11/2026 (relatório na conversa de retomada) mostrou:

- não há lista global de domínios oficiais de imigração; metade dos órgãos relevantes usa domínios sem sufixo governamental (irishimmigration.ie, ind.nl, bamf.de, migri.fi, udi.no);
- sites falsos que imitam governo são frequentes e bem posicionados em buscadores;
- ferramentas jurídicas comerciais com recuperação de documentos ainda alucinam numa parcela relevante das respostas; restringir fontes reduz, mas não elimina, o problema.

## Decisão

1. **A IA não pesquisa no caminho do usuário.** O checklist continua saindo do catálogo estruturado e das regras determinísticas. A IA só explica e personaliza, recebendo apenas requisitos e fontes do catálogo (princípio já definido em AI-ARCHITECTURE.md).
2. **Allowlist de domínios oficiais por país**, em nova entidade `OfficialDomain`: hostname exato, país, autoridade, evidência de oficialidade (registro nacional de domínios, link do portal do governo, link de fonte intergovernamental ou embaixada; autodeclaração nunca basta sozinha), licença de reutilização, revisor e data. Sem curingas amplos. A política central de hostnames passa a ler desta tabela.
3. **Pipeline de ingestão fora da requisição do usuário:** crawler restrito à allowlist (reaproveitando o validador de URL da Fase 9, respeitando robots.txt) salva `SourceSnapshot` com hash; IA extrai candidatos a visto e requisito sempre com trecho literal; o código confere que o trecho existe no snapshot e que valores e prazos estão dentro dele; revisão humana aprova.
4. **Níveis de confiança:** requisitos com `reviewStatus` (`REVIEWED`, `SOURCED_UNREVIEWED`, `NEEDS_REVIEW`, `DEPRECATED`) e países com `coverageLevel` (`FULL`, `PARTIAL`, `LINKS_ONLY`, `NONE`). Só `REVIEWED` compõe o checklist. `SOURCED_UNREVIEWED` aparece como "confirme na fonte oficial", com trecho e link, nunca como obrigatório. Sem cobertura: nenhum checklist, apenas links oficiais verificados.
5. **Demanda do usuário dirige a cobertura:** pedido para país ou visto sem cobertura cria uma tarefa de ingestão e revisão; o usuário vê os links oficiais enquanto isso.
6. **Monitoramento:** reprocessamento periódico; mudança de hash marca requisitos ligados como `NEEDS_REVIEW` e avisa o usuário.
7. **Busca com filtro de domínio** (ex.: `allowed_domains` da API da Anthropic) só como ferramenta interna para descobrir páginas novas dentro da allowlist de um país, sempre revalidando cada URL no servidor.
8. **Ordem de expansão:** Irlanda (MVP), Portugal e Espanha, depois Itália, Alemanha e Holanda; fora da Europa depois. O EU Immigration Portal serve para descobrir órgãos e URLs de entrada, não como fonte da regra nacional.

## Alternativas consideradas

- **Busca em tempo real pela IA para montar o checklist:** rejeitada; resultados variam a cada chamada, dependem do filtro do provedor e não passam por revisão.
- **RAG aberto sobre a web:** rejeitado. RAG apenas sobre snapshots oficiais fica para perguntas abertas, numa fase posterior, com recusa quando não houver trecho que sustente a resposta.
- **Aprovar domínios por sufixo (.gov, .gouv, .gob):** rejeitado como critério único; serve apenas para priorizar candidatos.

## Consequências

- Novas entidades e campos: `OfficialDomain`, `SourceSnapshot`, `reviewStatus`, `lastVerifiedAt`, `sourceQuote`, `Country.coverageLevel`. Migrations aditivas.
- O gargalo passa a ser a revisão humana; o pipeline reduz o trabalho a conferir trechos destacados. Capacidade realista para um projeto solo: 5 a 8 países bem mantidos.
- Gates bloqueantes no servidor: fonte fora do contexto, URL fora da allowlist, item obrigatório omitido ou valor/prazo inexistente no catálogo derrubam a resposta da IA para o checklist determinístico.
- Licença e termos de reutilização registrados por domínio; o produto resume e cita trechos curtos com link, sem republicar páginas inteiras.
