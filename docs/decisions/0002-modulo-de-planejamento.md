# 0002 — Módulo de planejamento: reserva financeira e ocupações

Status: aceita em 16/11/2026, por pedido do usuário.

## Contexto

Além do checklist de documentos, o usuário quer ajudar quem se muda a planejar a chegada: quanto dinheiro reservar para alguns meses sem renda e em que trabalhos é mais simples começar, incluindo ocupações sem exigência de diploma (cozinhas, bares, hotéis). Essas informações misturam requisitos oficiais com estimativas, e trabalho depende do que o visto permite.

## Decisão

1. **Separar requisito de estimativa.** Valores mínimos exigidos para o visto (meios de subsistência, contas bloqueadas, referências ao salário mínimo) são requisitos do catálogo, com fonte, como qualquer outro item da ADR 0001. Custo de vida é estimativa e nunca entra no checklist como obrigação.
2. **Calculadora de reserva determinística.** O usuário informa cidade, número de pessoas e meses sem renda. O código soma custos únicos (taxas, passagem, caução, traduções) e mensais (moradia, alimentação, transporte, seguro saúde) com margem de segurança. Cada valor tem fonte e data; preferir estatísticas oficiais (Eurostat, institutos nacionais). Fontes colaborativas, quando usadas, aparecem marcadas como "estimativa colaborativa". A IA só explica o resultado.
3. **Duas listas de ocupações por país:**
   - "Profissões com demanda oficial": listas oficiais de escassez e relatórios do EURES ou equivalentes;
   - "Trabalhos sem exigência de diploma": hotelaria, restauração, limpeza, logística, cuidado, conforme fontes oficiais de demanda.
   Cada ocupação mostra demanda (fonte e data), idioma esperado, certificados comuns, se exige diploma, e o salário mínimo e jornada pela fonte trabalhista oficial. Evitar a palavra "fácil".
4. **Filtro pelo visto.** Uma relação ocupação × visto, do catálogo revisado, indica se o trabalho é permitido, limitado (ex.: horas para estudantes) ou não permitido. Ocupação não permitida não aparece como sugestão de renda. Cidadania europeia libera a lista completa na UE.
5. **Proteção ao usuário:** alerta contra propostas informais, cobrança para "conseguir emprego" e trabalho sem contrato, com link do órgão trabalhista oficial. O produto nunca indica intermediários pagos.

## Alternativas consideradas

- **IA estimar custos e sugerir empregos livremente:** rejeitada; números sem fonte e risco de induzir a trabalho irregular.
- **Só profissões qualificadas:** rejeitada; deixaria de fora o caminho mais comum de renda inicial para o público-alvo.

## Consequências

- Novas entidades: `CostOfLivingItem` (país, cidade, categoria, valor, moeda, fonte, data), `Occupation` (país, exige diploma, idioma, certificados, fonte de demanda) e `VisaWorkRight` (visto, ocupação ou categoria, permitido/limitado/não permitido, fonte).
- A calculadora precisa de testes fortes de domínio, como o progresso do checklist.
- Valores em moeda estrangeira exigem data e fonte de câmbio, se houver conversão para real.
