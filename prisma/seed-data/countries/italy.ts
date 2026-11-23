import type { CountryContent } from "./types";

// Itália: consulta em 23/11/2026 às listas de requisitos da Embaixada da Itália
// em Brasília (documentos com última atualização indicada em 2024). Cada
// consulado no Brasil atende uma região; as listas podem variar.
export const italyContent: CountryContent = {
  code: "IT",
  slug: "italy",
  name: "Itália",
  consultedAt: "2026-11-23",
  coverageLevel: "PARTIAL",
  sources: {
    visaTypes: {
      title: "Tipos de vistos de longa duração (tipo D)",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/pt/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-lunga-durata-tipo-d/tipi-di-visto-di-lunga-durata-tipo-d/",
    },
    employed: {
      title: "Lista de requisitos: visto de trabalho subordinado",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/wp-content/uploads/2024/11/mod.-2A-Visto-de-trabalho-subordinado-1.pdf",
    },
    study: {
      title: "Lista de requisitos: visto de estudos",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/wp-content/uploads/2024/11/mod.-1A-Visto-de-Estudos.pdf",
    },
    digitalNomad: {
      title:
        "Lista de requisitos: visto de trabalho autônomo para nômades digitais",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/wp-content/uploads/2024/11/mod.-2G-Visto-de-trabalho-autonomo-nomades-digitais.pdf",
    },
    electiveResidence: {
      title: "Lista de requisitos: visto de residência eletiva",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/wp-content/uploads/2024/11/mod.15-Visto-Residencia-Eletiva-Aposentados.pdf",
    },
    family: {
      title: "Lista de requisitos: visto de reagrupamento familiar",
      authority: "Embaixada da Itália em Brasília",
      url: "https://ambbrasilia.esteri.it/wp-content/uploads/2024/11/mod.10B-Visto-Reagrupamento-Familiar.pdf",
    },
  },
  visas: [
    {
      slug: "trabalho-subordinado",
      name: "Trabalho com contrato (subordinado)",
      officialName: "Visto per lavoro subordinato",
      authority:
        "Embaixada e consulados da Itália; Sportello Unico Immigrazione",
      category: "work",
      shortDescription:
        "O empregador na Itália pede a autorização (nulla osta) ao Sportello Unico; com ela aprovada, você pede o visto no consulado.",
      description:
        "Para trabalhar como empregado na Itália, em regra o empregador precisa obter antes a autorização de trabalho (nulla osta) no Sportello Unico per l'Immigrazione da província da empresa. O nulla osta vale seis meses e é enviado eletronicamente ao consulado.\n\nCom o nulla osta recebido pelo consulado, você agenda o pedido do visto. Já na Itália, pede o permesso di soggiorno.\n\nCada consulado no Brasil atende uma região (a Embaixada em Brasília atende DF, GO, TO, AM, RR, AP e PA). Confira a lista do consulado da sua região.",
      overviewSource: "visaTypes",
      requirements: [
        {
          code: "nulla-osta",
          title: "Nulla osta pedido pelo empregador",
          description:
            "O empregador pede o nulla osta ao Sportello Unico da província da empresa. Ele vale seis meses e precisa chegar ao consulado antes do agendamento.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "employed",
        },
        {
          code: "accommodation",
          title: "Alojamento na Itália",
          description:
            "Comprovante de acomodação com endereço completo; se for hospedado por terceiros, declaração de hospedagem com documento do anfitrião.",
          category: "OTHER",
          importance: "HIGH",
          source: "employed",
        },
        {
          code: "health-insurance",
          title: "Seguro saúde",
          description:
            "Seguro internacional válido no espaço Schengen, com duração mínima de duas semanas.",
          category: "HEALTH",
          source: "employed",
        },
        {
          code: "health-professionals",
          title: "Profissionais de saúde: reconhecimento do diploma",
          description:
            "Para atividades de saúde, o visto depende do reconhecimento prévio do diploma pelo Ministério da Saúde italiano.",
          category: "EDUCATION",
          importance: "LOW",
          source: "employed",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Com formulário, passaporte válido por três meses além do visto, identidade, foto, passagem, comprovante de residência na região do consulado e taxa de 116 € (paga com cartão de débito).",
          category: "APPLICATION",
          importance: "HIGH",
          source: "employed",
        },
        {
          code: "permesso",
          title: "Pedir o permesso di soggiorno",
          description:
            "Na Itália, peça o permesso di soggiorno. Só depois disso é possível pedir o nulla osta para trazer a família.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "employed",
        },
      ],
    },
    {
      slug: "estudo",
      name: "Estudo universitário",
      officialName: "Visto per studio (immatricolazione universitaria)",
      authority: "Embaixada e consulados da Itália",
      category: "study",
      shortDescription:
        "Para cursos reconhecidos pelo ministério italiano, com pré-inscrição validada no portal Universitaly, seguro e meios de subsistência.",
      description:
        "Para estudar na Itália por mais de 90 dias, é preciso estar inscrito ou pré-inscrito em curso reconhecido e ter a pré-inscrição validada pela universidade no portal Universitaly.\n\nO visto é individual. Familiares só podem pedir depois, se a estadia passar de um ano: o estudante obtém na Itália o nulla osta para eles.\n\nO valor mínimo de meios de subsistência é atualizado a cada ano acadêmico. A lista da Embaixada em Brasília (2024) indica 467,65 € por mês; confirme o valor vigente com o consulado da sua região antes de juntar os documentos.",
      overviewSource: "study",
      requirements: [
        {
          code: "universitaly",
          title: "Pré-inscrição validada no Universitaly",
          description:
            "Inscrição ou pré-inscrição em curso reconhecido, cadastrada no portal Universitaly e validada pela universidade.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "study",
        },
        {
          code: "funds",
          title: "Meios de subsistência",
          description:
            "Comprovação por extratos dos últimos 3 meses, declaração dos pais (com apostila) ou garantia de cidadão italiano. O valor mínimo muda a cada ano acadêmico; confirme o atual.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "study",
        },
        {
          code: "health-insurance",
          title: "Seguro saúde de 30.000 €",
          description:
            "Seguro internacional no espaço Schengen com cobertura mínima de 30.000 € para despesas médicas e repatriação, ou o certificado CDAM-IB2 do acordo Brasil-Itália.",
          category: "HEALTH",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "accommodation",
          title: "Alojamento",
          description:
            "Residência universitária, contrato de aluguel registrado, reserva de pelo menos 15 dias ou declaração de hospedagem.",
          category: "OTHER",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "equivalence",
          title: "Equivalência do diploma e idioma",
          description:
            "Quando a instituição pedir: declaração de valor (consulado) ou atestado de comparabilidade do CIMEA, e o comprovante do teste de idioma.",
          category: "EDUCATION",
          source: "study",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Entrevista presencial com formulário, passaporte, foto, passagem, comprovante de residência, matrícula e comprovantes. A taxa é de 50 €.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "study",
        },
      ],
    },
    {
      slug: "nomade-digital",
      name: "Nômade digital",
      officialName: "Visto per lavoro autonomo – nomadi digitali",
      authority: "Embaixada e consulados da Itália",
      category: "remote-work",
      shortDescription:
        "Para profissionais altamente qualificados que trabalham remotamente há pelo menos 6 meses, com renda anual acima de 26.000 €.",
      description:
        "Este visto é para profissionais altamente qualificados que trabalham à distância. É preciso ter pelo menos 6 meses de experiência como nômade digital e renda anual superior a 26.000 €, comprovada pela declaração de imposto de renda.\n\nA alta qualificação pode vir de diploma universitário com declaração do CIMEA, profissão regulamentada, 5 anos de experiência equivalente a graduação ou 3 anos (nos últimos 7) como especialista de TI ou diretor.\n\nTambém é preciso alojamento já garantido na Itália, com aluguel pago antecipadamente ou imóvel próprio.",
      overviewSource: "digitalNomad",
      requirements: [
        {
          code: "high-qualification",
          title: "Alta qualificação",
          description:
            "Diploma com declaração do CIMEA, profissão regulamentada, 5 anos de experiência equivalente ou 3 anos em TI ou direção nos últimos 7, com documentos apostilados.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "digitalNomad",
        },
        {
          code: "remote-experience",
          title: "6 meses como nômade digital",
          description: "Pelo menos 6 meses de trabalho remoto (home office).",
          category: "EMPLOYMENT",
          importance: "HIGH",
          source: "digitalNomad",
        },
        {
          code: "income",
          title: "Renda anual acima de 26.000 €",
          description:
            "Comprovada pela declaração de imposto de renda do ano anterior e pela continuidade da renda no ano corrente.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "digitalNomad",
        },
        {
          code: "accommodation",
          title: "Alojamento garantido",
          description:
            "Contrato de aluguel em seu nome com pelo menos 2 meses pagos antecipadamente, ou escritura de imóvel próprio na Itália.",
          category: "OTHER",
          importance: "HIGH",
          source: "digitalNomad",
        },
        {
          code: "health-insurance",
          title: "Seguro saúde de 30.000 €",
          description:
            "Seguro internacional com cobertura mínima de 30.000 €, ou o certificado CDAM-IB2 apostilado.",
          category: "HEALTH",
          source: "digitalNomad",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Agende no consulado da sua região e leve a documentação de qualificação, renda, alojamento e seguro.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "visaTypes",
        },
      ],
    },
    {
      slug: "residencia-eletiva",
      name: "Residência eletiva (aposentados e renda própria)",
      officialName: "Visto per residenza elettiva",
      authority: "Embaixada e consulados da Itália",
      category: "residence",
      shortDescription:
        "Para quem quer morar na Itália sem trabalho subordinado, com renda estável de fontes como aposentadoria, aluguéis ou investimentos.",
      description:
        "A residência eletiva é para quem quer transferir a residência para a Itália sem vínculo de trabalho subordinado, vivendo de aposentadoria ou de outras rendas estáveis e documentadas.\n\nA lista da Embaixada em Brasília indica renda mínima de 31.000 € por ano para comprovantes como aluguéis, participações ou investimentos, além de alojamento com pelo menos 6 meses de aluguel pagos antecipadamente (Airbnb não é aceito) ou imóvel próprio.\n\nDepois de chegar, a Questura da província pede a documentação para o permesso di soggiorno.",
      overviewSource: "electiveResidence",
      requirements: [
        {
          code: "stable-income",
          title: "Renda estável e documentada",
          description:
            "Recursos lícitos, regulares e contínuos, sem relação com trabalho subordinado; para aluguéis, participações ou investimentos, a lista indica mínimo de 31.000 € por ano.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "electiveResidence",
        },
        {
          code: "income-proof",
          title: "Comprovantes de aposentadoria ou renda",
          description:
            "Os últimos 3 comprovantes de aposentadoria ou de renda e a última declaração anual do imposto de renda.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "electiveResidence",
        },
        {
          code: "accommodation",
          title: "Moradia garantida",
          description:
            "Contrato de aluguel já firmado com pelo menos 6 meses pagos antecipadamente, ou escritura de imóvel próprio. Airbnb não é aceito.",
          category: "OTHER",
          importance: "CRITICAL",
          source: "electiveResidence",
        },
        {
          code: "health-insurance",
          title: "Seguro saúde de 30.000 €",
          description:
            "Seguro internacional com cobertura mínima de 30.000 €, ou o certificado CDAM-IB2.",
          category: "HEALTH",
          source: "electiveResidence",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Agende no consulado da sua região com formulário, passaporte e as provas de renda, moradia e seguro.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "visaTypes",
        },
        {
          code: "questura",
          title: "Apresentar a documentação na Questura",
          description:
            "Na Itália, a Questura da província onde você vai morar pede a documentação para o permesso di soggiorno.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "electiveResidence",
        },
      ],
    },
    {
      slug: "reagrupamento-familiar",
      name: "Reagrupamento familiar",
      officialName: "Visto per ricongiungimento familiare",
      authority:
        "Embaixada e consulados da Itália; Sportello Unico Immigrazione",
      category: "family",
      shortDescription:
        "O familiar que já mora legalmente na Itália pede o nulla osta; com ele, o cônjuge ou filho pede o visto no consulado.",
      description:
        "O reagrupamento familiar começa na Itália: o familiar que já mora legalmente no país pede o nulla osta ao Sportello Unico da província onde reside. O nulla osta vale seis meses e é enviado eletronicamente ao consulado.\n\nDepois que o consulado confirma o recebimento, o familiar no Brasil agenda o pedido do visto, com as certidões de casamento ou nascimento em inteiro teor, traduzidas e apostiladas.\n\nFamiliares de cidadãos italianos ou da União Europeia seguem outra lista de requisitos.",
      overviewSource: "family",
      requirements: [
        {
          code: "nulla-osta",
          title: "Nulla osta do familiar na Itália",
          description:
            "Pedido pelo familiar residente no Sportello Unico da província; vale seis meses e precisa chegar ao consulado antes do agendamento.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "family",
        },
        {
          code: "civil-records",
          title: "Certidões em inteiro teor",
          description:
            "Certidão de casamento e, se for o caso, de nascimento dos filhos menores, em inteiro teor, com tradução juramentada e apostila de Haia no original e na tradução.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "family",
        },
        {
          code: "sponsor-documents",
          title: "Documentos do familiar na Itália",
          description:
            "Cópia do passaporte, carta d'identità e/ou permesso di soggiorno do familiar residente.",
          category: "FAMILY",
          importance: "HIGH",
          source: "family",
        },
      ],
      steps: [
        {
          code: "visa-application",
          title: "Pedir o visto no consulado",
          description:
            "Após a confirmação do nulla osta pelo consulado, agende o pedido; o passaporte deve valer três meses além do visto.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "family",
        },
      ],
    },
  ],
};
