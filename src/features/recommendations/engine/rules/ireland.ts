import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  Evaluation,
  familyBase,
  funds,
  passport,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";

// Irlanda. Fontes: gov.ie, enterprise.gov.ie e irishimmigration.ie, conforme
// o conteúdo revisado em prisma/seed-data (Critical Skills, General
// Employment, Stamp 2 e reunião familiar).
export const IRELAND_RULES = "ireland-v2";

const eeaText =
  "Pela informação oficial, quem tem nacionalidade do Espaço Econômico Europeu não precisa de employment permit para trabalhar na Irlanda. Confirme na fonte oficial.";

function workBasics(profile: ImmigrationProfile) {
  const evaluation = new Evaluation(profile);
  if (profile.objective === "work")
    evaluation.met("Você pretende trabalhar na Irlanda.");
  else
    evaluation.unknown("Se o seu objetivo principal é trabalhar na Irlanda.");
  if (profile.passportRegion === "uk")
    evaluation.unknown(
      "As regras específicas para quem tem passaporte do Reino Unido, que ainda não revisamos.",
    );
  else passport(evaluation, { exempt: ["eea"], exemptText: eeaText });
  if (profile.hasEmploymentOffer === true)
    evaluation.met("Você informou uma oferta de emprego.");
  else if (profile.hasEmploymentOffer === false)
    evaluation.block(
      "Este caminho depende de uma oferta de emprego de empregador na Irlanda, e você informou que ainda não tem uma.",
    );
  else evaluation.unknown("Se você já tem uma oferta de emprego na Irlanda.");
  return evaluation;
}

function criticalSkills(profile: ImmigrationProfile): RecommendationResult {
  const evaluation = workBasics(profile);
  if (profile.hasEmploymentOffer === true) {
    if (profile.offerDuration === "2y_plus")
      evaluation.met("A oferta prevista é de dois anos ou mais.");
    else if (profile.offerDuration === "under_2y")
      evaluation.block(
        "O Critical Skills pede oferta de pelo menos dois anos, e a sua é mais curta.",
      );
    else evaluation.unknown("Se a oferta tem duração de pelo menos dois anos.");
  }
  evaluation.confirm(
    "Se a ocupação e a remuneração estão dentro dos critérios vigentes.",
    "Se suas qualificações e experiência atendem ao enquadramento.",
    "Se o empregador atende às condições oficiais.",
  );
  return evaluation.result("critical-skills-employment-permit", IRELAND_RULES);
}

function generalEmployment(profile: ImmigrationProfile): RecommendationResult {
  const evaluation = workBasics(profile);
  evaluation.confirm(
    "Se a ocupação não está na lista oficial de ocupações inelegíveis.",
    "Se o empregador atende às condições oficiais.",
    "Se a vaga passou pelo teste de mercado de trabalho, quando exigido.",
  );
  // O teste de mercado e a lista de inelegíveis não entram no questionário:
  // nunca passa de compatibilidade média.
  return evaluation.result(
    "general-employment-permit",
    IRELAND_RULES,
    "MEDIUM",
  );
}

function studentStamp2(profile: ImmigrationProfile): RecommendationResult {
  const evaluation = new Evaluation(profile);
  if (profile.objective === "study")
    evaluation.met("Você pretende estudar na Irlanda.");
  else evaluation.unknown("Se o seu objetivo principal é estudar na Irlanda.");
  passport(evaluation, {
    exempt: ["eea"],
    exemptText:
      "Pela informação oficial, a permissão de estudante é para quem é de fora do Espaço Econômico Europeu. Confirme na fonte oficial.",
    unreviewed: ["uk"],
  });
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing:
      "A carta de aceitação em curso de tempo integral da lista oficial (ILEP).",
  });
  funds(
    evaluation,
    "recursos de pelo menos €10.000 para um ano de curso, além das taxas",
  );
  evaluation.confirm(
    "Se o curso está na lista ILEP e é presencial, diurno e de tempo integral.",
    "O pagamento das taxas do curso e o seguro de saúde privado.",
  );
  return evaluation.result("student-stamp-2", IRELAND_RULES);
}

function joinFamily(profile: ImmigrationProfile): RecommendationResult {
  const evaluation = new Evaluation(profile);
  if (profile.objective === "family")
    evaluation.met("Você pretende morar com familiares na Irlanda.");
  else
    evaluation.unknown(
      "Se o seu objetivo principal é morar com familiares na Irlanda.",
    );
  passport(evaluation, {
    exempt: ["eea"],
    exemptText:
      "Pela informação oficial, este caminho é para quem é de fora do Espaço Econômico Europeu. Confirme na fonte oficial.",
    unreviewed: ["uk"],
  });
  if (familyBase(evaluation, "na Irlanda")) {
    relationship(evaluation, {
      accepted: ["spouse", "partner"],
      conditional: {
        parent: "Se você é filho(a) menor de 18 anos e solteiro(a).",
      },
      rejectedText:
        "Este caminho é para cônjuges, parceiros e filhos menores de 18 anos.",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen"],
      conditional: {
        permanent:
          "Se a permissão do seu familiar permite trazer a família, e a partir de quando.",
        temporary:
          "Se a permissão do seu familiar permite trazer a família (titulares de Critical Skills podem pedir de imediato; de General Employment, em geral após 12 meses).",
      },
    });
  }
  evaluation.confirm("Se a renda do seu familiar atinge o mínimo oficial.");
  return evaluation.result("join-family", IRELAND_RULES);
}

export function evaluateIreland(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work")
      ? [criticalSkills(profile), generalEmployment(profile)]
      : []),
    ...(wants(profile, "study") ? [studentStamp2(profile)] : []),
    ...(wants(profile, "family") ? [joinFamily(profile)] : []),
  ];
}
