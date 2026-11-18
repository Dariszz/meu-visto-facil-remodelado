import type { CountryContent } from "./types";

// Holanda: consulta em 18/11/2026 às páginas do IND (serviço de imigração),
// respondidas para nacionalidade brasileira. Valores de 2026.
export const netherlandsContent: CountryContent = {
  code: "NL",
  slug: "netherlands",
  name: "Holanda",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    highlySkilled: {
      title: "Highly skilled migrant",
      authority: "Immigration and Naturalisation Service (IND)",
      url: "https://ind.nl/en/residence-permits/work/highly-skilled-migrant",
    },
    incomeRequirements: {
      title: "Required amounts income requirements",
      authority: "Immigration and Naturalisation Service (IND)",
      url: "https://ind.nl/en/required-amounts-income-requirements",
    },
    study: {
      title:
        "Student residence permit for university or higher professional education",
      authority: "Immigration and Naturalisation Service (IND)",
      url: "https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education",
    },
    partner: {
      title: "Residence permit for partner",
      authority: "Immigration and Naturalisation Service (IND)",
      url: "https://ind.nl/en/residence-permits/family-and-partner/residence-permit-for-partner",
    },
  },
  visas: [
    {
      slug: "migrante-altamente-qualificado",
      name: "Migrante altamente qualificado (kennismigrant)",
      officialName: "Highly skilled migrant",
      authority: "Immigration and Naturalisation Service (IND)",
      category: "work",
      shortDescription:
        "Para quem tem contrato com empregador reconhecido pelo IND e salário mínimo por faixa de idade (5.942 € por mês a partir de 30 anos, em 2026).",
      description:
        "Na Holanda, quem pede a autorização de residência como migrante altamente qualificado é o empregador, que precisa ser um patrocinador reconhecido pelo IND. Para brasileiros, o pedido inclui também o visto de longa duração (MVV).\n\nO salário bruto mensal mínimo em 2026 é de 5.942 € para quem tem 30 anos ou mais e 4.357 € para menores de 30, sem contar o subsídio de férias. Recém-formados podem ter um piso reduzido de 3.122 €, em casos previstos pelo IND. O salário também precisa estar em linha com o mercado.\n\nO IND tem até 90 dias para decidir.",
      overviewSource: "highlySkilled",
      requirements: [
        {
          code: "recognised-sponsor",
          title: "Empregador reconhecido pelo IND",
          description:
            "O contrato deve ser com empregador ou instituição de pesquisa na Holanda que conste no registro público de patrocinadores reconhecidos.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "highlySkilled",
        },
        {
          code: "salary",
          title: "Salário mínimo por faixa de idade",
          description:
            "Em 2026: 5.942 € brutos por mês (30 anos ou mais), 4.357 € (menos de 30) ou 3.122 € no critério reduzido para recém-formados, sem subsídio de férias.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "incomeRequirements",
        },
        {
          code: "market-rate",
          title: "Salário de mercado",
          description:
            "O salário combinado deve ser equivalente ao que outras pessoas recebem, em média, na mesma função.",
          category: "EMPLOYMENT",
          importance: "HIGH",
          source: "highlySkilled",
        },
        {
          code: "big-register",
          title: "Registro BIG na área da saúde",
          description:
            "Profissões de saúde listadas na lei holandesa (BIG) exigem inscrição no registro BIG antes de trabalhar.",
          category: "EDUCATION",
          importance: "LOW",
          source: "highlySkilled",
        },
      ],
      steps: [
        {
          code: "documents",
          title: "Reunir e legalizar documentos",
          description:
            "O empregador informa a lista de documentos. Documentos estrangeiros precisam ser legalizados e traduzidos para holandês, inglês, francês ou alemão.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "highlySkilled",
        },
        {
          code: "employer-application",
          title: "Empregador faz o pedido (MVV e residência)",
          description:
            "O empregador pede ao IND o MVV e a autorização de residência ao mesmo tempo e paga a taxa (423 € em 2026).",
          category: "APPLICATION",
          importance: "CRITICAL",
          source: "highlySkilled",
        },
        {
          code: "decision",
          title: "Aguardar a decisão e retirar o MVV",
          description:
            "O IND tem até 90 dias para decidir. Com decisão positiva, você retira o MVV no consulado e, na Holanda, a autorização de residência.",
          category: "ENTRY",
          importance: "HIGH",
          source: "highlySkilled",
        },
      ],
    },
    {
      slug: "estudante-ensino-superior",
      name: "Estudante de ensino superior",
      officialName:
        "Student residence permit for university or higher professional education",
      authority: "Immigration and Naturalisation Service (IND)",
      category: "study",
      shortDescription:
        "Para cursos em tempo integral em universidade ou HBO reconhecida pelo IND; a instituição faz o pedido.",
      description:
        "Quem vai estudar em universidade ou instituição de ensino profissional superior (HBO) na Holanda precisa de autorização de residência de estudante. A instituição precisa ser patrocinadora reconhecida pelo IND e é ela quem faz o pedido, junto com o MVV.\n\nÉ preciso comprovar renda de pelo menos 1.130,77 € por mês em 2026 e ter progresso acadêmico: ao menos 50% dos créditos de cada ano.\n\nO IND tem até 60 dias para decidir.",
      overviewSource: "study",
      requirements: [
        {
          code: "registration",
          title: "Matrícula em curso acreditado e em tempo integral",
          description:
            "Comprovante de matrícula (ou matrícula provisória) em programa acreditado pela NVAO ou EQAR, em tempo integral, em instituição reconhecida como patrocinadora.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "study",
        },
        {
          code: "funds",
          title: "Recursos de 1.130,77 € por mês",
          description:
            "Valor mensal de 2026 para estudantes de ensino superior. Também é possível ter um financiador na Holanda que cumpra os requisitos de renda do IND.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "incomeRequirements",
        },
        {
          code: "study-progress",
          title: "Progresso nos estudos",
          description:
            "A cada ano, é preciso obter pelo menos 50% dos créditos; a instituição avisa o IND se o progresso for insuficiente sem justificativa.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "study",
        },
      ],
      steps: [
        {
          code: "documents",
          title: "Enviar documentos à instituição",
          description:
            "A instituição informa a lista. Documentos estrangeiros precisam ser legalizados e traduzidos para holandês, inglês, francês ou alemão.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "institution-application",
          title: "Instituição faz o pedido",
          description:
            "A instituição pede ao IND o MVV e a autorização de residência ao mesmo tempo. A taxa é de 254 € em 2026.",
          category: "APPLICATION",
          importance: "CRITICAL",
          source: "study",
        },
      ],
    },
    {
      slug: "parceiro",
      name: "Residência com parceiro",
      officialName: "Residence permit for partner",
      authority: "Immigration and Naturalisation Service (IND)",
      category: "family",
      shortDescription:
        "Para casados, parceiros registrados ou não casados que vão morar com alguém com nacionalidade holandesa ou residência válida na Holanda.",
      description:
        "Este caminho é para quem vai morar com o parceiro na Holanda. O parceiro na Holanda (patrocinador) precisa ter nacionalidade holandesa ou autorização de residência válida e cumprir os requisitos de renda do IND.\n\nAmbos precisam ter 21 anos ou mais (18, se já eram casados antes de morar na Holanda) e vão morar juntos no mesmo endereço. Antes de pedir o MVV, o parceiro que vem do exterior em geral precisa passar no exame de integração cívica no exterior, salvo isenções.\n\nO IND tem até 90 dias para decidir.",
      overviewSource: "partner",
      requirements: [
        {
          code: "relationship",
          title: "Relação comprovável",
          description:
            "Casamento, parceria registrada ou relação não casada que possa ser comprovada.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "partner",
        },
        {
          code: "age",
          title: "Idade mínima de 21 anos",
          description:
            "Os dois precisam ter 21 anos ou mais, ou 18 se já eram casados quando ambos moravam fora da Holanda.",
          category: "FAMILY",
          importance: "HIGH",
          source: "partner",
        },
        {
          code: "income",
          title: "Renda do patrocinador",
          description:
            "O parceiro na Holanda deve cumprir os requisitos de renda do IND (2.337 € brutos por mês, sem subsídio de férias, no segundo semestre de 2026).",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "incomeRequirements",
        },
        {
          code: "civic-integration",
          title: "Exame de integração cívica no exterior",
          description:
            "Antes do MVV, o parceiro que vem do exterior deve passar no exame sobre a Holanda e a língua holandesa, salvo isenção.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "partner",
        },
        {
          code: "sponsor-status",
          title: "Situação do parceiro na Holanda",
          description:
            "O patrocinador precisa ter nacionalidade holandesa ou residência válida. Alguns tipos de residência (como au pair ou trabalho sazonal) não permitem trazer o parceiro.",
          category: "FAMILY",
          importance: "HIGH",
          source: "partner",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir o MVV e a residência ao IND",
          description:
            "O pedido pode ser feito online pelo patrocinador, com documentos legalizados e traduzidos. O IND tem até 90 dias para decidir.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "partner",
        },
        {
          code: "tb-test",
          title: "Fazer o teste de tuberculose ao chegar",
          description:
            "Depois de chegar, o parceiro faz o teste de tuberculose, salvo nacionalidades isentas ou outras exceções do IND.",
          category: "AFTER_ARRIVAL",
          source: "partner",
        },
        {
          code: "municipality",
          title: "Registrar o endereço na prefeitura",
          description:
            "Os dois devem se registrar no mesmo endereço na prefeitura (gemeente).",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "partner",
        },
      ],
    },
  ],
};
