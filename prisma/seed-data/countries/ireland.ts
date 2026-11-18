import type { CountryContent } from "./types";

// Irlanda além do Critical Skills (que tem seed próprio em critical-skills.ts).
// Consulta às fontes oficiais em 18/11/2026.
export const irelandContent: CountryContent = {
  code: "IE",
  slug: "ireland",
  name: "Irlanda",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    generalEmployment: {
      title: "General Employment Permit",
      authority: "Department of Enterprise, Tourism and Employment (DETE)",
      url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/general-employment-permit/",
    },
    workImmigration: {
      title: "Coming to work in Ireland",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/",
    },
    registration: {
      title: "Registering your immigration permission",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/registering-your-immigration-permission/",
    },
    study: {
      title: "Coming to study in Ireland",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/",
    },
    studyFaq: {
      title: "Frequently asked questions for students",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/",
    },
    studyFinances: {
      title: "Information on student finances",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/information-on-student-finances/",
    },
    family: {
      title: "Coming to join family in Ireland",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-join-family-in-ireland/",
    },
    familyFaq: {
      title: "Frequently asked questions for joining family",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-join-family-in-ireland/frequently-asked-questions-for-joining-family/",
    },
    familyThresholds: {
      title: "Financial thresholds for family reunification",
      authority: "Immigration Service Delivery (ISD)",
      url: "https://www.irishimmigration.ie/coming-to-join-family-in-ireland/financial-thresholds/",
    },
  },
  visas: [
    {
      slug: "general-employment-permit",
      name: "General Employment Permit",
      officialName: "General Employment Permit",
      authority: "Department of Enterprise, Tourism and Employment (DETE)",
      category: "work",
      shortDescription:
        "Autorização de trabalho para uma oferta de emprego em ocupação que não esteja na lista de inelegíveis, com salário mínimo e, em geral, teste de mercado.",
      description:
        "É a autorização de trabalho mais ampla da Irlanda: qualquer ocupação pode ser aceita, desde que não esteja na lista de ocupações inelegíveis e que a oferta atinja o salário mínimo exigido.\n\nNa maioria dos casos o empregador precisa antes anunciar a vaga para mostrar que não encontrou candidato no Espaço Econômico Europeu (o chamado teste de mercado de trabalho). A autorização vale inicialmente por até dois anos e pode ser renovada.\n\nA autorização de trabalho é só a primeira parte: depois dela vêm o visto (se a sua nacionalidade exigir) e o registro na imigração ao chegar.",
      overviewSource: "generalEmployment",
      requirements: [
        {
          code: "job-offer",
          title: "Oferta de emprego na Irlanda",
          description:
            "É preciso ter uma oferta de trabalho de um empregador registrado na Irlanda, para uma ocupação que não esteja na lista de ocupações inelegíveis.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "generalEmployment",
        },
        {
          code: "minimum-salary",
          title: "Salário mínimo da oferta",
          description:
            "A regra geral pede pelo menos €36.605 por ano. Algumas funções (como assistentes de cuidados de saúde e de apoio domiciliar) têm piso de €32.691, e recém-formados em instituição irlandesa nos últimos 12 meses têm piso de €34.009. Confira o valor vigente na página oficial.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "generalEmployment",
        },
        {
          code: "labour-market-test",
          title: "Teste de mercado de trabalho",
          description:
            "Em geral, o empregador deve anunciar a vaga nos serviços públicos de emprego e em outra plataforma antes do pedido. Há exceções, por exemplo para ocupações da lista de habilidades críticas ou ofertas a partir de €68.911 por ano.",
          category: "EMPLOYMENT",
          importance: "HIGH",
          source: "generalEmployment",
        },
        {
          code: "fifty-fifty",
          title: "Regra 50:50 do empregador",
          description:
            "No momento do pedido, pelo menos metade dos funcionários da empresa deve ser do Espaço Econômico Europeu, salvo exceções para empresas novas apoiadas por agências do governo.",
          category: "EMPLOYMENT",
          source: "generalEmployment",
        },
        {
          code: "qualifications",
          title: "Qualificação e experiência para a função",
          description:
            "Você deve ter as qualificações, habilidades ou experiência necessárias para o cargo oferecido.",
          category: "EDUCATION",
          source: "generalEmployment",
        },
      ],
      steps: [
        {
          code: "permit-application",
          title: "Pedir a autorização de trabalho",
          description:
            "O pedido é feito online, por você ou pelo empregador, depois do teste de mercado quando ele for exigido. A taxa é de €500 para até 6 meses ou €1.000 para até 24 meses; em caso de recusa, 90% é devolvido.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "generalEmployment",
        },
        {
          code: "entry-visa",
          title: "Visto de entrada, se sua nacionalidade exigir",
          description:
            "Com a autorização aprovada, quem precisa de visto pede o visto de trabalho. Quem não precisa apresenta os documentos ao oficial de imigração na chegada.",
          category: "ENTRY",
          source: "workImmigration",
        },
        {
          code: "registration",
          title: "Registrar a permissão de residência",
          description:
            "Para ficar mais de 90 dias, é preciso registrar a permissão na imigração e receber o cartão de residência (IRP).",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "registration",
        },
        {
          code: "renewal",
          title: "Planejar a renovação",
          description:
            "A autorização pode ser renovada por até 3 anos, com pedido até 4 meses antes do vencimento. Depois de 5 anos com a autorização, é possível pedir residência de longo prazo ao Departamento de Justiça.",
          category: "AFTER_ARRIVAL",
          source: "generalEmployment",
        },
      ],
    },
    {
      slug: "student-stamp-2",
      name: "Estudante (Stamp 2)",
      officialName: "Student permission (Stamp 2)",
      authority: "Immigration Service Delivery (ISD)",
      category: "study",
      shortDescription:
        "Permissão para estudar em tempo integral em curso da lista oficial (ILEP), com direito a trabalho limitado durante o curso.",
      description:
        "Quem vai estudar na Irlanda por mais de 90 dias precisa de uma permissão de estudante, registrada como Stamp 2. O curso deve ser presencial, diurno, em tempo integral e estar na lista oficial de programas aceitos (ILEP).\n\nA permissão permite trabalhar até 20 horas por semana no período de aulas e até 40 horas nos períodos de férias definidos pelo governo. Há limites de tempo: cursos de inglês somam no máximo dois anos, e o total como estudante é limitado.\n\nQuem é de país que não exige visto (como o Brasil) viaja sem visto, mas deve levar os documentos e registrar a permissão depois de chegar.",
      overviewSource: "study",
      requirements: [
        {
          code: "ilep-course",
          title: "Matrícula em curso da lista ILEP",
          description:
            "O curso deve ser em tempo integral, diurno e estar listado no ILEP. Cursos a distância ou de meio período não dão direito à permissão de estudante.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "studyFaq",
        },
        {
          code: "fees-paid",
          title: "Taxas do curso pagas",
          description:
            "Você precisa da carta de aceitação da instituição e da comprovação de pagamento das taxas, feito por transferência eletrônica (não em dinheiro).",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "studyFaq",
        },
        {
          code: "finances",
          title: "Comprovação de recursos",
          description:
            "É preciso mostrar acesso imediato a pelo menos €10.000 para um ano de curso (ou €833 por mês, até €6.665, para estadias de até 8 meses), além das taxas.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "studyFinances",
        },
        {
          code: "medical-insurance",
          title: "Seguro de saúde privado",
          description:
            "Todos os estudantes de fora do Espaço Econômico Europeu precisam de seguro de saúde privado e devem apresentá-lo no registro.",
          category: "HEALTH",
          importance: "HIGH",
          source: "studyFaq",
        },
        {
          code: "english-course-rules",
          title: "Regras para cursos de inglês",
          description:
            "Cursos de idioma devem ter ao menos 25 semanas e 15 horas de aula por semana, com frequência mínima de 85% e exame reconhecido no final. Cada permissão cobre até 8 meses, com no máximo três cursos.",
          category: "EDUCATION",
          source: "studyFaq",
        },
      ],
      steps: [
        {
          code: "border-documents",
          title: "Levar os documentos na viagem",
          description:
            "Na chegada, o oficial de imigração decide a entrada com base nos documentos apresentados: passaporte, carta da instituição, comprovantes de pagamento, recursos e seguro. Quem precisa de visto pede o visto de longa duração antes.",
          category: "ENTRY",
          importance: "HIGH",
          source: "study",
        },
        {
          code: "registration",
          title: "Registrar a permissão (Stamp 2)",
          description:
            "Para ficar mais de 90 dias, agende o registro pelo portal da imigração. A taxa de registro é de €300 e você recebe o cartão IRP com Stamp 2.",
          category: "AFTER_ARRIVAL",
          importance: "CRITICAL",
          source: "studyFaq",
        },
        {
          code: "work-limits",
          title: "Respeitar os limites de trabalho",
          description:
            "Até 20 horas por semana nas aulas; até 40 horas em junho, julho, agosto e setembro e de 15 de dezembro a 15 de janeiro.",
          category: "AFTER_ARRIVAL",
          source: "studyFaq",
        },
      ],
    },
    {
      slug: "join-family",
      name: "Reunião familiar",
      officialName: "Join family (non-EEA family reunification)",
      authority: "Immigration Service Delivery (ISD)",
      category: "family",
      shortDescription:
        "Para cônjuges, parceiros e filhos que vão morar com um familiar irlandês ou com um estrangeiro que já vive legalmente na Irlanda.",
      description:
        "A reunião familiar permite que cônjuges, parceiros civis, parceiros de fato e filhos menores vivam com um familiar na Irlanda. As regras dependem de quem é o familiar que já está lá (o patrocinador).\n\nO governo separa os patrocinadores em categorias: cidadãos irlandeses; titulares de autorizações como a Critical Skills, que podem trazer a família de imediato; e titulares de autorizações como a General Employment, que em geral precisam esperar 12 meses e comprovar renda.\n\nA política de reunião familiar foi atualizada em junho de 2026. Confira a versão vigente antes de planejar.",
      overviewSource: "family",
      requirements: [
        {
          code: "relationship",
          title: "Relação familiar comprovada",
          description:
            "Você deve comprovar o casamento, a parceria civil ou uma relação estável e de longo prazo com o patrocinador, ou ser filho menor de 18 anos e solteiro.",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "family",
        },
        {
          code: "sponsor-category",
          title: "Categoria do familiar na Irlanda",
          description:
            "Titulares de Critical Skills e de algumas outras autorizações podem pedir de imediato. Titulares de General Employment, em geral, só depois de 12 meses trabalhando legalmente na Irlanda.",
          category: "FAMILY",
          importance: "HIGH",
          source: "familyFaq",
        },
        {
          code: "sponsor-income",
          title: "Renda do patrocinador",
          description:
            "Cidadãos irlandeses precisam de renda bruta de pelo menos €75.000 somada nos três anos anteriores. Titulares de General Employment precisam de renda acima de €30.000 no ano anterior, com valores maiores quando há filhos. Só a renda do patrocinador conta.",
          category: "FINANCIAL",
          importance: "HIGH",
          source: "familyThresholds",
        },
      ],
      steps: [
        {
          code: "application",
          title: "Pedir a autorização de reunião familiar",
          description:
            "Quem precisa de visto pede o visto de longa duração de reunião familiar. Quem não precisa deve seguir o caminho indicado pela imigração para a sua categoria antes de viajar.",
          category: "APPLICATION",
          importance: "HIGH",
          source: "family",
        },
        {
          code: "registration",
          title: "Registrar a permissão",
          description:
            "Quem fica mais de 90 dias deve registrar a permissão na imigração. Cônjuges e parceiros aceitos pela política costumam receber Stamp 1G, que permite trabalhar sem autorização de trabalho própria.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "registration",
        },
      ],
    },
  ],
};
