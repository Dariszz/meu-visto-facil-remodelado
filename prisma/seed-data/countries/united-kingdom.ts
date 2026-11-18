import type { CountryContent } from "./types";

// Reino Unido: consulta em 18/11/2026 às páginas do GOV.UK (Home Office).
// Valores em libras são os publicados na data da consulta.
export const unitedKingdomContent: CountryContent = {
  code: "GB",
  slug: "united-kingdom",
  name: "Reino Unido",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    skilledWorker: {
      title: "Skilled Worker visa",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/skilled-worker-visa",
    },
    skilledWorkerJob: {
      title: "Skilled Worker visa: your job",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/skilled-worker-visa/your-job",
    },
    skilledWorkerEnglish: {
      title: "Skilled Worker visa: knowledge of English",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/skilled-worker-visa/knowledge-of-english",
    },
    skilledWorkerCosts: {
      title: "Skilled Worker visa: how much it costs",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/skilled-worker-visa/how-much-it-costs",
    },
    globalTalent: {
      title: "Global Talent visa",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/global-talent",
    },
    student: {
      title: "Student visa",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/student-visa",
    },
    studentMoney: {
      title: "Student visa: money you need",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/student-visa/money",
    },
    family: {
      title: "Family visas: apply, extend or switch",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/uk-family-visa",
    },
    familyIncome: {
      title: "Family visa: financial requirements for partners",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/uk-family-visa/proof-income-partner",
    },
    familyPartner: {
      title: "Family visa: apply as a partner or spouse",
      authority: "UK Visas and Immigration (Home Office)",
      url: "https://www.gov.uk/uk-family-visa/partner-spouse",
    },
  },
  visas: [
    {
      slug: "skilled-worker",
      name: "Skilled Worker (trabalhador qualificado)",
      officialName: "Skilled Worker visa",
      authority: "UK Visas and Immigration (Home Office)",
      category: "work",
      shortDescription:
        "Para quem tem oferta de emprego de empregador aprovado pelo Home Office, em ocupação elegível e com salário mínimo (em geral £41.700 por ano).",
      description:
        "O Skilled Worker é o principal visto de trabalho do Reino Unido. É preciso ter oferta confirmada de um empregador aprovado pelo Home Office, que emite um certificado de patrocínio (CoS), em ocupação da lista elegível.\n\nO salário mínimo é o maior entre £41.700 por ano e o valor de referência (going rate) da ocupação. Também é preciso comprovar inglês em nível B2.\n\nO visto pode durar até 5 anos e ser renovado. Depois de 5 anos, pode ser possível pedir a residência permanente (indefinite leave to remain).",
      overviewSource: "skilledWorker",
      requirements: [
        {
          code: "sponsor",
          title: "Empregador aprovado e certificado de patrocínio",
          description:
            "O empregador deve ser aprovado pelo Home Office e emitir o certificado de patrocínio (CoS) com os dados da vaga. A oferta precisa estar confirmada antes do pedido.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "skilledWorker",
        },
        {
          code: "eligible-occupation",
          title: "Ocupação elegível",
          description:
            "A vaga precisa constar na lista de ocupações elegíveis para o Skilled Worker.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "skilledWorkerJob",
        },
        {
          code: "salary",
          title: "Salário mínimo",
          description:
            "O maior valor entre £41.700 por ano e o valor de referência da ocupação. Pode ser menor em extensões e mudanças de emprego.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "skilledWorkerJob",
        },
        {
          code: "english",
          title: "Inglês em nível B2",
          description:
            "Comprovado por teste aprovado (SELT), diploma de instituição britânica ou diploma estrangeiro ministrado em inglês com avaliação da Ecctis.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "skilledWorkerEnglish",
        },
        {
          code: "costs",
          title: "Taxas e recursos",
          description:
            "Taxa de £819 (até 3 anos) ou £1.618 (mais de 3 anos) fora do Reino Unido, sobretaxa de saúde de £1.035 por ano e, em geral, £1.270 disponíveis para se manter na chegada.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "skilledWorkerCosts",
        },
      ],
      steps: [
        {
          code: "online-application",
          title: "Pedir o visto online",
          description:
            "O pedido pode ser feito até 3 meses antes da data de início no CoS. Depois você comprova identidade e envia os documentos; fora do Reino Unido a decisão costuma sair em 3 semanas.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "skilledWorker",
        },
        {
          code: "change-employer",
          title: "Atualizar o visto se mudar de emprego",
          description:
            "Para mudar de emprego ou empregador, é preciso pedir a atualização do visto.",
          category: "AFTER_ARRIVAL",
          source: "skilledWorker",
        },
      ],
    },
    {
      slug: "global-talent",
      name: "Global Talent",
      officialName: "Global Talent visa",
      authority: "UK Visas and Immigration (Home Office)",
      category: "work",
      shortDescription:
        "Para líderes ou potenciais líderes em pesquisa, artes e cultura ou tecnologia digital, com endosso de órgão aprovado ou prêmio de prestígio.",
      description:
        "O Global Talent é para quem é líder ou potencial líder em pesquisa acadêmica, artes e cultura ou tecnologia digital. Não exige oferta de emprego.\n\nQuem ganhou um prêmio de prestígio elegível pode pedir direto. Os demais precisam primeiro de um endosso de organização aprovada pelo Home Office, e pedir o visto em até 3 meses depois da carta de endosso.\n\nParceiro e filhos podem acompanhar como dependentes.",
      overviewSource: "globalTalent",
      requirements: [
        {
          code: "field",
          title: "Liderança em área elegível",
          description:
            "Atuação como líder ou potencial líder em pesquisa acadêmica, artes e cultura ou tecnologia digital, com 18 anos ou mais.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "globalTalent",
        },
        {
          code: "endorsement",
          title: "Endosso ou prêmio elegível",
          description:
            "Endosso de organização aprovada pelo Home Office (pedido do visto em até 3 meses) ou um prêmio de prestígio da lista elegível.",
          category: "OTHER",
          importance: "CRITICAL",
          source: "globalTalent",
        },
      ],
      steps: [
        {
          code: "endorsement-application",
          title: "Pedir o endosso (se não tiver prêmio)",
          description:
            "Antes do visto, peça o endosso ao órgão responsável pela sua área.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "globalTalent",
        },
        {
          code: "visa-application",
          title: "Pedir o visto online",
          description:
            "Com passaporte e, se aplicável, traduções certificadas dos documentos.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "globalTalent",
        },
      ],
    },
    {
      slug: "student",
      name: "Estudante",
      officialName: "Student visa",
      authority: "UK Visas and Immigration (Home Office)",
      category: "study",
      shortDescription:
        "Para quem recebeu oferta incondicional de instituição licenciada (CAS) e tem recursos para o curso e para se manter.",
      description:
        "O Student visa é para cursos em instituições licenciadas pelo Home Office. A instituição envia um número de confirmação (CAS) depois da oferta incondicional.\n\nÉ preciso ter dinheiro para o primeiro ano do curso e para se manter: £1.529 por mês em Londres ou £1.171 fora de Londres, por até 9 meses, mantido por 28 dias seguidos antes do pedido. Também é preciso comprovar inglês.\n\nEm cursos de graduação ou acima, a estadia costuma ir até 5 anos. Depois, pode ser possível mudar para o Graduate visa.",
      overviewSource: "student",
      requirements: [
        {
          code: "cas",
          title: "Oferta incondicional e CAS",
          description:
            "Oferta incondicional de instituição licenciada e o número CAS, que é necessário antes de pedir o visto.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "student",
        },
        {
          code: "funds",
          title: "Recursos para curso e manutenção",
          description:
            "Taxa do curso do primeiro ano e £1.529 por mês (Londres) ou £1.171 (fora de Londres), por até 9 meses, mantidos por 28 dias seguidos.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "studentMoney",
        },
        {
          code: "english",
          title: "Conhecimento de inglês",
          description:
            "Em geral comprovado por teste aprovado ou qualificação aceita; brasileiros não estão na lista de isentos.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "student",
        },
      ],
      steps: [
        {
          code: "online-application",
          title: "Pedir o visto até 6 meses antes",
          description:
            "De fora do Reino Unido, o pedido pode ser feito até 6 meses antes do início do curso; a decisão costuma sair em 3 semanas.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "student",
        },
        {
          code: "work-rules",
          title: "Respeitar as regras de trabalho",
          description:
            "As horas de trabalho permitidas dependem do curso e do período (aulas ou férias); o visto aprovado informa os limites. Trabalho autônomo não é permitido.",
          category: "AFTER_ARRIVAL",
          source: "student",
        },
      ],
    },
    {
      slug: "family-partner",
      name: "Visto de família (parceiro ou cônjuge)",
      officialName: "Family visa (partner or spouse)",
      authority: "UK Visas and Immigration (Home Office)",
      category: "family",
      shortDescription:
        "Para viver com parceiro britânico, irlandês ou com residência permanente no Reino Unido; renda combinada de pelo menos £29.000 por ano.",
      description:
        "O visto de família como parceiro é para quem vai viver com um parceiro que é cidadão britânico ou irlandês, tem residência permanente (settled) ou outros status previstos.\n\nÉ preciso comprovar casamento ou parceria civil reconhecida, ou dois anos de relacionamento (vivendo juntos ou não), além de bom conhecimento de inglês. A renda combinada do casal deve ser de pelo menos £29.000 por ano, ou ser coberta por economias.\n\nO pedido de fora do Reino Unido custa £2.064 por pessoa.",
      overviewSource: "family",
      requirements: [
        {
          code: "partner-status",
          title: "Situação do parceiro no Reino Unido",
          description:
            "O parceiro deve ser cidadão britânico ou irlandês, ter residência permanente (settled) ou outro status previsto, como proteção.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "familyPartner",
        },
        {
          code: "relationship",
          title: "Relacionamento comprovado",
          description:
            "Casamento ou parceria civil reconhecidos, ou pelo menos 2 anos de relacionamento; noivos devem casar em até 6 meses após a chegada. Ambos com 18 anos ou mais.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "familyPartner",
        },
        {
          code: "income",
          title: "Renda mínima de £29.000",
          description:
            "Renda combinada de pelo menos £29.000 por ano, com possibilidade de usar economias. Há regras diferentes para certos benefícios por deficiência.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "familyIncome",
        },
        {
          code: "english",
          title: "Bom conhecimento de inglês",
          description: "É preciso comprovar conhecimento de inglês.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "familyPartner",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir o visto de família online",
          description:
            "De fora do Reino Unido, a taxa é de £2.064 por pessoa. Avise o banco sobre o pagamento de valor alto.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "family",
        },
        {
          code: "extend",
          title: "Planejar extensões até a residência permanente",
          description:
            "O visto precisa ser estendido antes de vencer; é preciso um tempo mínimo de residência para pedir a permanência definitiva.",
          category: "AFTER_ARRIVAL",
          source: "family",
        },
      ],
    },
  ],
};
