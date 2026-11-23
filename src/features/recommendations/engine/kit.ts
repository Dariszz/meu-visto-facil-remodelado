import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import type { Compatibility } from "../types";

// Peças comuns às regras de todos os destinos (Recommendation Engine V2).
// Regra de ouro: nunca afirmar elegibilidade. O que o questionário não cobre
// vira "a confirmar"; resposta desconhecida nunca conta como negativa.
export type RecommendationResult = {
  visaSlug: string;
  compatibility: Compatibility;
  matchedCriteria: string[];
  missingCriteria: string[];
  blockers: string[];
  ruleVersion: string;
};

const order: Compatibility[] = ["HIGH", "MEDIUM", "LOW", "NOT_RECOMMENDED"];

export class Evaluation {
  readonly matched: string[] = [];
  readonly missing: string[] = [];
  readonly blockers: string[] = [];
  private unknownCore = 0;
  private exempt = false;

  constructor(readonly profile: ImmigrationProfile) {}

  met(text: string) {
    this.matched.push(text);
    return this;
  }
  // Fato central sem resposta: limita a compatibilidade a média.
  unknown(text: string) {
    this.missing.push(text);
    this.unknownCore += 1;
    return this;
  }
  // Ponto que o questionário não cobre (empregador, valores exatos…).
  confirm(...texts: string[]) {
    this.missing.push(...texts);
    return this;
  }
  block(text: string) {
    this.blockers.push(text);
    return this;
  }
  notNeeded(text: string) {
    this.exempt = true;
    this.blockers.push(text);
    return this;
  }

  result(
    visaSlug: string,
    ruleVersion: string,
    cap: Compatibility = "HIGH",
  ): RecommendationResult {
    let level: Compatibility = this.exempt
      ? "NOT_RECOMMENDED"
      : this.blockers.length
        ? "LOW"
        : this.unknownCore
          ? "MEDIUM"
          : "HIGH";
    level = order[Math.max(order.indexOf(level), order.indexOf(cap))];
    return {
      visaSlug,
      compatibility: level,
      matchedCriteria: [...this.matched],
      missingCriteria: [...this.missing],
      blockers: [...this.blockers],
      ruleVersion,
    };
  }
}

export type Objective = NonNullable<ImmigrationProfile["objective"]>;

// O objetivo escolhido decide quais caminhos são avaliados.
export function wants(profile: ImmigrationProfile, ...objectives: Objective[]) {
  return (
    profile.objective === "exploring" ||
    (profile.objective !== null && objectives.includes(profile.objective))
  );
}

export function objective(
  evaluation: Evaluation,
  expected: Objective | readonly Objective[],
  phrase: string,
  missing = "Se este é mesmo o seu objetivo principal.",
) {
  const accepted = typeof expected === "string" ? [expected] : expected;
  const value = evaluation.profile.objective;
  if (value !== null && accepted.includes(value)) evaluation.met(phrase);
  else evaluation.unknown(missing);
}

// Nacionalidade: quem tem passaporte isento é marcado como "não indicado";
// casos sem regra revisada ficam "a confirmar".
export function passport(
  evaluation: Evaluation,
  rule: {
    exempt?: ReadonlyArray<"eea" | "uk" | "ie" | "local">;
    exemptText?: string;
    unreviewed?: ReadonlyArray<"eea" | "uk" | "ie">;
  },
) {
  const region = evaluation.profile.passportRegion;
  if (region === null) evaluation.unknown("A nacionalidade do seu passaporte.");
  else if (region !== "other" && rule.exempt?.includes(region))
    evaluation.notNeeded(
      rule.exemptText ??
        "Pela informação oficial, com a sua nacionalidade você não precisa deste visto. Confirme na fonte oficial.",
    );
  else if (
    region !== "other" &&
    region !== "local" &&
    rule.unreviewed?.includes(region)
  )
    evaluation.unknown(
      "As regras específicas para a sua nacionalidade, que ainda não revisamos.",
    );
}

export function jobOffer(evaluation: Evaluation, inName: string) {
  const offer = evaluation.profile.hasEmploymentOffer;
  if (offer === true) evaluation.met("Você informou uma oferta de emprego.");
  else if (offer === false)
    evaluation.block(
      `Este caminho depende de uma oferta de emprego de empresa ${inName}, e você informou que ainda não tem uma.`,
    );
  else evaluation.unknown(`Se você já tem uma oferta de emprego ${inName}.`);
}

const educationRank = {
  secondary: 0,
  technical: 1,
  degree: 2,
  postgraduate: 3,
} as const;

// Formação mínima exigida. `alternative` permite aceitar outro caminho
// (ex.: anos de experiência) em vez de bloquear.
export function education(
  evaluation: Evaluation,
  minimum: keyof typeof educationRank,
  texts: { met: string; missing: string; alternative?: () => boolean },
) {
  const level = evaluation.profile.educationLevel;
  if (level === null) evaluation.unknown("A sua formação.");
  else if (educationRank[level] >= educationRank[minimum])
    evaluation.met(texts.met);
  else if (texts.alternative?.()) return;
  else evaluation.block(texts.missing);
}

const experienceRank = {
  none: 0,
  under_1: 1,
  "1_3": 2,
  "3_5": 3,
  "5_plus": 4,
} as const;

export function hasExperience(
  profile: ImmigrationProfile,
  minimum: keyof typeof experienceRank,
): boolean | null {
  if (profile.experienceYears === null) return null;
  return experienceRank[profile.experienceYears] >= experienceRank[minimum];
}

const englishRank = {
  basic: 0,
  intermediate: 1,
  upper: 2,
  advanced: 3,
} as const;

// Inglês autoavaliado: só confirma ou aponta distância; a comprovação é
// sempre por teste ou documento oficial.
export function english(
  evaluation: Evaluation,
  minimum: keyof typeof englishRank,
  label: string,
) {
  const level = evaluation.profile.englishLevel;
  if (level === null) evaluation.unknown("O seu nível de inglês.");
  else if (englishRank[level] >= englishRank[minimum])
    evaluation.met(
      `Pela sua estimativa, o seu inglês está no nível pedido (${label}). Ele precisa ser comprovado como a regra oficial exige.`,
    );
  else
    evaluation.block(
      `O caminho pede inglês em nível ${label}, acima da sua estimativa atual.`,
    );
}

export function funds(evaluation: Evaluation, what: string) {
  const value = evaluation.profile.hasFunds;
  if (value === true)
    evaluation.met(`Você informou que consegue comprovar ${what}.`);
  else if (value === false)
    evaluation.block(
      `É preciso comprovar ${what}, e você informou que ainda não consegue.`,
    );
  else evaluation.unknown(`Se você consegue comprovar ${what}.`);
}

export function admission(
  evaluation: Evaluation,
  texts: { met: string; missing: string },
) {
  const value = evaluation.profile.hasAdmission;
  if (value === true) evaluation.met(texts.met);
  // Ainda não ter o aceite é etapa do caminho, não impedimento.
  else evaluation.unknown(texts.missing);
}

// Família: quem mora no destino, o parentesco e a situação dessa pessoa.
export function familyBase(evaluation: Evaluation, inName: string) {
  const value = evaluation.profile.familyInCountry;
  if (value === true)
    evaluation.met(`Você tem um familiar morando legalmente ${inName}.`);
  else if (value === false)
    evaluation.block(
      `Este caminho depende de um familiar que já mora legalmente ${inName}, e você informou que não tem.`,
    );
  else
    evaluation.unknown(
      `Se você tem cônjuge, parceiro(a) ou familiar morando legalmente ${inName}.`,
    );
  return value === true;
}

type Relationship = NonNullable<ImmigrationProfile["familyRelationship"]>;

export function relationship(
  evaluation: Evaluation,
  rule: {
    accepted: readonly Relationship[];
    // Aceito com condições (idade, dependência…), que ficam "a confirmar".
    conditional?: Partial<Record<Relationship, string>>;
    rejectedText: string;
  },
) {
  const value = evaluation.profile.familyRelationship;
  if (value === null) evaluation.unknown("A sua relação com o familiar.");
  else if (rule.accepted.includes(value))
    evaluation.met("O seu parentesco está entre os previstos neste caminho.");
  else if (rule.conditional?.[value])
    evaluation.unknown(rule.conditional[value]!);
  else evaluation.block(rule.rejectedText);
}

type SponsorStatus = NonNullable<ImmigrationProfile["familySponsorStatus"]>;

export function sponsorStatus(
  evaluation: Evaluation,
  rule: {
    accepted: readonly SponsorStatus[];
    conditional?: Partial<Record<SponsorStatus, string>>;
    rejectedText?: string;
  },
) {
  const value = evaluation.profile.familySponsorStatus;
  if (value === null)
    evaluation.unknown("A situação de residência do seu familiar.");
  else if (rule.accepted.includes(value))
    evaluation.met("A situação do seu familiar permite este caminho.");
  else if (rule.conditional?.[value])
    evaluation.unknown(rule.conditional[value]!);
  else
    evaluation.block(
      rule.rejectedText ??
        "Pela informação oficial, a situação do seu familiar não permite este caminho.",
    );
}

const remoteIncomeRank = {
  none: 0,
  under_2200: 1,
  "2200_2450": 2,
  "2450_3700": 3,
  "3700_plus": 4,
} as const;

export function remoteWork(
  evaluation: Evaluation,
  rule: {
    // Faixa mínima que com certeza atinge o valor oficial.
    incomeMet: keyof typeof remoteIncomeRank;
    // Faixa que pode ou não atingir (fica "a confirmar").
    incomeBorder?: keyof typeof remoteIncomeRank;
    threshold: string;
    months?: { minimum: "3_6" | "6_plus"; text: string };
  },
) {
  const { worksRemotely, remoteIncome, remoteMonths } = evaluation.profile;
  if (worksRemotely === false) {
    evaluation.block(
      "Este caminho é para quem já trabalha remotamente para fora do país, e você informou que não trabalha assim.",
    );
    return;
  }
  if (worksRemotely === null) {
    evaluation.unknown("Se você trabalha remotamente para fora do país.");
    return;
  }
  evaluation.met("Você trabalha remotamente para empresa ou clientes de fora.");
  if (remoteIncome === null) evaluation.unknown("A sua renda mensal.");
  else if (remoteIncomeRank[remoteIncome] >= remoteIncomeRank[rule.incomeMet])
    evaluation.met(
      `A sua renda informada atinge o mínimo (${rule.threshold}).`,
    );
  else if (rule.incomeBorder && remoteIncome === rule.incomeBorder)
    evaluation.unknown(
      `Se a sua renda atinge o mínimo exato (${rule.threshold}), que fica dentro da faixa informada.`,
    );
  else
    evaluation.block(
      `O caminho pede renda de pelo menos ${rule.threshold}, acima da faixa que você informou.`,
    );
  if (rule.months) {
    const ok =
      remoteMonths === null
        ? null
        : rule.months.minimum === "3_6"
          ? remoteMonths !== "under_3"
          : remoteMonths === "6_plus";
    if (ok === null)
      evaluation.unknown("Há quanto tempo você trabalha remotamente.");
    else if (ok)
      evaluation.met(`Você atende ao tempo mínimo: ${rule.months.text}.`);
    else evaluation.block(`O caminho pede ${rule.months.text}.`);
  }
}

const passiveIncomeRank = {
  none: 0,
  under_1000: 1,
  "1000_2400": 2,
  "2400_2600": 3,
  "2600_plus": 4,
} as const;

export function passiveIncome(
  evaluation: Evaluation,
  rule: {
    incomeMet: keyof typeof passiveIncomeRank;
    incomeBorder?: keyof typeof passiveIncomeRank;
    threshold: string;
  },
) {
  const value = evaluation.profile.passiveIncome;
  if (value === null)
    evaluation.unknown(
      "A sua renda de aposentadoria, aluguéis ou investimentos.",
    );
  else if (value === "none")
    evaluation.block(
      "Este caminho depende de renda própria (aposentadoria, aluguéis ou investimentos), e você informou que não tem.",
    );
  else if (passiveIncomeRank[value] >= passiveIncomeRank[rule.incomeMet])
    evaluation.met(
      `A sua renda informada atinge a referência (${rule.threshold}).`,
    );
  else if (rule.incomeBorder && value === rule.incomeBorder)
    evaluation.unknown(
      `Se a sua renda atinge a referência exata (${rule.threshold}), que fica dentro da faixa informada.`,
    );
  else
    evaluation.block(
      `A referência oficial é de ${rule.threshold}, acima da faixa que você informou.`,
    );
}
