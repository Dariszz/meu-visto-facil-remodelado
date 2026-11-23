import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  familyBase,
  funds,
  jobOffer,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { euPassport, start } from "./shared";

// Holanda. Fonte: IND (ind.nl), conforme o conteúdo revisado em prisma/seed-data.
export const NETHERLANDS_RULES = "netherlands-v1";
const where = "na Holanda";

function highlySkilled(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", euPassport);
  jobOffer(evaluation, where);
  const salary =
    profile.ageRange === null
      ? "o salário mínimo da sua faixa de idade (5.942 € por mês a partir de 30 anos, 4.357 € abaixo de 30, em 2026)"
      : profile.ageRange === "30_39" ||
          profile.ageRange === "40_44" ||
          profile.ageRange === "45_plus"
        ? "5.942 € brutos por mês, o mínimo para 30 anos ou mais em 2026"
        : "4.357 € brutos por mês, o mínimo para menos de 30 anos em 2026";
  evaluation.confirm(
    "Se o empregador é reconhecido pelo IND como patrocinador.",
    `Se o salário atinge ${salary}.`,
    ...(profile.occupationArea === "healthcare"
      ? ["A inscrição no registro BIG, exigida para profissões de saúde."]
      : []),
  );
  return evaluation.result("migrante-altamente-qualificado", NETHERLANDS_RULES);
}

function student(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", euPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A matrícula em curso acreditado de tempo integral.",
  });
  funds(evaluation, "recursos de 1.130,77 € por mês (valor de 2026)");
  return evaluation.result("estudante-ensino-superior", NETHERLANDS_RULES);
}

function partner(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", euPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse", "partner"],
      rejectedText: "Este caminho é para cônjuge ou parceiro(a).",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent"],
      conditional: {
        temporary:
          "Se a residência do seu parceiro permite trazer a família; alguns tipos, como au pair ou trabalho sazonal, não permitem.",
      },
    });
  }
  if (profile.ageRange === "under_21")
    evaluation.block(
      "Em geral, os dois precisam ter 21 anos ou mais (ou 18, se já eram casados morando fora da Holanda).",
    );
  else if (profile.ageRange === null) evaluation.unknown("A sua idade.");
  evaluation.confirm(
    "A renda do seu parceiro (2.337 € brutos por mês no segundo semestre de 2026) e o exame de integração cívica no exterior.",
  );
  return evaluation.result("parceiro", NETHERLANDS_RULES);
}

export function evaluateNetherlands(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [highlySkilled(profile)] : []),
    ...(wants(profile, "study") ? [student(profile)] : []),
    ...(wants(profile, "family") ? [partner(profile)] : []),
  ];
}
