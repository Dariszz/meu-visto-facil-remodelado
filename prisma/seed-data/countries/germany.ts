import type { CountryContent } from "./types";

// Alemanha: consulta em 18/11/2026 às páginas das representações alemãs no
// Brasil (Ministério Federal das Relações Exteriores), atualizadas em julho de
// 2026. Valores salariais e de recursos são os de 2026.
export const germanyContent: CountryContent = {
  code: "DE",
  slug: "germany",
  name: "Alemanha",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    nationalVisas: {
      title: "Vistos nacionais: permanência maior que 90 dias",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/vistosnacionais",
    },
    blueCard: {
      title: "Visto Cartão Azul UE",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/vistosnacionais/trabalhoqualificado/cartao-azul-academicos-2632412",
    },
    skilledWorker: {
      title: "Visto para especialistas (trabalhador qualificado)",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/vistosnacionais/trabalhoqualificado/especialistas-2592904",
    },
    opportunityCard: {
      title: "Cartão de oportunidades (Chancenkarte)",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/vistosnacionais/trabalhoqualificado/cartao-de-oportunidades-2660188",
    },
    study: {
      title: "Visto para estudo (inclusive doutorado)",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/estudos-2568248",
    },
    spouse: {
      title: "Visto para reunião familiar com cônjuge",
      authority: "Representações da Alemanha no Brasil",
      url: "https://brasil.diplo.de/br-pt/servicos/visto/reuniaofamiliar-conjuge-1010114",
    },
  },
  visas: [
    {
      slug: "cartao-azul-ue",
      name: "Cartão Azul UE",
      officialName: "Blaue Karte EU (§ 18g AufenthG)",
      authority: "Representações da Alemanha e Departamento de Estrangeiros",
      category: "work",
      shortDescription:
        "Para quem tem diploma universitário e oferta de emprego qualificado com salário a partir de 50.700 € por ano (valores menores para profissões em falta e início de carreira).",
      description:
        "O Cartão Azul UE é a autorização de residência para profissionais com diploma universitário (ou qualificação comparável) e uma oferta de emprego qualificado na Alemanha.\n\nEm 2026, o salário bruto mínimo é de 50.700 € por ano. Para profissões em falta (como TI, engenharia, saúde e educação) e para quem se formou há menos de três anos, o mínimo é de 45.934,20 €, com aprovação da Agência Federal de Trabalho.\n\nO pedido de visto é feito online pelo portal do Ministério das Relações Exteriores, com entrevista presencial na representação.",
      overviewSource: "blueCard",
      requirements: [
        {
          code: "degree",
          title: "Diploma universitário reconhecido",
          description:
            "Diploma comparável a um diploma alemão. Especialistas em TI sem diploma podem se qualificar com três anos de experiência nos últimos sete anos.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "blueCard",
        },
        {
          code: "job-offer",
          title: "Oferta de emprego de pelo menos seis meses",
          description:
            "Oferta concreta de uma empresa na Alemanha, em cargo adequado à sua qualificação. Profissões regulamentadas exigem a autorização de exercício.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "blueCard",
        },
        {
          code: "salary",
          title: "Salário mínimo anual",
          description:
            "50.700 € brutos por ano em 2026, ou 45.934,20 € para profissões em falta, início de carreira e especialistas em TI sem diploma.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "blueCard",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde",
          description:
            "Comprovante de cobertura de seguro de saúde adequada na entrega do pedido.",
          category: "HEALTH",
          source: "skilledWorker",
        },
      ],
      steps: [
        {
          code: "online-application",
          title: "Pedir o visto pelo portal online",
          description:
            "O pedido é feito no portal do Ministério das Relações Exteriores (Auslandsportal). Depois da análise, você recebe um link para agendar a entrevista e a coleta de biometria.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "blueCard",
        },
        {
          code: "residence-permit",
          title: "Retirar o título de residência na Alemanha",
          description:
            "Depois de chegar, o Departamento de Estrangeiros (Ausländerbehörde) emite a autorização de residência com base no visto.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "nationalVisas",
        },
      ],
    },
    {
      slug: "trabalhador-qualificado",
      name: "Trabalhador qualificado",
      officialName: "Visum für Fachkräfte (§ 18a/§ 18b AufenthG)",
      authority: "Representações da Alemanha e Departamento de Estrangeiros",
      category: "work",
      shortDescription:
        "Para quem tem diploma ou formação profissional reconhecidos na Alemanha e uma oferta de emprego compatível.",
      description:
        "Este caminho é para profissionais com diploma universitário ou formação profissional reconhecidos na Alemanha, que tenham uma oferta concreta de emprego compatível com a qualificação.\n\nO reconhecimento é o ponto central: diplomas universitários podem ser conferidos na base anabin; formações técnicas precisam de decisão do órgão alemão responsável. Alguns diplomas brasileiros são tratados como formação profissional na Alemanha.\n\nQuem ainda não tem reconhecimento completo pode olhar os caminhos de reconhecimento parcial ou de parceria de reconhecimento, com regras próprias.",
      overviewSource: "skilledWorker",
      requirements: [
        {
          code: "recognition",
          title: "Qualificação reconhecida na Alemanha",
          description:
            "Diploma universitário com classificação anabin “gleichwertig” ou “entspricht”, ou decisão de reconhecimento da formação profissional. Documentos brasileiros precisam de apostila.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "skilledWorker",
        },
        {
          code: "job-offer",
          title: "Oferta concreta de emprego compatível",
          description:
            "Oferta de emprego na Alemanha compatível com a qualificação, com declaração do trabalho preenchida pelo empregador e descrição do cargo.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "skilledWorker",
        },
        {
          code: "translations",
          title: "Traduções juramentadas",
          description:
            "Diplomas e certificados traduzidos para o alemão por tradutor juramentado.",
          category: "EDUCATION",
          source: "skilledWorker",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde",
          description:
            "Comprovante de cobertura de seguro de saúde adequada na entrega do pedido.",
          category: "HEALTH",
          source: "skilledWorker",
        },
      ],
      steps: [
        {
          code: "online-application",
          title: "Pedir o visto pelo portal online",
          description:
            "Envie o pedido e os documentos pelo Auslandsportal; depois, agende a entrevista para conferência dos originais e biometria.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "skilledWorker",
        },
        {
          code: "residence-permit",
          title: "Retirar o título de residência na Alemanha",
          description:
            "Depois de chegar, o Departamento de Estrangeiros emite a autorização de residência com base no visto.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "nationalVisas",
        },
      ],
    },
    {
      slug: "cartao-de-oportunidades",
      name: "Cartão de oportunidades (Chancenkarte)",
      officialName: "Chancenkarte (§ 20a AufenthG)",
      authority: "Representações da Alemanha e Departamento de Estrangeiros",
      category: "job-search",
      shortDescription:
        "Para formados que querem procurar emprego na Alemanha por até um ano, com sistema de pontos e direito a trabalho de meio período.",
      description:
        "O cartão de oportunidades permite morar na Alemanha por até um ano para procurar emprego ou fazer o reconhecimento da sua qualificação.\n\nQuem tem qualificação totalmente reconhecida tem acesso direto. Os demais precisam de diploma universitário ou formação profissional de pelo menos dois anos, alemão básico (A1) ou inglês B2, e pelo menos 6 pontos no sistema que considera idioma, experiência, idade e vínculo com a Alemanha.\n\nDurante a estadia é possível trabalhar até 20 horas por semana ou fazer trabalhos de teste.",
      overviewSource: "opportunityCard",
      requirements: [
        {
          code: "qualification",
          title: "Diploma ou formação profissional",
          description:
            "Diploma universitário ou formação profissional de pelo menos dois anos reconhecida no país onde foi obtida (ou qualificação totalmente reconhecida na Alemanha, para acesso direto).",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "opportunityCard",
        },
        {
          code: "language",
          title: "Alemão A1 ou inglês B2",
          description:
            "Para o sistema de pontos, é preciso ao menos conhecimentos básicos de alemão (A1) ou inglês em nível B2.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "opportunityCard",
        },
        {
          code: "points",
          title: "Pelo menos 6 pontos",
          description:
            "Pontos por reconhecimento da qualificação, idiomas, experiência, idade, vínculo com a Alemanha e potencial do cônjuge. O site oficial oferece um autoteste.",
          category: "OTHER",
          importance: "HIGH",
          source: "opportunityCard",
        },
        {
          code: "funds",
          title: "Recursos para um ano",
          description:
            "Pelo menos 1.091 € por mês (13.092 € para 12 meses), em conta comum, conta bloqueada (Sperrkonto) ou declaração de compromisso de um anfitrião.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "opportunityCard",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde",
          description: "Comprovante de cobertura de seguro de saúde adequada.",
          category: "HEALTH",
          source: "opportunityCard",
        },
      ],
      steps: [
        {
          code: "self-check",
          title: "Fazer o autoteste de pontos",
          description:
            "Antes de pedir, confira no autoteste oficial se você alcança os 6 pontos.",
          category: "APPLICATION",
          source: "opportunityCard",
        },
        {
          code: "online-application",
          title: "Pedir o visto pelo portal online",
          description:
            "Envie o pedido pelo Auslandsportal e agende a entrevista para conferência dos originais e biometria.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "opportunityCard",
        },
      ],
    },
    {
      slug: "estudo",
      name: "Estudo (graduação, mestrado e doutorado)",
      officialName: "Aufenthaltserlaubnis zum Studium",
      authority: "Departamento de Estrangeiros (Ausländerbehörde)",
      category: "study",
      shortDescription:
        "Brasileiros admitidos em universidade alemã podem entrar sem visto e pedir a residência na Alemanha em até 90 dias.",
      description:
        "Brasileiros matriculados em universidade alemã (inclusive doutorado) podem entrar na Alemanha sem visto e pedir a autorização de residência no Departamento de Estrangeiros em até 90 dias. Também é possível pedir o visto antes, no Brasil.\n\nÉ preciso comprovar recursos de pelo menos 992 € por mês (11.904 € por ano), em geral com conta bloqueada, bolsa ou declaração de compromisso.\n\nDurante os estudos é permitido trabalhar 120 dias inteiros ou 240 meios dias por ano. Depois de formado, é possível ficar para procurar emprego.",
      overviewSource: "study",
      requirements: [
        {
          code: "admission",
          title: "Admissão em universidade ou Studienkolleg",
          description:
            "Comprovante de admissão em universidade alemã (com ou sem curso preparatório de idioma) ou em Studienkolleg.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "study",
        },
        {
          code: "language",
          title: "Domínio da língua do curso",
          description:
            "Em geral, nível B2 na língua de ensino, salvo se a universidade já confirmou no comprovante de admissão ou houver curso preparatório.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "funds",
          title: "Recursos de 992 € por mês",
          description:
            "Pelo menos 11.904 € para um ano, por conta bloqueada, bolsa (como DAAD) ou declaração de compromisso de alguém residente na Alemanha.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "study",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde",
          description: "Comprovante de cobertura de seguro de saúde adequada.",
          category: "HEALTH",
          importance: "HIGH",
          source: "study",
        },
      ],
      steps: [
        {
          code: "entry",
          title: "Entrar na Alemanha (sem visto para brasileiros)",
          description:
            "Brasileiros matriculados podem entrar sem visto. Se viajar por outro país, confira se ele exige visto de entrada.",
          category: "ENTRY",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "residence-permit",
          title: "Pedir a residência em até 90 dias",
          description:
            "Peça a autorização de residência para estudo no Departamento de Estrangeiros da sua cidade em até 90 dias após a entrada.",
          category: "AFTER_ARRIVAL",
          importance: "CRITICAL",
          source: "study",
        },
      ],
    },
    {
      slug: "reuniao-com-conjuge",
      name: "Reunião familiar com cônjuge",
      officialName: "Ehegattennachzug",
      authority: "Departamento de Estrangeiros (Ausländerbehörde)",
      category: "family",
      shortDescription:
        "Para casados com quem mora na Alemanha. Brasileiros podem entrar sem visto e pedir a residência lá em até 90 dias.",
      description:
        "Quem é casado com uma pessoa que mora na Alemanha (ou vai se mudar junto) pode pedir a residência para viver com o cônjuge. Brasileiros não precisam pedir visto no Brasil: podem entrar e pedir a autorização no Departamento de Estrangeiros em até 90 dias.\n\nÉ preciso um casamento válido pela lei alemã; união estável não dá direito a este visto. Em alguns casos é exigido alemão básico (A1), com exceções, por exemplo, para cônjuges de cidadãos europeus não alemães.\n\nQuando o cônjuge na Alemanha não é cidadão da UE, também se pedem título de residência, contrato de aluguel e comprovante de renda dele.",
      overviewSource: "spouse",
      requirements: [
        {
          code: "marriage",
          title: "Casamento válido pela lei alemã",
          description:
            "Certidão de casamento com apostila e tradução juramentada para o alemão. União estável não dá direito a este caminho.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "spouse",
        },
        {
          code: "sponsor-documents",
          title: "Documentos do cônjuge na Alemanha",
          description:
            "Passaporte ou identidade do cônjuge e, se ele não for da UE, título de residência, registro de endereço, contrato de aluguel e comprovante de renda.",
          category: "FAMILY",
          importance: "HIGH",
          source: "spouse",
        },
        {
          code: "german-a1",
          title: "Alemão básico (A1), quando exigido",
          description:
            "Certificado A1 de instituição credenciada pela ALTE, com exceções previstas, como para cônjuges de cidadãos europeus não alemães.",
          category: "EDUCATION",
          source: "spouse",
        },
        {
          code: "health-insurance",
          title: "Seguro de saúde",
          description: "Comprovante de cobertura de seguro de saúde adequada.",
          category: "HEALTH",
          source: "spouse",
        },
      ],
      steps: [
        {
          code: "entry",
          title: "Entrar na Alemanha ou pedir o visto antes",
          description:
            "Brasileiros podem entrar sem visto; quem preferir pode pedir o visto pelo portal online antes da viagem.",
          category: "ENTRY",
          importance: "HIGH",
          source: "spouse",
        },
        {
          code: "residence-permit",
          title: "Pedir a residência em até 90 dias",
          description:
            "Leve os documentos (com traduções) ao Departamento de Estrangeiros da sua cidade em até 90 dias após a entrada.",
          category: "AFTER_ARRIVAL",
          importance: "CRITICAL",
          source: "spouse",
        },
      ],
    },
  ],
};
