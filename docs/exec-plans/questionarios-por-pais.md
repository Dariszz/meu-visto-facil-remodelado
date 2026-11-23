# Questionários e recomendações para todos os destinos

Pedido de 23/11/2026: os dez destinos com questionário e recomendação, antes do deploy.

## Decisões

- **Um questionário por destino**, com os mesmos códigos de pergunta em todos (`objective`, `region`, `has_employment_offer`…). Cada país só recebe as perguntas que as regras dele usam: trabalho remoto e renda própria aparecem onde há visto dessas categorias; inglês no Reino Unido, Canadá, EUA, Austrália e Alemanha; alemão na Alemanha; idade na Holanda, Canadá e Austrália.
- As perguntas dos nove destinos novos são geradas por `buildDestinationQuestions` (`src/features/questionnaire/data/destination-questions.ts`) a partir das categorias do conteúdo revisado. A Irlanda mantém o próprio arquivo e ganhou as perguntas de estudo e família.
- `ImmigrationProfile` ganhou os novos campos; o que não foi perguntado fica `null`, e `null` nunca conta como resposta negativa.
- **Regras por país** em `src/features/recommendations/engine/rules/`, com peças comuns em `kit.ts`. Versões `ireland-v2` e `<país>-v1`, gravadas no snapshot do processo.
- Caminhos cujo ponto central não cabe no questionário ficam no máximo em compatibilidade média, com o motivo à vista: sorteio do H-1B, convite do Express Entry e do 189, endosso do Global Talent, situação nacional de emprego da Espanha e o General Employment Permit (até a revisão do bloco seguinte).
- Faixas de renda escolhidas para coincidir com os valores oficiais do conteúdo: quando o valor exato cai dentro da faixa, o ponto fica "a confirmar".
- Nome, resumo e fontes de cada recomendação agora vêm do catálogo revisado (`listRecommendationVisas`), não de texto fixo.
- Rotas: `/questionnaire` lista os destinos e a situação de cada questionário; `/questionnaire/[pais]` e `/recommendations/[pais]`; `/recommendations` vai direto ao único destino respondido ou lista os respondidos.
- O seed das perguntas escreve só o que mudou (comparação de JSON sem depender da ordem das chaves) e arquiva perguntas que saíram do arquivo.

## Verificação

- Testes unitários das regras dos dez destinos (`destinations.test.ts`): só recomendam vistos do conteúdo revisado, perfil vazio nunca vira impedimento, nenhum texto promete aprovação, cenários por país.
- Integração em PostgreSQL local: questionário de cada destino igual ao gerado e seed repetido sem alterar datas.
- `next build` passou.

## Pendente

- Rodar `pnpm db:seed` no PC para levar as perguntas ao Supabase dev.
- Teste no navegador com a conta de teste.
