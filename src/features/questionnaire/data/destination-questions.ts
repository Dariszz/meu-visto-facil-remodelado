import type { QuestionView } from "../types";

// Perguntas do perfil migratório dos destinos além da Irlanda. Os códigos são
// os mesmos em todos os países (contrato com normalizeProfile); o texto usa o
// nome do destino e cada país só recebe as perguntas que as regras dele usam.
export type DestinationQuestionConfig = {
  // "em Portugal", "na Itália", "nos Estados Unidos"…
  inName: string;
  // eu: destino da UE (UE/EEE/Suíça não precisam de visto);
  // uk: Reino Unido; local: cidadania ou residência permanente do destino.
  passport: "eu" | "uk" | "local";
  // Rótulo da opção "local" (ex.: "Sou cidadão ou residente permanente do Canadá").
  localLabel?: string;
  // Categorias de visto revisadas no destino (vindas do conteúdo).
  categories: ReadonlySet<
    "work" | "study" | "family" | "remote-work" | "residence" | "job-search"
  >;
  asksEnglish?: boolean;
  asksGerman?: boolean;
  asksAge?: boolean;
};

const objectiveOptions = (config: DestinationQuestionConfig) => [
  {
    value: "work",
    label: "Trabalhar com contrato",
    description: "Emprego em uma empresa do país.",
  },
  ...(config.categories.has("job-search")
    ? [
        {
          value: "job_search",
          label: "Ir procurar emprego",
          description: "Chegar sem oferta e buscar trabalho lá.",
        },
      ]
    : []),
  ...(config.categories.has("remote-work")
    ? [
        {
          value: "remote_work",
          label: "Morar e trabalhar remotamente",
          description: "Para empresa ou clientes de fora do país.",
        },
      ]
    : []),
  { value: "study", label: "Estudar", description: "Graduação, pós ou curso." },
  {
    value: "family",
    label: "Morar com familiares",
    description: "Cônjuge, parceiro(a) ou familiar que já mora lá.",
  },
  ...(config.categories.has("residence")
    ? [
        {
          value: "own_income",
          label: "Morar com renda própria",
          description: "Aposentadoria, aluguéis ou investimentos.",
        },
      ]
    : []),
  {
    value: "exploring",
    label: "Ainda estou explorando",
    description: "Quero ver todos os caminhos possíveis.",
  },
];

const passportOptions = (config: DestinationQuestionConfig) => {
  if (config.passport === "eu")
    return [
      {
        value: "eea",
        label: "União Europeia, Espaço Econômico Europeu ou Suíça",
      },
      { value: "uk", label: "Reino Unido" },
      {
        value: "other",
        label: "Outro país",
        description: "Por exemplo, Brasil.",
      },
    ];
  if (config.passport === "uk")
    return [
      { value: "uk", label: "Reino Unido" },
      { value: "ie", label: "Irlanda" },
      {
        value: "eea",
        label: "Outro país da União Europeia, do EEE ou Suíça",
      },
      {
        value: "other",
        label: "Outro país",
        description: "Por exemplo, Brasil.",
      },
    ];
  return [
    { value: "local", label: config.localLabel ?? "Sou cidadão deste país" },
    {
      value: "other",
      label: "Tenho passaporte de outro país",
      description: "Por exemplo, Brasil.",
    },
  ];
};

const workObjectives = ["work", "exploring"];

export function buildDestinationQuestions(
  config: DestinationQuestionConfig,
): QuestionView[] {
  const { inName } = config;
  const has = (category: Parameters<typeof config.categories.has>[0]) =>
    config.categories.has(category);
  const questions: QuestionView[] = [
    {
      code: "objective",
      shortLabel: "Objetivo",
      question: `Qual é o seu principal objetivo ${inName}?`,
      description: "Isso define quais caminhos vamos analisar primeiro.",
      type: "SINGLE_SELECT",
      required: true,
      options: objectiveOptions(config),
    },
    {
      code: "region",
      shortLabel: "Passaporte",
      question:
        config.passport === "local"
          ? "Qual é a sua situação de cidadania?"
          : "De onde é o seu passaporte?",
      description:
        "Algumas exigências mudam conforme a nacionalidade. Não pedimos o número do documento.",
      type: "SINGLE_SELECT",
      required: true,
      options: passportOptions(config),
    },
    {
      code: "has_employment_offer",
      shortLabel: "Oferta de emprego",
      question: `Você já tem uma oferta de emprego de uma empresa ${inName}?`,
      type: "BOOLEAN",
      required: true,
      showIf: { questionCode: "objective", equalsAnyOf: workObjectives },
    },
    {
      code: "occupation_area",
      shortLabel: "Área",
      question: "Em qual área você atua?",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "technology", label: "Tecnologia" },
        { value: "engineering", label: "Engenharia" },
        { value: "healthcare", label: "Saúde" },
        { value: "education", label: "Educação" },
        { value: "other", label: "Outra área" },
      ],
      showIf: {
        questionCode: "objective",
        equalsAnyOf: [...workObjectives, "job_search", "remote_work"],
      },
    },
    {
      code: "education_level",
      shortLabel: "Formação",
      question: "Qual é a sua formação mais alta (concluída)?",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "secondary", label: "Ensino médio" },
        {
          value: "technical",
          label: "Curso técnico ou formação profissional",
        },
        { value: "degree", label: "Graduação (bacharelado ou licenciatura)" },
        {
          value: "postgraduate",
          label: "Pós-graduação, mestrado ou doutorado",
        },
      ],
    },
    {
      code: "experience_years",
      shortLabel: "Experiência",
      question:
        "Quantos anos de experiência profissional na sua área você tem?",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "none", label: "Nenhuma ainda" },
        { value: "under_1", label: "Menos de 1 ano" },
        { value: "1_3", label: "De 1 a 3 anos" },
        { value: "3_5", label: "De 3 a 5 anos" },
        { value: "5_plus", label: "5 anos ou mais" },
      ],
      showIf: {
        questionCode: "objective",
        equalsAnyOf: [...workObjectives, "job_search", "remote_work"],
      },
    },
  ];

  if (config.asksAge)
    questions.push({
      code: "age_range",
      shortLabel: "Idade",
      question: "Qual é a sua faixa de idade?",
      description: "Algumas regras usam idade em limites ou pontuação.",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "under_21", label: "Menos de 21 anos" },
        { value: "21_29", label: "De 21 a 29 anos" },
        { value: "30_39", label: "De 30 a 39 anos" },
        { value: "40_44", label: "De 40 a 44 anos" },
        { value: "45_plus", label: "45 anos ou mais" },
      ],
    });

  if (config.asksEnglish)
    questions.push({
      code: "english_level",
      shortLabel: "Inglês",
      question: "Como você avalia o seu inglês hoje?",
      description:
        "Uma estimativa basta. Os vistos costumam exigir comprovação por teste oficial.",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "basic", label: "Básico (A1–A2)" },
        { value: "intermediate", label: "Intermediário (B1)" },
        { value: "upper", label: "Intermediário avançado (B2)" },
        { value: "advanced", label: "Avançado ou fluente (C1–C2)" },
      ],
    });

  if (config.asksGerman)
    questions.push({
      code: "german_level",
      shortLabel: "Alemão",
      question: "Como você avalia o seu alemão hoje?",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "none", label: "Não falo alemão" },
        { value: "a1_a2", label: "Básico (A1–A2)" },
        { value: "b1", label: "Intermediário (B1)" },
        { value: "b2_plus", label: "B2 ou mais" },
      ],
    });

  questions.push(...studyQuestions(inName));

  if (has("remote-work"))
    questions.push(
      {
        code: "works_remotely",
        shortLabel: "Trabalho remoto",
        question:
          "Você trabalha remotamente para empresa ou clientes de fora do país de destino?",
        description: "Como empregado(a) ou como autônomo(a)/PJ.",
        type: "BOOLEAN",
        required: true,
        showIf: {
          questionCode: "objective",
          equalsAnyOf: ["remote_work", "exploring"],
        },
      },
      {
        code: "remote_income",
        shortLabel: "Renda do trabalho remoto",
        question: "Quanto você ganha por mês com esse trabalho, em euros?",
        description: "Valor bruto aproximado, convertido para euros.",
        type: "SINGLE_SELECT",
        required: true,
        options: [
          { value: "under_2200", label: "Menos de 2.200 €" },
          { value: "2200_2450", label: "De 2.200 € a 2.450 €" },
          { value: "2450_3700", label: "De 2.450 € a 3.700 €" },
          { value: "3700_plus", label: "3.700 € ou mais" },
        ],
        showIf: { questionCode: "works_remotely", equalsAnyOf: [true] },
      },
      {
        code: "remote_months",
        shortLabel: "Tempo no trabalho remoto",
        question: "Há quanto tempo você trabalha remotamente nesse vínculo?",
        type: "SINGLE_SELECT",
        required: true,
        options: [
          { value: "under_3", label: "Menos de 3 meses" },
          { value: "3_6", label: "De 3 a 6 meses" },
          { value: "6_plus", label: "6 meses ou mais" },
        ],
        showIf: { questionCode: "works_remotely", equalsAnyOf: [true] },
      },
    );

  if (has("residence"))
    questions.push({
      code: "passive_income",
      shortLabel: "Renda própria",
      question:
        "Quanto você recebe por mês de aposentadoria, aluguéis ou investimentos, em euros?",
      description: "Renda que não vem de emprego. Valor aproximado.",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "none", label: "Não tenho renda desse tipo" },
        { value: "under_1000", label: "Menos de 1.000 €" },
        { value: "1000_2400", label: "De 1.000 € a 2.400 €" },
        { value: "2400_2600", label: "De 2.400 € a 2.600 €" },
        { value: "2600_plus", label: "2.600 € ou mais" },
      ],
      showIf: {
        questionCode: "objective",
        equalsAnyOf: ["own_income", "exploring"],
      },
    });

  questions.push(...familyQuestions(inName));
  return questions;
}

// Perguntas de estudo e família, também usadas pela Irlanda.
export function studyQuestions(inName: string): QuestionView[] {
  return [
    {
      code: "has_admission",
      shortLabel: "Aceite da instituição",
      question: `Você já foi aceito(a) por uma instituição de ensino ${inName}?`,
      description: "Carta de aceitação, matrícula ou pré-inscrição validada.",
      type: "BOOLEAN",
      required: true,
      showIf: {
        questionCode: "objective",
        equalsAnyOf: ["study", "exploring"],
      },
    },
    {
      code: "has_funds",
      shortLabel: "Recursos para se manter",
      question:
        "Você consegue comprovar recursos para se manter durante a estadia?",
      description:
        "Por extratos, bolsa de estudos ou alguém que se responsabilize por você.",
      type: "BOOLEAN",
      required: true,
      showIf: {
        questionCode: "objective",
        equalsAnyOf: ["study", "job_search", "exploring"],
      },
    },
  ];
}

export function familyQuestions(inName: string): QuestionView[] {
  return [
    {
      code: "family_in_country",
      shortLabel: "Família no destino",
      question: `Você tem cônjuge, parceiro(a) ou familiar próximo morando legalmente ${inName}?`,
      type: "BOOLEAN",
      required: true,
      showIf: {
        questionCode: "objective",
        equalsAnyOf: ["family", "exploring"],
      },
    },
    {
      code: "family_relationship",
      shortLabel: "Parentesco",
      question: "Qual é a relação dessa pessoa com você?",
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "spouse", label: "Cônjuge (casamento civil)" },
        {
          value: "partner",
          label: "Parceiro(a) em união estável ou relação duradoura",
        },
        { value: "parent", label: "Pai ou mãe (eu sou filho ou filha)" },
        { value: "other", label: "Outro familiar" },
      ],
      showIf: { questionCode: "family_in_country", equalsAnyOf: [true] },
    },
    {
      code: "family_sponsor_status",
      shortLabel: "Situação do familiar",
      question: `Qual é a situação dessa pessoa ${inName}?`,
      type: "SINGLE_SELECT",
      required: true,
      options: [
        { value: "citizen", label: "É cidadã do país" },
        { value: "permanent", label: "Tem residência permanente" },
        {
          value: "temporary",
          label: "Tem residência temporária",
          description: "Por exemplo, por trabalho ou estudo.",
        },
        { value: "unknown", label: "Não sei" },
      ],
      showIf: { questionCode: "family_in_country", equalsAnyOf: [true] },
    },
  ];
}
