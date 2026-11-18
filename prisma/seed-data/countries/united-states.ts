import type { CountryContent } from "./types";

// Estados Unidos: consulta em 18/11/2026 às páginas do USCIS (uscis.gov).
// As regras de H-1B estavam em disputa judicial na data da consulta.
export const unitedStatesContent: CountryContent = {
  code: "US",
  slug: "united-states",
  name: "Estados Unidos",
  consultedAt: "2026-11-18",
  coverageLevel: "PARTIAL",
  sources: {
    h1b: {
      title: "H-1B Specialty Occupations",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
    },
    students: {
      title: "Students and Employment",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment",
    },
    spouse: {
      title:
        "Bringing Spouses to Live in the United States as Permanent Residents",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      url: "https://www.uscis.gov/family/bring-spouse-to-live-in-US",
    },
  },
  visas: [
    {
      slug: "h-1b",
      name: "H-1B (ocupação especializada)",
      officialName: "H-1B Specialty Occupations",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      category: "work",
      shortDescription:
        "Para cargos que exigem diploma de bacharel em área específica, com petição do empregador e, em geral, seleção pelo sorteio anual (cap).",
      description:
        "O H-1B é um visto de trabalho temporário para ocupações especializadas, que exigem pelo menos diploma de bacharel (ou equivalente) em área diretamente relacionada. Quem pede é o empregador americano.\n\nHá um limite anual de 65.000 vagas, mais 20.000 para quem tem mestrado ou acima em instituição americana; para vagas sujeitas ao limite, o empregador precisa ser selecionado no registro eletrônico. Universidades e organizações de pesquisa sem fins lucrativos não entram no limite.\n\nA estadia inicial é de até 3 anos, renovável até 6. As regras de taxas mudaram em 2026 e estavam em disputa judicial; confira o aviso atual no site do USCIS.",
      overviewSource: "h1b",
      requirements: [
        {
          code: "specialty-occupation",
          title: "Cargo de ocupação especializada",
          description:
            "A função exige conhecimento altamente especializado e, como mínimo, diploma de bacharel em área diretamente relacionada.",
          category: "EMPLOYMENT",
          importance: "CRITICAL",
          source: "h1b",
        },
        {
          code: "degree",
          title: "Diploma de bacharel ou equivalente",
          description:
            "Diploma americano ou estrangeiro equivalente em área relacionada, ou formação e experiência equivalentes; profissões licenciadas exigem a licença estadual.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "h1b",
        },
        {
          code: "cap-registration",
          title: "Seleção no registro do cap",
          description:
            "Para vagas sujeitas ao limite anual, a petição só é aceita com base em registro eletrônico selecionado para o ano fiscal.",
          category: "OTHER",
          importance: "HIGH",
          source: "h1b",
        },
      ],
      steps: [
        {
          code: "lca",
          title: "Empregador obtém a LCA no Departamento do Trabalho",
          description:
            "O empregador pede e recebe a certificação da Labor Condition Application (LCA).",
          category: "APPLICATION",
          importance: "HIGH",
          source: "h1b",
        },
        {
          code: "i129",
          title: "Empregador envia o formulário I-129",
          description:
            "Com a LCA certificada, o empregador envia a petição I-129 ao USCIS, com as taxas vigentes.",
          category: "APPLICATION",
          importance: "CRITICAL",
          source: "h1b",
        },
        {
          code: "family",
          title: "Família no H-4",
          description:
            "Cônjuge e filhos solteiros menores de 21 anos podem acompanhar no H-4; alguns cônjuges podem pedir autorização de trabalho.",
          category: "AFTER_ARRIVAL",
          source: "h1b",
        },
      ],
    },
    {
      slug: "f-1",
      name: "Estudante (F-1)",
      officialName: "F-1 Academic Student",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      category: "study",
      shortDescription:
        "Para estudo em tempo integral em escola aprovada pelo SEVP, com recursos para todo o curso e vínculo com o país de origem.",
      description:
        "O F-1 é o visto para estudantes em tempo integral em faculdades, universidades, escolas de idiomas e outras instituições certificadas pelo programa SEVP.\n\nÉ preciso ter recursos para se manter durante todo o curso, inglês suficiente (ou curso que leve a ele) e manter residência no exterior, sem intenção de abandoná-la.\n\nNo primeiro ano, só é permitido trabalhar no campus. Depois, há formas de trabalho fora do campus ligadas à área de estudo, como CPT e OPT, sempre com autorização prévia.",
      overviewSource: "students",
      requirements: [
        {
          code: "sevp-school",
          title: "Escola aprovada pelo SEVP",
          description:
            "Matrícula em tempo integral em programa acadêmico ou de idiomas de instituição aprovada pelo Student and Exchange Visitor Program.",
          category: "EDUCATION",
          importance: "CRITICAL",
          source: "students",
        },
        {
          code: "funds",
          title: "Recursos para todo o curso",
          description:
            "Dinheiro suficiente para se manter durante todo o período de estudo proposto.",
          category: "FINANCIAL",
          importance: "CRITICAL",
          source: "students",
        },
        {
          code: "english",
          title: "Inglês",
          description:
            "Proficiência em inglês ou matrícula em cursos que levem a ela.",
          category: "EDUCATION",
          importance: "HIGH",
          source: "students",
        },
        {
          code: "residence-abroad",
          title: "Residência no exterior",
          description:
            "Manter residência no país de origem, sem intenção de abandoná-la.",
          category: "OTHER",
          importance: "HIGH",
          source: "students",
        },
      ],
      steps: [
        {
          code: "work-rules",
          title: "Seguir as regras de trabalho",
          description:
            "No primeiro ano, só trabalho no campus. Depois, CPT ou OPT relacionados à área, autorizados antes pelo responsável da escola (DSO) e pelo USCIS.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "students",
        },
      ],
    },
    {
      slug: "spouse-green-card",
      name: "Green card para cônjuge",
      officialName: "Spouse of U.S. citizen or permanent resident (Form I-130)",
      authority: "U.S. Citizenship and Immigration Services (USCIS)",
      category: "family",
      shortDescription:
        "Cidadãos americanos e residentes permanentes podem pedir o green card do cônjuge com o formulário I-130.",
      description:
        "Para morar nos Estados Unidos com o cônjuge como residente permanente, quem faz o pedido é o cônjuge cidadão americano ou portador de green card, com o formulário I-130.\n\nSe o cônjuge estrangeiro está fora dos EUA, depois da aprovação do I-130 o caso segue para o consulado. Para cônjuges de residentes permanentes, é preciso esperar um número de visto disponível.\n\nSe o casamento tiver menos de 2 anos quando o green card for concedido, a residência é condicional; o casal pede a retirada das condições (I-751) nos 90 dias antes do vencimento.",
      overviewSource: "spouse",
      requirements: [
        {
          code: "petitioner-status",
          title: "Cônjuge cidadão ou residente permanente",
          description:
            "O peticionário comprova cidadania (passaporte, certidão ou naturalização) ou residência permanente (green card).",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "spouse",
        },
        {
          code: "marriage",
          title: "Casamento civil comprovado",
          description:
            "Certidão de casamento civil e comprovação do fim de casamentos anteriores (divórcio, óbito ou anulação).",
          category: "FAMILY",
          importance: "CRITICAL",
          source: "spouse",
        },
      ],
      steps: [
        {
          code: "i130",
          title: "Enviar o formulário I-130",
          description:
            "O cônjuge nos EUA envia o I-130 com taxa, certidões, fotos e prova de status.",
          category: "APPLICATION",
          importance: "CRITICAL",
          source: "spouse",
        },
        {
          code: "consular",
          title: "Processo consular",
          description:
            "Aprovado o I-130 (e havendo número de visto, no caso de residentes permanentes), o consulado informa os próximos passos.",
          category: "ENTRY",
          importance: "HIGH",
          source: "spouse",
        },
        {
          code: "remove-conditions",
          title: "Retirar as condições da residência",
          description:
            "Se a residência for condicional, o casal envia o I-751 nos 90 dias antes do vencimento do cartão.",
          category: "AFTER_ARRIVAL",
          importance: "HIGH",
          source: "spouse",
        },
      ],
    },
  ],
};
