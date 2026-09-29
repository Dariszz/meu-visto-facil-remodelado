export type CriticalSkillsSourceId = "permit" | "entry" | "residence";
type EditorialItem = {
  title: string;
  text: string;
  source: CriticalSkillsSourceId;
};

export const criticalSkills = {
  audience:
    "Pode ser relevante para quem tem uma oferta de emprego na Irlanda em ocupação compatível com os critérios de Critical Skills.",
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
