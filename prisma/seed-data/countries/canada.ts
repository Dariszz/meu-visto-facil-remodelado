import type { CountryContent } from "./types";

// Canadá: consulta em 18/11/2026 às páginas do IRCC em canada.ca.
// Valores em dólares canadenses (CAD).
export const canadaContent: CountryContent = {
  code: "CA",
  slug: "canada",
  name: "Canadá",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    expressEntry: {
      title: "Express Entry: who can apply",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply.html",
    },
    federalSkilled: {
      title: "Federal Skilled Worker Program",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply/federal-skilled-workers.html",
    },
    proofOfFunds: {
      title: "Express Entry: proof of funds",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html",
    },
    studyEligibility: {
      title: "Study permit: who can apply",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/eligibility.html",
    },
    studyFunds: {
      title: "Study permit: proof of financial support",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html",
    },
    studyPal: {
      title: "Study permit: provincial or territorial attestation letter",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html",
    },
    studyWork: {
      title: "Work off campus as an international student",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html",
    },
    spouse: {
      title: "Sponsor your spouse, partner or child: eligibility",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship/spouse-partner-children/eligibility.html",
    },
  },
  visas: [
    {
      slug: "express-entry-federal-skilled-worker",
      name: "Express Entry: trabalhador qualificado federal",
      officialName: "Federal Skilled Worker Program (Express Entry)",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      category: "work",
      shortDescription:
        "Residência permanente para profissionais com experiência qualificada no exterior, inglês ou francês CLB 7 e pelo menos 67 pontos de seleção.",
      description:
        "O Federal Skilled Worker Program é um dos programas de residência permanente administrados pelo sistema Express Entry. É voltado a profissionais com experiência de trabalho qualificado no exterior ou no Canadá.\n\nÉ preciso ter pelo menos um ano contínuo (1.560 horas) de experiência qualificada nos últimos 10 anos, teste de idioma com CLB 7 nas quatro habilidades, diploma com avaliação de credenciais (ECA) e pelo menos 67 de 100 pontos nos fatores de seleção. Quem atende aos mínimos entra no banco do Express Entry e pode ser convidado a pedir a residência.\n\nO programa não vale para quem vai morar em Quebec, que seleciona seus próprios trabalhadores.",
      overviewSource: "federalSkilled",
      requirements: [
        {
          code: "skilled-experience",
          title: "Experiência qualificada",
          description:
            "Pelo menos 1 ano contínuo ou 1.560 horas pagas nos últimos 10 anos, em ocupação das categorias TEER 0, 1, 2 ou 3 da classificação canadense (NOC).",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "federalSkilled",
        },
        {
          code: "language",
          title: "Teste de idioma CLB 7",
          description:
            "Teste aprovado de inglês ou francês com nível mínimo CLB 7 em escrita, leitura, compreensão oral e fala.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "federalSkilled",
        },
        {
          code: "education",
          title: "Diploma e avaliação de credenciais (ECA)",
          description:
            "Diploma concluído e avaliação de credenciais educacionais para fins de imigração, se a formação for estrangeira.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "federalSkilled",
        },
        {
          code: "selection-points",
          title: "67 pontos nos fatores de seleção",
          description:
            "Pontuação mínima de 67 de 100, considerando idioma, educação, experiência, idade, oferta de emprego e adaptabilidade.",
          category: "OTHER",
          importance: "HIGH",
          source: "federalSkilled",
        },
        {
          code: "funds",
          title: "Comprovação de recursos",
          description:
            "Recursos de 15.263 CAD para uma pessoa (19.001 CAD para duas), salvo quem já pode trabalhar no Canadá e tem oferta de emprego válida.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "proofOfFunds",
        },
      ],
      steps: [
        {
          code: "profile",
          title: "Criar o perfil no Express Entry",
          description:
            "Com os resultados de idioma e a avaliação de credenciais em mãos, crie o perfil online e entre no banco de candidatos.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "expressEntry",
        },
        {
          code: "invitation",
          title: "Receber o convite e pedir a residência",
          description:
            "Os perfis são classificados por pontuação; quem é convidado pode enviar o pedido de residência permanente.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "expressEntry",
        },
      ],
    },
    {
      slug: "study-permit",
      name: "Permissão de estudo",
      officialName: "Study permit",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      category: "study",
      shortDescription:
        "Para quem foi aceito em instituição designada (DLI), com recursos para taxas, custo de vida (23.448 CAD por ano a partir de 1/9/2026) e transporte.",
      description:
        "Para estudar no Canadá é preciso estar matriculado em uma instituição de ensino designada (DLI) e, em geral, apresentar uma carta de atestação da província ou território (PAL/TAL) confirmando a vaga.\n\nÉ preciso provar dinheiro para as taxas do curso, o transporte e o custo de vida: 23.448 CAD por ano para uma pessoa, em pedidos feitos a partir de 1º de setembro de 2026, fora de Quebec. Quebec tem regras próprias.\n\nEstudantes elegíveis podem trabalhar até 24 horas por semana fora do campus durante as aulas. Depois do curso, pode ser possível pedir a permissão de trabalho pós-graduação (PGWP).",
      overviewSource: "studyEligibility",
      requirements: [
        {
          code: "dli",
          title: "Matrícula em instituição designada (DLI)",
          description:
            "Carta de aceitação de uma instituição de ensino designada.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "studyEligibility",
        },
        {
          code: "pal",
          title: "Carta de atestação provincial (PAL/TAL)",
          description:
            "Na maioria dos casos, a carta da província ou território confirmando a vaga é obrigatória para o pedido.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "studyPal",
        },
        {
          code: "funds",
          title: "Recursos para estudos e custo de vida",
          description:
            "Taxas do curso, transporte e 23.448 CAD por ano para uma pessoa (pedidos a partir de 1/9/2026, fora de Quebec), com extratos dos últimos 6 meses e origem dos recursos.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "studyFunds",
        },
        {
          code: "admissibility",
          title: "Antecedentes e saúde",
          description:
            "Não ter antecedentes criminais (certidão, se pedida) e, se exigido, fazer o exame médico; convencer o oficial de que sairá do Canadá ao fim da permissão.",
          category: "IDENTITY",
          importance: "HIGH",
          source: "studyEligibility",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir a permissão de estudo",
          description:
            "Com a carta de aceitação, a PAL/TAL e as provas financeiras, envie o pedido ao IRCC.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "studyEligibility",
        },
        {
          code: "work-limit",
          title: "Respeitar o limite de trabalho",
          description:
            "Durante as aulas, até 24 horas por semana fora do campus, se você atender às condições; nas férias programadas, pode trabalhar em tempo integral.",
          category: "AFTER_ARRIVAL",
          source: "studyWork",
        },
      ],
    },
    {
      slug: "spouse-sponsorship",
      name: "Patrocínio de cônjuge ou parceiro",
      officialName: "Spouse, common-law or conjugal partner sponsorship",
      authority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      category: "family",
      shortDescription:
        "Cidadãos canadenses e residentes permanentes que moram no Canadá podem patrocinar cônjuge ou parceiro para a residência permanente.",
      description:
        "Cidadãos canadenses e residentes permanentes podem patrocinar o cônjuge, companheiro (common-law) ou parceiro conjugal para que ele obtenha residência permanente.\n\nO patrocinador precisa ter pelo menos 18 anos, morar no Canadá (cidadãos no exterior devem mostrar que vão voltar) e assinar um compromisso de sustento. Na maioria dos casos não há exigência de renda mínima.\n\nHá impedimentos, por exemplo para quem foi patrocinado por um cônjuge há menos de 5 anos ou recebe assistência social por motivo que não seja deficiência.",
      overviewSource: "spouse",
      requirements: [
        {
          code: "sponsor-status",
          title: "Patrocinador cidadão ou residente permanente",
          description:
            "O patrocinador deve ter 18 anos ou mais, ser cidadão canadense, residente permanente ou registrado pelo Indian Act, e morar no Canadá.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "spouse",
        },
        {
          code: "undertaking",
          title: "Compromisso de sustento",
          description:
            "O patrocinador assina um compromisso e um acordo de patrocínio, assumindo o sustento do patrocinado.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "spouse",
        },
        {
          code: "eligibility-bars",
          title: "Sem impedimentos para patrocinar",
          description:
            "Não pode, por exemplo, ter sido patrocinado por cônjuge há menos de 5 anos, estar com pensões em atraso ou receber assistência social (exceto por deficiência).",
          category: "FAMILY",
          importance: "HIGH",
          source: "spouse",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Enviar o pedido de patrocínio e residência",
          description:
            "O patrocinador e o patrocinado preparam juntos o pedido. Em Quebec, também é preciso cumprir as regras e assinar o compromisso com o governo de Quebec.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "spouse",
        },
      ],
    },
  ],
};
