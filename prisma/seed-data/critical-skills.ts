// Consulta editorial em 10/09/2026; não constitui revisão jurídica.
export const criticalSkillsSources = {
  permit: {
    title: "Critical Skills Employment Permit",
    authority: "Department of Enterprise, Tourism and Employment (DETE)",
    url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/",
  },
  entry: {
    title: "Coming to work in Ireland",
    authority:
      "Immigration Service Delivery (ISD) — Department of Justice, Home Affairs and Migration",
    url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/",
  },
  residence: {
    title: "Registering your immigration permission",
    authority:
      "Immigration Service Delivery (ISD) — Department of Justice, Home Affairs and Migration",
    url: "https://www.irishimmigration.ie/registering-your-immigration-permission/",
  },
} as const;

export type CriticalSkillsSourceId = keyof typeof criticalSkillsSources;
type EditorialItem = {
  title: string;
  text: string;
  source: CriticalSkillsSourceId;
};

export const criticalSkills = {
  name: "Critical Skills Employment Permit",
  category: "Trabalho",
  consultedAt: "2026-09-10",
  consultedLabel: "10 de setembro de 2026",
  description:
    "Uma permissão de trabalho voltada a profissionais altamente qualificados para atuar na Irlanda.",
  audience:
    "Pode ser relevante para quem tem uma oferta de emprego na Irlanda em ocupação compatível com os critérios de Critical Skills.",
  requirements: [
    {
      title: "Oferta de emprego",
      text: "Oferta por pelo menos dois anos, de empregador estabelecido e em atividade na Irlanda.",
      source: "permit",
    },
    {
      title: "Ocupação e remuneração",
      text: "O enquadramento depende da ocupação e da remuneração proposta. Confira as listas e os limites vigentes na fonte oficial.",
      source: "permit",
    },
    {
      title: "Qualificações e experiência",
      text: "São exigidas qualificações, habilidades e experiência pertinentes. A exigência de diploma depende do enquadramento.",
      source: "permit",
    },
    {
      title: "Condições do empregador",
      text: "O empregador também deve atender aos critérios oficiais de registro e composição de sua equipe, sujeitos a exceções.",
      source: "permit",
    },
  ] satisfies readonly EditorialItem[],
  attributes: [
    {
      title: "Vínculo definido",
      text: "A permissão especifica empregador, ocupação e local de trabalho.",
      source: "permit",
    },
    {
      title: "Teste de mercado",
      text: "Não exige Labour Market Needs Test.",
      source: "permit",
    },
  ] satisfies readonly EditorialItem[],
  permissions: [
    {
      title: "Permissão de trabalho",
      text: "Autoriza o trabalho nos termos do permit.",
      source: "permit",
    },
    {
      title: "Visto de entrada",
      text: "Pode ser necessário conforme sua nacionalidade. Deve ser verificado antes da viagem, mesmo com uma permissão de trabalho.",
      source: "entry",
    },
    {
      title: "Permissão de residência",
      text: "É distinta do permit. Para pessoas de fora da União Europeia, Reino Unido e Suíça que permanecem por mais de 90 dias, o ISD orienta o registro da permissão de imigração.",
      source: "residence",
    },
  ] satisfies readonly EditorialItem[],
  steps: [
    {
      title: "Conferir o enquadramento",
      text: "Compare oferta, ocupação, remuneração e qualificações com os critérios oficiais.",
      source: "permit",
    },
    {
      title: "Preparar e solicitar",
      text: "Consulte a documentação exigida. Profissional ou empregador pode solicitar pelo Employment Permits Online, sujeito à análise oficial.",
      source: "permit",
    },
    {
      title: "Planejar a entrada",
      text: "Após obter a permissão de trabalho, confira com o ISD se precisa de visto de entrada e quais condições se aplicam à viagem.",
      source: "entry",
    },
    {
      title: "Registrar a permanência",
      text: "Após a chegada, siga as orientações do ISD para registrar a permissão de residência quando exigido. O registro informa as condições de permanência e as atividades permitidas.",
      source: "residence",
    },
  ] satisfies readonly EditorialItem[],
  disclaimer:
    "Este conteúdo é informativo, não constitui aconselhamento ou revisão jurídica e não avalia sua elegibilidade. Não garante aprovação, entrada no país ou resultado jurídico. Confirme as condições aplicáveis com as autoridades oficiais antes de tomar decisões.",
};
