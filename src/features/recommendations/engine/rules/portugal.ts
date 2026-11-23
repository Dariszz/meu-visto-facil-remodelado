import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  education,
  familyBase,
  jobOffer,
  passiveIncome,
  relationship,
  remoteWork,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { euPassport, otherRegime, start } from "./shared";

// Portugal. Fontes: AIMA, vistos.mne.gov.pt e Lei de Estrangeiros (Diário
// da República), conforme o conteúdo revisado em prisma/seed-data.
export const PORTUGAL_RULES = "portugal-v1";
const where = "em Portugal";

function work(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  evaluation.confirm(
    "Se a sua profissão é regulamentada e exige habilitação em Portugal.",
    "A certidão de antecedentes criminais com Apostila de Haia.",
  );
  return evaluation.result("trabalho-subordinado", PORTUGAL_RULES);
}

function highlyQualified(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  if (profile.educationLevel === "technical")
    evaluation.unknown(
      "Se a sua formação técnica é aceita como qualificação elevada para o cargo.",
    );
  else
    education(evaluation, "degree", {
      met: "Você tem formação superior, base para comprovar qualificação elevada.",
      missing:
        "Este caminho pede qualificação profissional elevada, difícil de comprovar só com o ensino médio.",
    });
  evaluation.confirm(
    "Se o contrato tem pelo menos seis meses.",
    "Se o salário anual atinge o piso oficial (1,5 vez o salário médio nacional ou três vezes o IAS, com piso menor para profissões em falta).",
  );
  return evaluation.result("altamente-qualificado", PORTUGAL_RULES);
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", euPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A aceitação em instituição de ensino superior em Portugal.",
  });
  evaluation.confirm(
    "A prova de meios de subsistência. Brasileiros e demais cidadãos da CPLP admitidos no ensino superior são dispensados dela.",
    "Seguro de viagem ou certificado PB4 e certidão de antecedentes criminais.",
  );
  return evaluation.result("estudante-ensino-superior", PORTUGAL_RULES);
}

function digitalNomad(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "remote_work", euPassport);
  remoteWork(evaluation, {
    incomeMet: "3700_plus",
    incomeBorder: "2450_3700",
    threshold: "3.680 € por mês, quatro salários mínimos portugueses em 2026",
  });
  evaluation.confirm(
    "A média de renda dos últimos três meses e o comprovante de residência fiscal.",
  );
  return evaluation.result("nomada-digital", PORTUGAL_RULES);
}

function ownIncome(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "own_income", euPassport);
  passiveIncome(evaluation, {
    incomeMet: "1000_2400",
    incomeBorder: "under_1000",
    threshold:
      "920 € por mês para o titular em 2026, com acréscimos por familiar",
  });
  evaluation.confirm("Se a renda poderá ser recebida em Portugal.");
  return evaluation.result("rendimentos-proprios", PORTUGAL_RULES);
}

function family(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", euPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      conditional: {
        partner:
          "Se a união de facto tem mais de dois anos e pode ser comprovada.",
        parent:
          "Se você se enquadra como filho(a) pelas regras de idade e dependência.",
        other:
          "Se o seu parentesco está entre os previstos na Lei de Estrangeiros.",
      },
      rejectedText: "O seu parentesco não está entre os previstos.",
    });
    sponsorStatus(evaluation, {
      accepted: ["permanent", "temporary"],
      conditional: { citizen: otherRegime },
    });
  }
  evaluation.confirm(
    "Se o seu familiar tem, em regra, dois anos de autorização de residência, além de moradia e renda.",
  );
  return evaluation.result("reagrupamento-familiar", PORTUGAL_RULES);
}

export function evaluatePortugal(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work")
      ? [work(profile), highlyQualified(profile)]
      : []),
    ...(wants(profile, "remote_work") ? [digitalNomad(profile)] : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "own_income") ? [ownIncome(profile)] : []),
    ...(wants(profile, "family") ? [family(profile)] : []),
  ];
}
