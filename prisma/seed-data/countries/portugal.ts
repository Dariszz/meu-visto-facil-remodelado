import type { CountryContent } from "./types";

// Portugal: consulta às fontes oficiais em 18/11/2026 (MNE, AIMA e Diário da
// República). A Lei de Estrangeiros mudou em outubro de 2025 e em setembro de
// 2026; os textos lembram de conferir a versão vigente.
export const portugalContent: CountryContent = {
  code: "PT",
  slug: "portugal",
  name: "Portugal",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    residenceVisa: {
      title: "Vistos de residência: documentação instrutória",
      authority: "Ministério dos Negócios Estrangeiros (MNE)",
      url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/residencia",
    },
    cplp: {
      title: "Regime de vistos para cidadãos da CPLP",
      authority: "Ministério dos Negócios Estrangeiros (MNE)",
      url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/cplp",
    },
    means: {
      title: "Meios de subsistência",
      authority: "Ministério dos Negócios Estrangeiros (MNE)",
      url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/meios-de-subsistencia",
    },
    visaTypes: {
      title: "Vistos nacionais: tipos de visto",
      authority: "Ministério dos Negócios Estrangeiros (MNE)",
      url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/informacao-geral/tipo-de-visto",
    },
    employedPermit: {
      title:
        "Autorização de residência para atividade profissional subordinada",
      authority: "Agência para a Integração, Migrações e Asilo (AIMA)",
      url: "https://aima.gov.pt/pt/trabalhar/autorizacao-de-residencia-para-exercicio-de-atividade-profissional-subordinada-com-visto-de-residencia-art-88-o-n-o-1",
    },
    remotePermit: {
      title:
        "Autorização de residência para trabalho remoto (nómadas digitais)",
      authority: "Agência para a Integração, Migrações e Asilo (AIMA)",
      url: "https://aima.gov.pt/pt/trabalhar/autorizacao-de-residencia-para-o-exercicio-de-atividade-profissional-prestada-de-forma-remota-com-visto-de-residencia-para-o-exe",
    },
    familyPermit: {
      title: "Reagrupamento familiar com familiar fora de Portugal",
      authority: "Agência para a Integração, Migrações e Asilo (AIMA)",
      url: "https://aima.gov.pt/pt/viver/reagrupamento-familiar-com-familiar-fora-de-territorio-nacional-art-98-o-n-o-1",
    },
    foreignersLaw: {
      title: "Lei de Estrangeiros (Lei n.º 23/2007), versão consolidada",
      authority: "Diário da República",
      url: "https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2007-67564445",
    },
  },
  visas: [
    {
      slug: "trabalho-subordinado",
      name: "Trabalho com contrato",
      officialName:
        "Visto de residência para exercício de atividade profissional subordinada",
      authority: "Ministério dos Negócios Estrangeiros (MNE) e AIMA",
      category: "work",
      shortDescription:
        "Para quem tem contrato ou promessa de contrato com um empregador em Portugal.",
      description:
        "Este caminho é para quem vai trabalhar como empregado em Portugal. O visto de residência é pedido no consulado (ou centro de vistos) antes da viagem e permite entrar no país para pedir a autorização de residência na AIMA.\n\nA autorização de residência para trabalho vale dois anos e pode ser renovada por períodos de três anos.\n\nA Lei de Estrangeiros mudou em outubro de 2025 e em setembro de 2026. Confira a versão vigente no site do consulado antes de juntar documentos.",
      overviewSource: "residenceVisa",
      requirements: [
        {
          code: "job-contract",
          title: "Contrato ou promessa de contrato de trabalho",
          description:
            "É preciso apresentar contrato de trabalho, promessa de contrato ou manifestação individualizada de interesse do empregador. Profissões regulamentadas exigem comprovar a habilitação para exercê-las em Portugal.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "means",
          title: "Meios de subsistência",
          description:
            "A referência é o salário mínimo português (920 € por mês em 2026) para o titular, mais 50% por adulto e 30% por criança do agregado. Para quem trabalha, a renda do contrato conta como prova.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "means",
        },
        {
          code: "criminal-record",
          title: "Certidão de antecedentes criminais",
          description:
            "Certidão do país de origem ou de onde você morou por mais de um ano, com Apostila de Haia. Menores de 16 anos são dispensados.",
          category: "IDENTITY",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "health-coverage",
          title: "Seguro de viagem ou certificado PB4",
          description:
            "É exigido seguro de viagem que cubra despesas médicas e repatriação. Para brasileiros, o certificado PB4 (acordo de saúde Brasil–Portugal) pode substituir o seguro.",
          category: "HEALTH",
          source: "residenceVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto de residência no consulado",
          description:
            "Com passaporte válido por mais três meses além da estada, formulário, fotos e os documentos do contrato. O visto dá quatro meses para pedir a autorização de residência em Portugal.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "visaTypes",
        },
        {
          code: "aima-permit",
          title: "Pedir a autorização de residência na AIMA",
          description:
            "Em Portugal, apresente passaporte, visto, declaração do empregador, comprovativo de morada e as inscrições nas Finanças e na Segurança Social.",
          category: "AFTER_ARRIVAL",
          importance: "CRITICAL",
          source: "employedPermit",
        },
      ],
    },
    {
      slug: "altamente-qualificado",
      name: "Atividade altamente qualificada",
      officialName:
        "Visto de residência para atividade altamente qualificada exercida por trabalhador subordinado",
      authority: "Ministério dos Negócios Estrangeiros (MNE) e AIMA",
      category: "work",
      shortDescription:
        "Para profissionais qualificados com contrato de pelo menos seis meses e salário acima de um piso oficial.",
      description:
        "Este caminho é para profissionais com qualificação elevada e contrato de trabalho em Portugal. Exige um salário mínimo calculado a partir do salário médio nacional ou do indexante de apoios sociais (IAS).\n\nUma vantagem prevista na lei é que familiares de quem tem esta autorização não precisam esperar os dois anos exigidos, em regra, para o reagrupamento familiar.\n\nOs valores de referência mudam todo ano. Confira os números atuais com o consulado.",
      overviewSource: "residenceVisa",
      requirements: [
        {
          code: "contract-six-months",
          title: "Contrato de pelo menos seis meses",
          description:
            "Contrato ou promessa de contrato de trabalho com duração mínima de seis meses.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "salary-threshold",
          title: "Salário anual mínimo",
          description:
            "Pelo menos 1,5 vez o salário anual bruto médio nacional ou três vezes o IAS. Para profissões indicadas pelo governo como de maior necessidade, o piso cai para 1,2 vez o salário médio ou duas vezes o IAS.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "high-qualifications",
          title: "Qualificações profissionais elevadas",
          description:
            "Você deve comprovar qualificação elevada adequada ao cargo. Em profissões regulamentadas, é preciso o reconhecimento exigido para exercê-las.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "criminal-record",
          title: "Certidão de antecedentes criminais",
          description:
            "Certidão do país de origem ou de onde você morou por mais de um ano, com Apostila de Haia.",
          category: "IDENTITY",
          source: "residenceVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto de residência no consulado",
          description:
            "Com os documentos gerais (passaporte, fotos, seguro ou PB4, antecedentes) e o contrato. O visto dá quatro meses para pedir a autorização em Portugal.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "aima-permit",
          title: "Pedir a autorização de residência na AIMA",
          description:
            "Depois de chegar, agende o pedido na AIMA com passaporte, visto, contrato e comprovativo de morada.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "employedPermit",
        },
      ],
    },
    {
      slug: "estudante-ensino-superior",
      name: "Estudante de ensino superior",
      officialName: "Visto de residência para estudo em ensino superior",
      authority: "Ministério dos Negócios Estrangeiros (MNE) e AIMA",
      category: "study",
      shortDescription:
        "Para quem foi aceito em instituição de ensino superior em Portugal. Brasileiros (CPLP) admitidos são dispensados de comprovar meios.",
      description:
        "Quem vai fazer graduação, mestrado ou doutoramento em Portugal pede um visto de residência para estudo no consulado e, depois de chegar, a autorização de residência na AIMA.\n\nComo o Brasil faz parte do acordo de mobilidade da CPLP, quem é admitido em instituição de ensino superior fica dispensado de apresentar meios de subsistência. Bolsistas também têm dispensas.\n\nCom a lei de setembro de 2026, o visto adequado precisa ser obtido antes de entrar em Portugal.",
      overviewSource: "residenceVisa",
      requirements: [
        {
          code: "admission",
          title: "Admissão em instituição de ensino superior",
          description:
            "Comprovativo de aceitação (ou de que preenche as condições de admissão) em um programa de estudos de ensino superior.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "means-cplp",
          title: "Meios de subsistência (dispensa CPLP)",
          description:
            "Em geral é preciso comprovar recursos para os estudos. Cidadãos da CPLP admitidos em ensino superior são dispensados dessa prova.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "cplp",
        },
        {
          code: "criminal-record",
          title: "Certidão de antecedentes criminais",
          description:
            "Certidão do país de origem ou de onde você morou por mais de um ano, com Apostila de Haia. Menores de 16 anos são dispensados.",
          category: "IDENTITY",
          source: "cplp",
        },
        {
          code: "health-coverage",
          title: "Seguro de viagem ou certificado PB4",
          description:
            "Seguro que cubra despesas médicas e repatriação; para brasileiros, o certificado PB4 pode substituí-lo.",
          category: "HEALTH",
          source: "residenceVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto de estudo antes de viajar",
          description:
            "O pedido é feito no consulado ou centro de vistos, com os documentos gerais e a carta de admissão.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "aima-permit",
          title: "Pedir a autorização de residência na AIMA",
          description:
            "Dentro da validade do visto (quatro meses), agende o pedido de autorização de residência para estudo.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "visaTypes",
        },
      ],
    },
    {
      slug: "nomada-digital",
      name: "Nómada digital (trabalho remoto)",
      officialName:
        "Visto de residência para atividade profissional prestada de forma remota",
      authority: "Ministério dos Negócios Estrangeiros (MNE) e AIMA",
      category: "remote-work",
      shortDescription:
        "Para quem trabalha remotamente para empresa ou clientes de fora de Portugal e ganha ao menos quatro salários mínimos portugueses.",
      description:
        "Este visto é para quem quer morar em Portugal trabalhando à distância para empregadores ou clientes com sede fora do país, como empregado ou como autônomo.\n\nA renda média dos últimos três meses deve ser de pelo menos quatro salários mínimos portugueses. Com o salário mínimo de 920 € em 2026, isso dá 3.680 € por mês.\n\nA autorização de residência vale dois anos e pode ser renovada por períodos de três anos.",
      overviewSource: "residenceVisa",
      requirements: [
        {
          code: "remote-work-proof",
          title: "Vínculo de trabalho remoto",
          description:
            "Contrato de trabalho ou declaração do empregador; para autônomos, contrato de sociedade, contrato de prestação de serviços ou prova de serviços prestados.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "income",
          title: "Renda mínima de quatro salários mínimos",
          description:
            "Renda média mensal nos últimos três meses de pelo menos quatro vezes o salário mínimo português (3.680 € em 2026).",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "tax-residence",
          title: "Comprovante de residência fiscal",
          description: "Documento que comprove sua residência fiscal atual.",
          category: "FINANCIAL",
          source: "residenceVisa",
        },
        {
          code: "criminal-record",
          title: "Certidão de antecedentes criminais",
          description:
            "Certidão do país de origem ou de onde você morou por mais de um ano, com Apostila de Haia.",
          category: "IDENTITY",
          source: "residenceVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Com os documentos gerais (passaporte, fotos, seguro ou PB4, antecedentes) e as provas de trabalho e renda.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "aima-permit",
          title: "Pedir a autorização de residência na AIMA",
          description:
            "Em Portugal, apresente passaporte, visto, declaração do empregador ou cliente estrangeiro e comprovativo de morada.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "remotePermit",
        },
      ],
    },
    {
      slug: "rendimentos-proprios",
      name: "Aposentados e rendimentos próprios",
      officialName:
        "Visto de residência para reformados e pessoas que vivam de rendimentos",
      authority: "Ministério dos Negócios Estrangeiros (MNE) e AIMA",
      category: "residence",
      shortDescription:
        "Para aposentados e para quem vive de rendas, aplicações ou propriedade intelectual, com renda disponível em Portugal.",
      description:
        "Este caminho é para quem não vai trabalhar em Portugal e se sustenta com aposentadoria ou rendimentos próprios, como aluguéis, aplicações financeiras ou direitos autorais.\n\nA renda é avaliada pela regra de meios de subsistência, que usa o salário mínimo português como referência (920 € por mês em 2026 para o titular). Também é preciso mostrar que o dinheiro estará disponível em Portugal.",
      overviewSource: "residenceVisa",
      requirements: [
        {
          code: "income-proof",
          title: "Comprovante da aposentadoria ou dos rendimentos",
          description:
            "Documento com o valor da aposentadoria ou dos rendimentos de bens, aplicações financeiras ou propriedade intelectual.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "availability-portugal",
          title: "Renda disponível em Portugal",
          description:
            "Comprovante de que a renda poderá ser recebida ou estará disponível em território português.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "residenceVisa",
        },
        {
          code: "means",
          title: "Meios de subsistência",
          description:
            "Referência de 920 € por mês em 2026 para o titular, mais 50% por adulto e 30% por criança do agregado.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "means",
        },
        {
          code: "criminal-record",
          title: "Certidão de antecedentes criminais",
          description:
            "Certidão do país de origem ou de onde você morou por mais de um ano, com Apostila de Haia.",
          category: "IDENTITY",
          source: "residenceVisa",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto de residência no consulado",
          description:
            "Com os documentos gerais e as provas de renda. O visto dá quatro meses para pedir a autorização em Portugal.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "visaTypes",
        },
        {
          code: "aima-permit",
          title: "Pedir a autorização de residência na AIMA",
          description:
            "Depois de chegar, agende o pedido na AIMA dentro da validade do visto.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "visaTypes",
        },
      ],
    },
    {
      slug: "reagrupamento-familiar",
      name: "Reagrupamento familiar",
      officialName: "Reagrupamento familiar",
      authority: "Agência para a Integração, Migrações e Asilo (AIMA)",
      category: "family",
      shortDescription:
        "Para cônjuges, filhos e outros familiares de quem já tem autorização de residência em Portugal.",
      description:
        "O pedido é feito em Portugal pelo familiar que já reside legalmente no país. Depois da aprovação pela AIMA, o familiar no exterior tem 90 dias para pedir o visto de reagrupamento no consulado.\n\nDesde a Lei n.º 61/2025, em regra o residente precisa ter autorização de residência há pelo menos dois anos. A lei prevê exceções, por exemplo para filhos menores ou incapazes e para familiares de quem tem autorização para atividade altamente qualificada ou Cartão Azul UE.\n\nO familiar recebe autorização de residência com a mesma duração da do residente.",
      overviewSource: "familyPermit",
      requirements: [
        {
          code: "residence-time",
          title: "Tempo de residência do familiar em Portugal",
          description:
            "Em regra, dois anos de autorização de residência válida antes do pedido, com as exceções previstas na Lei de Estrangeiros.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "foreignersLaw",
        },
        {
          code: "family-link",
          title: "Comprovação do vínculo familiar",
          description:
            "Certidão de casamento, de nascimento ou de adoção, ou prova de união de facto há mais de dois anos, todas autenticadas.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "familyPermit",
        },
        {
          code: "housing",
          title: "Morada em Portugal",
          description:
            "Declaração da morada, com certidão predial (se for dono) ou declaração do senhorio (se for arrendatário).",
          category: "OTHER",
          importance: "HIGH",
          source: "familyPermit",
        },
        {
          code: "means",
          title: "Meios de subsistência",
          description:
            "O residente deve comprovar renda para sustentar a família, pela regra que usa o salário mínimo português como referência.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "means",
        },
        {
          code: "criminal-record",
          title: "Antecedentes criminais do familiar",
          description:
            "Certidão do país de nacionalidade do familiar ou de onde ele morou por mais de um ano, autenticada.",
          category: "IDENTITY",
          source: "familyPermit",
        },
      ],
      steps: [
        {
          code: "aima-request",
          title: "Residente faz o pedido na AIMA",
          description:
            "O familiar que mora em Portugal agenda e entrega o pedido com a própria autorização de residência e os documentos do familiar.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "familyPermit",
        },
        {
          code: "family-visa",
          title: "Familiar pede o visto em até 90 dias",
          description:
            "Com a aprovação da AIMA, o familiar pede o visto de reagrupamento no consulado em até 90 dias; depois disso a aprovação caduca.",
          category: "ENTRY",
          importance: "CRITICAL",
          source: "residenceVisa",
        },
        {
          code: "family-permit",
          title: "Pedir a autorização de residência ao chegar",
          description:
            "Depois de entrar em Portugal com o visto, o familiar vai à AIMA para receber a própria autorização de residência.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "familyPermit",
        },
      ],
    },
  ],
};
