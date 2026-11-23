import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  education,
  familyBase,
  funds,
  jobOffer,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { start } from "./shared";

// Estados Unidos. Fontes: uscis.gov e travel.state.gov, conforme o conteúdo
// revisado em prisma/seed-data.
export const UNITED_STATES_RULES = "united-states-v1";
const where = "nos Estados Unidos";

const localPassport = {
  exempt: ["local"],
  exemptText:
    "Quem já é cidadão ou residente permanente dos Estados Unidos não precisa deste caminho.",
} as const;

function h1b(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", localPassport);
  jobOffer(evaluation, where);
  education(evaluation, "degree", {
    met: "Você tem diploma de bacharel ou superior, que precisa ser na área do cargo.",
    missing:
      "O H-1B pede diploma de bacharel em área relacionada (ou formação e experiência equivalentes).",
  });
  evaluation.confirm(
    "Se o cargo exige conhecimento especializado e diploma na área.",
    "A seleção no sorteio anual (cap), quando a vaga está sujeita ao limite.",
  );
  // O sorteio do cap não depende do perfil.
  return evaluation.result("h-1b", UNITED_STATES_RULES, "MEDIUM");
}

function f1(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", localPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A matrícula em tempo integral em escola autorizada pelo SEVP.",
  });
  funds(evaluation, "recursos para todo o período do curso");
  evaluation.confirm(
    "Proficiência em inglês (ou matrícula em curso que leve a ela) e residência mantida no país de origem.",
  );
  return evaluation.result("f-1", UNITED_STATES_RULES);
}

function spouseGreenCard(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", localPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse"],
      rejectedText:
        profile.familyRelationship === "partner"
          ? "Este caminho exige casamento civil."
          : "Este caminho é para cônjuges.",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent"],
      rejectedText:
        "O cônjuge precisa ser cidadão americano ou residente permanente (green card).",
    });
  }
  return evaluation.result("spouse-green-card", UNITED_STATES_RULES);
}

export function evaluateUnitedStates(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [h1b(profile)] : []),
    ...(wants(profile, "study") ? [f1(profile)] : []),
    ...(wants(profile, "family") ? [spouseGreenCard(profile)] : []),
  ];
}
