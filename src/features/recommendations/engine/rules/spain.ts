import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  education,
  familyBase,
  funds,
  hasExperience,
  jobOffer,
  passiveIncome,
  relationship,
  remoteWork,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { euPassport, otherRegime, start } from "./shared";

// Espanha. Fontes: inclusion.gob.es e exteriores.gob.es, conforme o
// conteúdo revisado em prisma/seed-data.
export const SPAIN_RULES = "spain-v1";
const where = "na Espanha";

function work(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  evaluation.confirm(
    "Se a ocupação está no catálogo de difícil cobertura ou se o empregador comprovou falta de candidatos locais.",
    "Se o empregador está em dia com a Seguridade Social e o fisco.",
  );
  // A situação nacional de emprego não entra no questionário.
  return evaluation.result("trabalho-conta-alheia", SPAIN_RULES, "MEDIUM");
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", euPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A admissão em curso de tempo integral em instituição autorizada.",
  });
  funds(evaluation, "meios de pelo menos 100% do IPREM por mês de estadia");
  evaluation.confirm(
    "Seguro médico de seguradora autorizada na Espanha e passaporte válido por toda a estadia.",
  );
  return evaluation.result("estudos", SPAIN_RULES);
}

function remote(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "remote_work", euPassport);
  remoteWork(evaluation, {
    incomeMet: "2450_3700",
    incomeBorder: "2200_2450",
    threshold: "2.442 € por mês, 200% do salário mínimo espanhol em 2026",
    months: {
      minimum: "3_6",
      text: "pelo menos três meses de vínculo com a empresa",
    },
  });
  education(evaluation, "degree", {
    met: "Você tem graduação ou pós-graduação.",
    missing:
      "O caminho pede graduação ou pelo menos três anos de experiência na área.",
    alternative: () => {
      const enough = hasExperience(profile, "3_5");
      if (enough)
        evaluation.met("Você tem pelo menos três anos de experiência na área.");
      return enough === true;
    },
  });
  evaluation.confirm(
    "Se a empresa tem atividade real há pelo menos um ano e o seguro de saúde sem carências.",
  );
  return evaluation.result("teletrabalho-internacional", SPAIN_RULES);
}

function nonLucrative(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "own_income", euPassport);
  passiveIncome(evaluation, {
    incomeMet: "2600_plus",
    incomeBorder: "2400_2600",
    threshold: "400% do IPREM por mês para o titular",
  });
  evaluation.confirm(
    "Seguro de doença, atestado médico e antecedentes criminais.",
  );
  return evaluation.result("residencia-nao-lucrativa", SPAIN_RULES);
}

function family(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", euPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      conditional: {
        partner:
          "Se a relação é registrada ou estável há pelo menos 12 meses (sem prazo, se houver filhos em comum).",
        parent: "Se você é filho(a) menor de idade ou dependente.",
        other:
          "Se você é ascendente a cargo com mais de 65 anos; outros familiares, em geral, não podem ser reagrupados.",
      },
      rejectedText: "O seu parentesco não está entre os previstos.",
    });
    sponsorStatus(evaluation, {
      accepted: ["permanent", "temporary"],
      conditional: { citizen: otherRegime },
    });
  }
  evaluation.confirm(
    "Se o seu familiar mora há pelo menos um ano na Espanha e comprova meios e moradia adequada.",
  );
  return evaluation.result("reagrupacao-familiar", SPAIN_RULES);
}

export function evaluateSpain(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [work(profile)] : []),
    ...(wants(profile, "remote_work") ? [remote(profile)] : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "own_income") ? [nonLucrative(profile)] : []),
    ...(wants(profile, "family") ? [family(profile)] : []),
  ];
}
