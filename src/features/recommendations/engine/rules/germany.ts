import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  education,
  english,
  familyBase,
  funds,
  hasExperience,
  jobOffer,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { euPassport, start } from "./shared";

// Alemanha. Fontes: brasil.diplo.de (Embaixada e consulados), conforme o
// conteúdo revisado em prisma/seed-data.
export const GERMANY_RULES = "germany-v1";
const where = "na Alemanha";

function blueCard(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  education(evaluation, "degree", {
    met: "Você tem diploma superior, que precisa ser comparável a um alemão.",
    missing:
      "O Cartão Azul pede diploma universitário (ou, para TI, três anos de experiência nos últimos sete).",
    alternative: () => {
      const it =
        profile.occupationArea === "technology" &&
        hasExperience(profile, "3_5");
      if (it)
        evaluation.met(
          "Como especialista em TI com pelo menos três anos de experiência, você pode se qualificar sem diploma.",
        );
      return it === true;
    },
  });
  evaluation.confirm(
    "Se o salário atinge 50.700 € por ano (45.934,20 € para profissões em falta, início de carreira e TI sem diploma).",
    "Se a oferta tem pelo menos seis meses e é adequada à sua qualificação.",
  );
  return evaluation.result("cartao-azul-ue", GERMANY_RULES);
}

function skilledWorker(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  education(evaluation, "technical", {
    met: "Você tem formação superior ou profissional.",
    missing:
      "Este caminho pede diploma ou formação profissional reconhecidos na Alemanha.",
  });
  evaluation.confirm(
    "O reconhecimento da sua qualificação na Alemanha (anabin ou decisão de reconhecimento).",
  );
  return evaluation.result("trabalhador-qualificado", GERMANY_RULES);
}

function opportunityCard(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, ["job_search", "work"], euPassport);
  education(evaluation, "technical", {
    met: "Você tem diploma ou formação profissional.",
    missing:
      "O cartão pede diploma universitário ou formação profissional de pelo menos dois anos.",
  });
  const german = profile.germanLevel;
  if (german !== null && german !== "none")
    evaluation.met(
      "Você informou alemão em nível básico ou mais (o mínimo é A1).",
    );
  else if (german === "none") english(evaluation, "upper", "B2, ou alemão A1");
  else evaluation.unknown("O seu nível de alemão ou de inglês.");
  funds(evaluation, "recursos de pelo menos 1.091 € por mês para um ano");
  evaluation.confirm("Se você soma pelo menos 6 pontos no sistema oficial.");
  return evaluation.result("cartao-de-oportunidades", GERMANY_RULES);
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", euPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A admissão em universidade alemã ou em Studienkolleg.",
  });
  funds(
    evaluation,
    "recursos de pelo menos 992 € por mês, por conta bloqueada ou bolsa",
  );
  evaluation.confirm("Em geral, nível B2 na língua do curso.");
  return evaluation.result("estudo", GERMANY_RULES);
}

function spouse(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", euPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      rejectedText:
        profile.familyRelationship === "partner"
          ? "Pela informação oficial, união estável não dá direito a este caminho; ele exige casamento válido pela lei alemã."
          : "Este caminho é para cônjuges.",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent", "temporary"],
    });
  }
  const german = profile.germanLevel;
  if (german === null) evaluation.unknown("O seu nível de alemão.");
  else if (german === "none")
    evaluation.unknown(
      "Alemão básico (A1) costuma ser exigido; confirme se alguma exceção se aplica a você.",
    );
  else evaluation.met("Você informou alemão em nível básico ou mais (A1).");
  return evaluation.result("reuniao-com-conjuge", GERMANY_RULES);
}

export function evaluateGermany(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work")
      ? [blueCard(profile), skilledWorker(profile)]
      : []),
    ...(wants(profile, "job_search", "work") ? [opportunityCard(profile)] : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "family") ? [spouse(profile)] : []),
  ];
}
