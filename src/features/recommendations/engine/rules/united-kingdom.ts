import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  english,
  familyBase,
  funds,
  jobOffer,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { start } from "./shared";

// Reino Unido. Fonte: gov.uk, conforme o conteúdo revisado em prisma/seed-data.
export const UNITED_KINGDOM_RULES = "united-kingdom-v1";
const where = "no Reino Unido";

const ukPassport = {
  exempt: ["uk", "ie"],
  exemptText:
    "Cidadãos britânicos e irlandeses não precisam de visto para morar no Reino Unido. Confirme na fonte oficial.",
} as const;

function skilledWorker(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", ukPassport);
  jobOffer(evaluation, where);
  english(evaluation, "upper", "B2");
  evaluation.confirm(
    "Se o empregador tem licença de patrocinador do Home Office e vai emitir o certificado de patrocínio (CoS).",
    "Se a ocupação está na lista de elegíveis e o salário atinge o mínimo (em geral £41.700 por ano).",
  );
  return evaluation.result("skilled-worker", UNITED_KINGDOM_RULES);
}

function globalTalent(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", ukPassport);
  evaluation.confirm(
    "Se você atua como líder ou potencial líder em pesquisa, artes e cultura ou tecnologia digital.",
    "O endosso de um órgão autorizado pelo Home Office ou um prêmio de prestígio da lista oficial.",
  );
  // O endosso é o centro do caminho e não cabe no questionário.
  return evaluation.result("global-talent", UNITED_KINGDOM_RULES, "MEDIUM");
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", ukPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A oferta incondicional de instituição licenciada e o número CAS.",
  });
  funds(evaluation, "a taxa do primeiro ano e o custo de vida (até 9 meses)");
  english(evaluation, "intermediate", "B1 ou B2, conforme o curso");
  return evaluation.result("student", UNITED_KINGDOM_RULES);
}

function familyPartner(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", ukPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      conditional: {
        partner: "Se vocês têm pelo menos 2 anos de relacionamento comprovado.",
      },
      rejectedText: "Este caminho é para cônjuge ou parceiro(a).",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent"],
      rejectedText:
        "O parceiro precisa ser britânico, irlandês ou ter residência permanente (settled), salvo situações previstas, como proteção.",
    });
  }
  evaluation.confirm(
    "A renda combinada de pelo menos £29.000 por ano e a comprovação de inglês.",
  );
  return evaluation.result("family-partner", UNITED_KINGDOM_RULES);
}

export function evaluateUnitedKingdom(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work")
      ? [skilledWorker(profile), globalTalent(profile)]
      : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "family") ? [familyPartner(profile)] : []),
  ];
}
