import type { CountryContent } from "./types";

// Austrália: consulta em 18/11/2026 às páginas do Department of Home Affairs.
// Valores em dólares australianos (AUD). Novas regras de estudante desde
// 2 de outubro de 2026.
export const australiaContent: CountryContent = {
  code: "AU",
  slug: "australia",
  name: "Austrália",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    skilledIndependent: {
      title: "Skilled Independent visa (subclass 189), points-tested stream",
      authority: "Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-tested",
    },
    student: {
      title: "Student visa (subclass 500)",
      authority: "Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    },
    partner: {
      title: "Partner visa (apply overseas) (subclasses 309 and 100)",
      authority: "Department of Home Affairs",
      url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore",
    },
  },
  visas: [
    {
      slug: "skilled-independent-189",
      name: "Skilled Independent (subclasse 189)",
      officialName:
        "Skilled Independent visa (subclass 189), points-tested stream",
      authority: "Department of Home Affairs",
      category: "work",
      shortDescription:
        "Residência permanente sem patrocinador para profissionais em ocupação da lista, com avaliação de habilidades, convite e pelo menos 65 pontos.",
      description:
        "O visto 189 é uma residência permanente para trabalhadores qualificados, sem necessidade de empregador ou patrocinador. É preciso ser convidado: você registra uma manifestação de interesse (EOI) no sistema SkillSelect e aguarda convite.\n\nOs requisitos principais são ocupação na lista de ocupações qualificadas, avaliação de habilidades (skills assessment) adequada, idade abaixo de 45 anos no convite, inglês pelo menos competente e 65 pontos ou mais.\n\nO visto custa a partir de AUD 6.135. O processamento segue prioridades definidas pelo governo, que podem mudar.",
      overviewSource: "skilledIndependent",
      requirements: [
        {
          code: "occupation",
          title: "Ocupação na lista e avaliação de habilidades",
          description:
            "A ocupação deve estar na lista de ocupações qualificadas do visto 189, com avaliação de habilidades adequada.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "skilledIndependent",
        },
        {
          code: "age",
          title: "Menos de 45 anos no convite",
          description:
            "Você precisa ter menos de 45 anos quando for convidado a fazer o pedido.",
          category: "IDENTITY",
          importance: "CRITICAL",
          source: "skilledIndependent",
        },
        {
          code: "english",
          title: "Inglês pelo menos competente",
          description:
            "No momento do convite, é preciso ter pelo menos o nível competent English.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "skilledIndependent",
        },
        {
          code: "points",
          title: "65 pontos ou mais",
          description:
            "Pontuação mínima de 65 no teste de pontos; o convite pode exigir pontuação maior, que deve ser comprovada.",
          category: "OTHER",
          importance: "CRITICAL",
          source: "skilledIndependent",
        },
      ],
      steps: [
        {
          code: "eoi",
          title: "Registrar a manifestação de interesse (EOI)",
          description:
            "No SkillSelect, informe sua ocupação, avaliação e pontos; você recebe uma pontuação indicativa.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "skilledIndependent",
        },
        {
          code: "application",
          title: "Pedir o visto após o convite",
          description:
            "Com o convite, envie o pedido com as provas de cada ponto declarado.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "skilledIndependent",
        },
      ],
    },
    {
      slug: "student-500",
      name: "Estudante (subclasse 500)",
      officialName: "Student visa (subclass 500)",
      authority: "Department of Home Affairs",
      category: "study",
      shortDescription:
        "Para cursos com confirmação de matrícula (CoE) e seguro OSHC; permite trabalhar até 48 horas por quinzena durante as aulas.",
      description:
        "O visto de estudante permite fazer um curso elegível na Austrália por até 6 anos, conforme a matrícula. É preciso ter a confirmação de matrícula (CoE) e o seguro de saúde para estudantes estrangeiros (OSHC).\n\nO pedido é online e, em geral, de fora da Austrália. Desde 2 de outubro de 2026 há novas regras sobre pedidos dentro do país e sobre incluir familiares; em geral, parceiro e filhos não podem acompanhar, salvo exceções.\n\nO visto custa a partir de AUD 2.500. Durante as aulas é possível trabalhar até 48 horas por quinzena.",
      overviewSource: "student",
      requirements: [
        {
          code: "coe",
          title: "Confirmação de matrícula (CoE)",
          description:
            "Matrícula em curso na Austrália, com CoE válida na data da decisão.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "student",
        },
        {
          code: "oshc",
          title: "Seguro OSHC",
          description:
            "Seguro de saúde para estudantes estrangeiros (Overseas Student Health Cover), salvo categorias isentas.",
          category: "HEALTH",
          importance: "HIGH",
          source: "student",
        },
        {
          code: "genuine-student",
          title: "Estudante genuíno",
          description:
            "Responder em inglês às perguntas do pedido mostrando que estudar é o motivo principal da viagem, com documentos de apoio.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "student",
        },
        {
          code: "funds-english",
          title: "Recursos e inglês",
          description:
            "Comprovar recursos e, se exigido, o resultado de teste de inglês aprovado, conforme o curso principal.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "student",
        },
        {
          code: "family",
          title: "Família, em geral, não acompanha",
          description:
            "Pelas regras de 2 de outubro de 2026, parceiro e filhos não podem acompanhar, salvo exceções.",
          category: "FAMILY",
          source: "student",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir o visto online, de fora da Austrália",
          description:
            "O pedido é online e, em regra, feito de fora da Austrália.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "student",
        },
        {
          code: "work-limit",
          title: "Respeitar o limite de trabalho",
          description:
            "Até 48 horas por quinzena quando o curso estiver em andamento.",
          category: "AFTER_ARRIVAL",
          source: "student",
        },
      ],
    },
    {
      slug: "partner-309-100",
      name: "Parceiro (subclasses 309 e 100)",
      officialName: "Partner visa (apply overseas) (subclasses 309 and 100)",
      authority: "Department of Home Affairs",
      category: "family",
      shortDescription:
        "Para cônjuge ou companheiro de cidadão australiano, residente permanente ou neozelandês elegível, pedido de fora da Austrália.",
      description:
        "Este caminho é para quem está em relacionamento genuíno (casamento ou união de fato) com cidadão australiano, residente permanente ou neozelandês elegível.\n\nO pedido é feito de fora da Austrália e inclui dois vistos de uma vez: o temporário (309), que permite morar no país enquanto o permanente é analisado, e o permanente (100).\n\nO custo é a partir de AUD 11.710 e os prazos de processamento podem ser longos.",
      overviewSource: "partner",
      requirements: [
        {
          code: "sponsor-status",
          title: "Parceiro australiano ou residente permanente",
          description:
            "O parceiro deve ser cidadão australiano, residente permanente ou cidadão neozelandês elegível.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "partner",
        },
        {
          code: "genuine-relationship",
          title: "Relacionamento genuíno",
          description:
            "Casamento ou união de fato (de facto) genuína com o parceiro.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "partner",
        },
        {
          code: "outside-australia",
          title: "Estar fora da Austrália ao pedir",
          description: "O pedido do 309 deve ser feito de fora da Austrália.",
          category: "OTHER",
          importance: "HIGH",
          source: "partner",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir os vistos 309 e 100 juntos",
          description:
            "Um único pedido cobre o visto temporário e o permanente; o custo é a partir de AUD 11.710.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "partner",
        },
        {
          code: "permanent",
          title: "Aguardar o visto permanente (100)",
          description:
            "Com o 309, você mora na Austrália até a decisão sobre o 100.",
          category: "AFTER_ARRIVAL",
          source: "partner",
        },
      ],
    },
  ],
};
