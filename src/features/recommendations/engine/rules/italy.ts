import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
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

// Itália. Fonte: listas de requisitos da Embaixada da Itália em Brasília
// (ambbrasilia.esteri.it), conforme o conteúdo revisado em prisma/seed-data.
export const ITALY_RULES = "italy-v1";
const where = "na Itália";

function work(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  evaluation.confirm(
    "Se o empregador vai pedir o nulla osta ao Sportello Unico.",
    ...(profile.occupationArea === "healthcare"
      ? [
          "O reconhecimento prévio do diploma pelo Ministério da Saúde italiano.",
        ]
      : []),
  );
  return evaluation.result("trabalho-subordinado", ITALY_RULES);
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", euPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing:
      "A pré-inscrição em curso reconhecido, validada no portal Universitaly.",
  });
  funds(
    evaluation,
    "meios de subsistência (o valor mínimo muda a cada ano acadêmico)",
  );
  evaluation.confirm(
    "Seguro saúde de 30.000 € (ou o certificado do acordo Brasil-Itália) e alojamento.",
  );
  return evaluation.result("estudo", ITALY_RULES);
}

function digitalNomad(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "remote_work", euPassport);
  remoteWork(evaluation, {
    incomeMet: "2200_2450",
    incomeBorder: "under_2200",
    threshold: "26.000 € por ano, cerca de 2.167 € por mês",
    months: {
      minimum: "6_plus",
      text: "pelo menos 6 meses de trabalho remoto",
    },
  });
  const level = profile.educationLevel;
  const fiveYears = hasExperience(profile, "5_plus");
  const itThree =
    profile.occupationArea === "technology" && hasExperience(profile, "3_5");
  if (level === "degree" || level === "postgraduate")
    evaluation.met(
      "Você tem diploma superior, que precisa da declaração do CIMEA para comprovar alta qualificação.",
    );
  else if (fiveYears || itThree)
    evaluation.met(
      "A sua experiência pode comprovar alta qualificação (5 anos, ou 3 anos em TI nos últimos 7).",
    );
  else if (level === null || profile.experienceYears === null)
    evaluation.unknown("A sua formação e experiência.");
  else
    evaluation.block(
      "O caminho pede alta qualificação: diploma superior, 5 anos de experiência ou 3 anos em TI ou direção.",
    );
  evaluation.confirm(
    "Contrato de aluguel com 2 meses pagos antecipadamente (ou imóvel próprio) e seguro saúde de 30.000 €.",
  );
  return evaluation.result("nomade-digital", ITALY_RULES);
}

function elective(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "own_income", euPassport);
  passiveIncome(evaluation, {
    incomeMet: "2600_plus",
    incomeBorder: "2400_2600",
    threshold: "31.000 € por ano, cerca de 2.583 € por mês",
  });
  evaluation.confirm(
    "Moradia com contrato e 6 meses pagos antecipadamente, ou imóvel próprio.",
  );
  return evaluation.result("residencia-eletiva", ITALY_RULES);
}

function family(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", euPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      conditional: {
        parent: "Se você é filho(a) menor de idade.",
        partner:
          "Se a sua união é reconhecida para o reagrupamento; a lista oficial cita cônjuge e filhos.",
        other:
          "Se o seu parentesco está entre os previstos; a lista oficial cita cônjuge e filhos.",
      },
      rejectedText: "O seu parentesco não está entre os previstos.",
    });
    sponsorStatus(evaluation, {
      accepted: ["permanent", "temporary"],
      conditional: { citizen: otherRegime },
    });
  }
  evaluation.confirm(
    "O nulla osta pedido pelo seu familiar no Sportello Unico.",
  );
  return evaluation.result("reagrupamento-familiar", ITALY_RULES);
}

export function evaluateItaly(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [work(profile)] : []),
    ...(wants(profile, "remote_work") ? [digitalNomad(profile)] : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "own_income") ? [elective(profile)] : []),
    ...(wants(profile, "family") ? [family(profile)] : []),
  ];
}
