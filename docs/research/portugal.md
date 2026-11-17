# Portugal: pesquisa inicial (a revisar)

Levantamento feito em 17/11/2026 só com buscas na web. Nenhuma página foi aberta
por inteiro, então **nada aqui está revisado**. No banco, Portugal está como
`COMING_SOON` e `LINKS_ONLY`, e os domínios estão como `PENDING_REVIEW` em
`src/features/sources/official-domains.ts` (não viram link no site).

## Órgãos e domínios

| Domínio | Órgão | Papel | Evidência |
| --- | --- | --- | --- |
| aima.gov.pt | AIMA (Agência para a Integração, Migrações e Asilo) | Autorizações de residência, renovação, integração. Substituiu o SEF em 29/10/2023. | https://www.gov.pt/noticias/agencia-para-a-integracao-migracoes-e-asilo-aima-inicia-funcoes |
| vistos.mne.gov.pt | MNE (Ministério dos Negócios Estrangeiros) | Vistos nacionais (tipo D) e Schengen, pedidos no consulado | Guia de integração da Câmara Municipal do Porto: https://acaosocial.cm-porto.pt/files/uploads/cms/02_EN_caderno_Regularizacao_VF.pdf |

Atenção: a AIMA avisou que `aimapt.com` é um site falso. Ele não deve entrar na allowlist.

## Fluxo geral para quem não é da UE

1. Pedir um visto nacional (tipo D) no consulado de Portugal do país de residência
   (vistos.mne.gov.pt).
2. Já em Portugal, pedir a autorização de residência na AIMA.

## Tipos de visto para conferir

A lista vem das páginas do MNE citadas por terceiros. Confirmar cada item em
https://vistos.mne.gov.pt/pt/vistos-nacionais/informacao-geral/tipo-de-visto:

- Visto de residência para trabalho subordinado
- Visto de residência para atividade independente ou empreendedor imigrante, e
  visto para startup
- Visto de residência para atividade docente, altamente qualificada ou cultural
- Visto de residência para estudo, intercâmbio, estágio ou voluntariado
- Visto de residência para reagrupamento familiar
- Visto de residência para reformados e titulares de rendimentos próprios
- Visto para trabalho remoto
- Visto de estada temporária (até 1 ano), por exemplo tratamento médico ou
  trabalho sazonal
- Visto para procura de trabalho: **verificar se ainda existe**, porque houve
  mudanças na lei de estrangeiros em 2025

Meios de subsistência: a Portaria n.º 1563/2007 aparece citada como referência.
Confirmar se continua em vigor e qual valor se aplica.

## Para publicar Portugal

1. Abrir as duas páginas de evidência e confirmar os domínios. Depois mudar
   `status` para `VERIFIED` em `official-domains.ts`.
2. Conferir as fontes do seed (`prisma/seed-catalog.ts`, `pendingDestinations`).
3. Mudar o país para `ACTIVE` (no seed ou por SQL) e rodar o seed.
