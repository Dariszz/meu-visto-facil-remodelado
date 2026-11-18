import type { CountryContent } from "./types";

// Espanha: consulta às fontes oficiais em 18/11/2026 (Ministério de Inclusão e
// consulados da Espanha). O regulamento de estrangeiros em vigor é o RD
// 1155/2024, aplicado desde 20/05/2025.
export const spainContent: CountryContent = {
  code: "ES",
  slug: "spain",
  name: "Espanha",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    employedSheet: {
      title: "Autorização inicial de residência e trabalho por conta alheia",
      authority: "Secretaría de Estado de Migraciones",
      url: "https://www.inclusion.gob.es/web/migraciones/w/autorizacion-inicial-de-residencia-temporal-y-trabajo-por-cuenta-ajena-hi-16-",
    },
    studyVisa: {
      title: "Visto de estudos (Consulado em São Paulo)",
      authority: "Ministerio de Asuntos Exteriores",
      url: "https://www.exteriores.gob.es/Consulados/saopaulo/pt/ServiciosConsulares/Paginas/Consular/Visado-de-estudios.aspx",
    },
    studyCriteria: {
      title: "Critérios interpretativos sobre estadia por estudos",
      authority: "Secretaría de Estado de Migraciones",
      url: "https://www.inclusion.gob.es/documents/d/migraciones/criterios-interpretativos",
    },
    teleworkVisa: {
      title: "Visto de teletrabalho (nómada digital)",
      authority: "Ministerio de Asuntos Exteriores",
      url: "https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Telework-visa.aspx",
    },
    nonLucrativeVisa: {
      title: "Visto de residência sem fins lucrativos (Consulado em São Paulo)",
      authority: "Ministerio de Asuntos Exteriores",
      url: "https://www.exteriores.gob.es/Consulados/saopaulo/pt/ServiciosConsulares/Paginas/Consular/Visado-de-residencia-no-lucrativa.aspx",
    },
    nonLucrativeSheet: {
      title: "Autorização inicial de residência temporária não lucrativa",
      authority: "Secretaría de Estado de Migraciones",
      url: "https://www.inclusion.gob.es/web/migraciones/w/autorizacion-inicial-de-residencia-temporal-no-lucrativa",
    },
    familySheet: {
      title: "Autorização de residência por reagrupação familiar",
      authority: "Secretaría de Estado de Migraciones",
      url: "https://www.inclusion.gob.es/web/migraciones/w/autorizacion-de-residencia-temporal-por-reagrupacion-familiar",
    },
  },
  visas: [
    {
      slug: "trabalho-conta-alheia",
      name: "Trabalho com contrato (conta alheia)",
      officialName:
        "Autorización inicial de residencia temporal y trabajo por cuenta ajena",
      authority: "Secretaría de Estado de Migraciones",
      category: "work",
      shortDescription:
        "O empregador na Espanha pede a autorização; em geral a vaga precisa estar no catálogo de difícil cobertura ou provar falta de candidatos locais.",
      description:
        "Neste caminho é o empregador espanhol quem pede a autorização de residência e trabalho. Depois da aprovação, você pede o visto no consulado e entra na Espanha.\n\nA contratação de estrangeiros de fora da UE depende da chamada situação nacional de emprego: a ocupação precisa estar no catálogo de ocupações de difícil cobertura, publicado a cada trimestre, ou o empregador precisa mostrar que não encontrou candidatos no mercado interno.\n\nO prazo de decisão é de três meses; sem resposta, o pedido é considerado negado.",
      overviewSource: "employedSheet",
      requirements: [
        {
          code: "employer-application",
          title: "Empregador faz o pedido",
          description:
            "O empregador deve estar inscrito e em dia com a Seguridade Social e o fisco, e comprovar meios para manter o contrato.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "employedSheet",
        },
        {
          code: "labour-market",
          title: "Situação nacional de emprego",
          description:
            "A ocupação deve constar no catálogo de difícil cobertura, ou o empregador deve publicar a oferta no portal Empléate e mostrar dificuldade em preenchê-la.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "employedSheet",
        },
        {
          code: "contract",
          title: "Contrato e qualificação",
          description:
            "Contrato assinado que garanta atividade contínua, e a qualificação exigida para a função. Contratos de meio período não podem pagar menos que o salário mínimo anual de tempo integral.",
          category: "EMPLOYMENT",
          importance: "HIGH",
          source: "employedSheet",
        },
        {
          code: "criminal-record",
          title: "Antecedentes criminais",
          description:
            "Sem antecedentes na Espanha e nos países onde você morou nos últimos cinco anos, com certidões legalizadas ou apostiladas.",
          category: "IDENTITY",
          importance: "HIGH",
          source: "employedSheet",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto em até 1 mês",
          description:
            "Depois que o empregador for notificado da aprovação, você tem um mês para pedir o visto pessoalmente no consulado, com passaporte válido por um ano, antecedentes e atestado médico.",
          category: "APPLICATION",
          importance: "CRITICAL",
          source: "employedSheet",
        },
        {
          code: "social-security",
          title: "Entrar e se inscrever na Seguridade Social",
          description:
            "O visto vale três meses para a entrada. Depois de entrar, você tem três meses para ser dado de alta na Seguridade Social.",
          category: "ENTRY",
          importance: "HIGH",
          source: "employedSheet",
        },
        {
          code: "tie",
          title: "Pedir o cartão de estrangeiro (TIE)",
          description:
            "Até um mês depois da alta na Seguridade Social, peça o TIE pessoalmente na polícia do local de residência.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "employedSheet",
        },
      ],
    },
    {
      slug: "estudos",
      name: "Estudos",
      officialName:
        "Visado y autorización de estancia de larga duración por estudios",
      authority: "Ministerio de Asuntos Exteriores",
      category: "study",
      shortDescription:
        "Para cursos em tempo integral, doutorado ou formação acima de 90 dias, com direito a trabalhar até 30 horas por semana em cursos superiores.",
      description:
        "Quem vai estudar na Espanha por mais de 90 dias precisa de um visto de estudos, pedido no consulado. O curso deve ser em tempo integral, em centro de ensino autorizado.\n\nCom o regulamento em vigor desde maio de 2025, estudantes de ensino superior podem trabalhar por conta própria ou alheia, desde que seja compatível com os estudos e não passe de 30 horas por semana.\n\nCônjuge ou companheiro e filhos menores podem acompanhar, mas o visto de familiar não permite trabalhar.",
      overviewSource: "studyVisa",
      requirements: [
        {
          code: "admission",
          title: "Admissão em curso de tempo integral",
          description:
            "Comprovante de admissão em estabelecimento de ensino autorizado para um programa em tempo integral, ou em centro de investigação ou formação.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "studyVisa",
        },
        {
          code: "means",
          title: "Meios econômicos (100% do IPREM)",
          description:
            "Recursos de pelo menos 100% do IPREM por mês de estadia, mais 75% pelo primeiro familiar e 50% por cada familiar adicional. Se o alojamento já estiver pago, o valor é reduzido.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "studyVisa",
        },
        {
          code: "health-insurance",
          title: "Seguro médico",
          description:
            "Seguro de saúde que cubra toda a estadia, contratado com seguradora autorizada a operar na Espanha. Confira com o consulado as exigências de cobertura.",
          category: "HEALTH",
          importance: "HIGH",
          source: "studyVisa",
        },
        {
          code: "passport",
          title: "Passaporte válido",
          description:
            "Válido por toda a estadia, com duas páginas em branco e emitido há menos de 10 anos.",
          category: "IDENTITY",
          source: "studyVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto de estudos no consulado",
          description:
            "Com formulário de visto nacional, foto, passaporte, admissão, meios econômicos e seguro. Documentos estrangeiros precisam de apostila e, se for o caso, tradução oficial.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "studyVisa",
        },
        {
          code: "work-limit",
          title: "Respeitar o limite de trabalho",
          description:
            "No ensino superior, o trabalho deve ser compatível com os estudos e não passar de 30 horas por semana.",
          category: "AFTER_ARRIVAL",
          source: "studyCriteria",
        },
      ],
    },
    {
      slug: "teletrabalho-internacional",
      name: "Nómada digital (teletrabalho internacional)",
      officialName: "Visado para teletrabajo de carácter internacional",
      authority: "Ministerio de Asuntos Exteriores",
      category: "remote-work",
      shortDescription:
        "Para quem trabalha à distância para empresa de fora da Espanha, com renda de pelo menos 200% do salário mínimo espanhol.",
      description:
        "Este visto é para quem trabalha remotamente para uma empresa estabelecida fora da Espanha, como empregado ou autônomo. O trabalho para clientes espanhóis é limitado.\n\nÉ preciso ter diploma universitário ou pelo menos três anos de experiência na área, vínculo com a empresa há pelo menos três meses e renda de 200% do salário mínimo espanhol (2.442 € por mês em 2026).\n\nO visto vale até um ano. Antes de ele vencer, é possível pedir na Espanha a autorização de residência de teletrabalho.",
      overviewSource: "teleworkVisa",
      requirements: [
        {
          code: "qualification",
          title: "Diploma ou três anos de experiência",
          description:
            "Graduação ou pós-graduação de instituição reconhecida, ou pelo menos três anos de experiência profissional na área.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "teleworkVisa",
        },
        {
          code: "employment-relationship",
          title: "Vínculo com empresa estrangeira",
          description:
            "Pelo menos três meses de vínculo com a empresa, que deve ter atividade real e contínua há pelo menos um ano.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "teleworkVisa",
        },
        {
          code: "income",
          title: "Renda de 200% do salário mínimo",
          description:
            "Renda mensal de pelo menos 200% do salário mínimo espanhol (2.442 € em 2026) para o titular, com acréscimos por familiar.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "teleworkVisa",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde completo",
          description:
            "Seguro público ou privado de seguradora autorizada na Espanha, sem carências, copagamentos ou limites. Seguro de viagem não é aceito.",
          category: "HEALTH",
          importance: "HIGH",
          source: "teleworkVisa",
        },
        {
          code: "criminal-record",
          title: "Antecedentes criminais",
          description:
            "Certidão dos países onde você morou nos últimos anos, emitida há pouco tempo, com apostila e tradução juramentada para o espanhol.",
          category: "IDENTITY",
          source: "teleworkVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Com os documentos de qualificação, vínculo, renda, seguro e antecedentes. Confira no consulado da sua jurisdição a lista atualizada.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "teleworkVisa",
        },
        {
          code: "residence-permit",
          title: "Planejar a autorização de residência",
          description:
            "Para continuar depois do primeiro ano, peça na Espanha a autorização de residência de teletrabalho antes de o visto vencer.",
          category: "AFTER_ARRIVAL",
          source: "teleworkVisa",
        },
      ],
    },
    {
      slug: "residencia-nao-lucrativa",
      name: "Residência sem fins lucrativos",
      officialName: "Autorización de residencia temporal no lucrativa",
      authority: "Ministerio de Asuntos Exteriores",
      category: "residence",
      shortDescription:
        "Para morar na Espanha sem trabalhar, com renda ou patrimônio de pelo menos 400% do IPREM por mês.",
      description:
        "Este caminho é para quem quer morar na Espanha sem exercer atividade profissional, como aposentados ou pessoas que vivem de renda. O visto não autoriza a trabalhar.\n\nÉ preciso comprovar recursos de 400% do IPREM por mês para o titular e mais 100% do IPREM por familiar, além de seguro de saúde completo. O IPREM é um índice oficial atualizado anualmente.\n\nA autorização inicial vale um ano a partir da entrada na Espanha.",
      overviewSource: "nonLucrativeVisa",
      requirements: [
        {
          code: "means",
          title: "Recursos de 400% do IPREM",
          description:
            "Meios para o primeiro ano ou renda periódica de 400% do IPREM por mês, mais 100% por familiar a cargo.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "nonLucrativeVisa",
        },
        {
          code: "health-insurance",
          title: "Seguro de doença",
          description:
            "Seguro público ou privado de seguradora autorizada na Espanha que cubra os mesmos riscos do sistema público.",
          category: "HEALTH",
          importance: "HIGH",
          source: "nonLucrativeVisa",
        },
        {
          code: "criminal-record",
          title: "Antecedentes criminais",
          description:
            "Certidão dos países onde você morou nos últimos cinco anos, legalizada ou apostilada.",
          category: "IDENTITY",
          importance: "HIGH",
          source: "nonLucrativeVisa",
        },
        {
          code: "medical-certificate",
          title: "Atestado médico",
          description:
            "Atestado de que você não tem doenças com grave impacto na saúde pública, conforme o Regulamento Sanitário Internacional.",
          category: "HEALTH",
          source: "nonLucrativeVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Com o formulário de visto, o impresso EX-01, passaporte válido por um ano e as provas de recursos, seguro, antecedentes e saúde. O prazo de decisão é de um mês.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "nonLucrativeSheet",
        },
        {
          code: "entry",
          title: "Retirar o visto e entrar",
          description:
            "O visto deve ser retirado pessoalmente em até um mês, e a entrada deve ocorrer dentro da validade do visto (no máximo três meses).",
          category: "ENTRY",
          importance: "HIGH",
          source: "nonLucrativeSheet",
        },
        {
          code: "tie",
          title: "Pedir o cartão de estrangeiro (TIE)",
          description:
            "Até um mês depois da entrada, peça o TIE pessoalmente na polícia do local de residência.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "nonLucrativeSheet",
        },
      ],
    },
    {
      slug: "reagrupacao-familiar",
      name: "Reagrupação familiar",
      officialName:
        "Autorización de residencia temporal por reagrupación familiar",
      authority: "Secretaría de Estado de Migraciones",
      category: "family",
      shortDescription:
        "Para cônjuge, companheiro, filhos e alguns ascendentes de estrangeiros que já moram legalmente na Espanha.",
      description:
        "O pedido é feito na Espanha pelo familiar que já mora no país (o reagrupante). Em regra, ele precisa ter morado pelo menos um ano na Espanha e ter pedido a autorização para mais um ano.\n\nDepois da aprovação, o familiar tem dois meses para pedir o visto no consulado. Cônjuge, companheiro e filhos em idade de trabalhar podem trabalhar sem outro trâmite.\n\nA autorização do familiar vai até a mesma data da do reagrupante, com mínimo de um ano.",
      overviewSource: "familySheet",
      requirements: [
        {
          code: "residence-time",
          title: "Um ano de residência do reagrupante",
          description:
            "O reagrupante deve ter residido pelo menos um ano na Espanha e ter pedido autorização para residir ao menos mais um ano, salvo exceções para residentes de longa duração.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "familySheet",
        },
        {
          code: "family-link",
          title: "Familiar reagrupável",
          description:
            "Cônjuge ou companheiro com relação registrada ou estável há pelo menos 12 meses (sem prazo se houver filhos em comum), filhos menores ou dependentes, e ascendentes a cargo com mais de 65 anos.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "familySheet",
        },
        {
          code: "means",
          title: "Meios econômicos",
          description:
            "Para um casal, 150% do IPREM por mês, mais 50% do IPREM por membro adicional. Há regras próprias para famílias com menores.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "familySheet",
        },
        {
          code: "housing",
          title: "Moradia adequada",
          description:
            "Relatório de moradia emitido pela comunidade autônoma (ou prefeitura), com no máximo seis meses na data do pedido.",
          category: "OTHER",
          importance: "HIGH",
          source: "familySheet",
        },
        {
          code: "health-insurance",
          title: "Seguro saúde",
          description:
            "Seguro de saúde para o reagrupante e para os familiares reagrupados.",
          category: "HEALTH",
          source: "familySheet",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Reagrupante faz o pedido na Espanha",
          description:
            "Na Oficina de Estrangeiros da província ou pela sede eletrônica Mercurio. O prazo de decisão é de dois meses; sem resposta, considera-se negado.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "familySheet",
        },
        {
          code: "family-visa",
          title: "Familiar pede o visto em até 2 meses",
          description:
            "Depois da aprovação, o familiar pede o visto pessoalmente no consulado, com passaporte válido por pelo menos quatro meses, antecedentes, atestado médico e documentos do vínculo.",
          category: "ENTRY",
          importance: "CRITICAL",
          source: "familySheet",
        },
        {
          code: "tie",
          title: "Pedir o cartão de estrangeiro (TIE)",
          description:
            "Até um mês depois da entrada, o familiar pede o TIE na polícia do local de residência.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "familySheet",
        },
      ],
    },
  ],
};
