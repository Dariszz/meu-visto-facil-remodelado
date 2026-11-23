import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  english,
  familyBase,
  funds,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { start } from "./shared";

// Austrália. Fonte: immi.homeaffairs.gov.au, conforme o conteúdo revisado em
// prisma/seed-data.
export const AUSTRALIA_RULES = "australia-v1";
const where = "na Austrália";

const localPassport = {
  exempt: ["local"],
  exemptText:
    "Quem já é cidadão australiano ou residente permanente não precisa deste caminho.",
} as const;

function skilled189(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", localPassport);
  if (profile.ageRange === null) evaluation.unknown("A sua idade.");
  else if (profile.ageRange === "45_plus")
    evaluation.block("O 189 pede menos de 45 anos na data do convite.");
  else evaluation.met("Você tem menos de 45 anos, como o 189 pede no convite.");
  english(evaluation, "upper", "competent English, próximo de B2");
  evaluation.confirm(
    "Se a sua ocupação está na lista do 189 e a avaliação de habilidades.",
    "Se você soma pelo menos 65 pontos (o convite pode exigir mais).",
  );
  // Depende de convite, que considera a pontuação dos candidatos.
  return evaluation.result(
    "skilled-independent-189",
    AUSTRALIA_RULES,
    "MEDIUM",
  );
}

function student500(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", localPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A confirmação de matrícula (CoE) em curso na Austrália.",
  });
  funds(evaluation, "recursos para o curso e para se manter");
  evaluation.confirm(
    "O seguro OSHC e, se o curso exigir, o resultado de teste de inglês.",
  );
  return evaluation.result("student-500", AUSTRALIA_RULES);
}

function partner(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", localPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse", "partner"],
      rejectedText: "Este caminho é para cônjuge ou companheiro(a).",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent"],
      rejectedText:
        "O parceiro precisa ser cidadão australiano, residente permanente ou neozelandês elegível.",
    });
  }
  evaluation.confirm("O pedido do 309 deve ser feito de fora da Austrália.");
  return evaluation.result("partner-309-100", AUSTRALIA_RULES);
}

export function evaluateAustralia(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [skilled189(profile)] : []),
    ...(wants(profile, "study") ? [student500(profile)] : []),
    ...(wants(profile, "family") ? [partner(profile)] : []),
  ];
}
