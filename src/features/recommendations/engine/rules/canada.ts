import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import {
  admission,
  familyBase,
  funds,
  hasExperience,
  relationship,
  sponsorStatus,
  wants,
  type RecommendationResult,
} from "../kit";
import { start } from "./shared";

// Canadá. Fonte: canada.ca (IRCC), conforme o conteúdo revisado em prisma/seed-data.
export const CANADA_RULES = "canada-v1";
const where = "no Canadá";

const localPassport = {
  exempt: ["local"],
  exemptText:
    "Quem já é cidadão ou residente permanente do Canadá não precisa deste caminho.",
} as const;

function expressEntry(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "work", localPassport);
  const experience = hasExperience(profile, "1_3");
  if (experience === null) evaluation.unknown("Os seus anos de experiência.");
  else if (experience)
    evaluation.met(
      "Você tem pelo menos 1 ano de experiência, que precisa ser em ocupação qualificada (TEER 0 a 3).",
    );
  else
    evaluation.block(
      "O caminho pede pelo menos 1 ano de experiência qualificada nos últimos 10 anos.",
    );
  if (profile.educationLevel === null) evaluation.unknown("A sua formação.");
  else
    evaluation.met(
      "Você tem formação concluída, que precisa da avaliação de credenciais (ECA).",
    );
  if (profile.englishLevel === null)
    evaluation.unknown("O seu nível de inglês.");
  else if (
    profile.englishLevel === "upper" ||
    profile.englishLevel === "advanced"
  )
    evaluation.met(
      "Pela sua estimativa, o seu inglês está perto do CLB 7 pedido, que precisa ser comprovado por teste oficial.",
    );
  else
    evaluation.block(
      "O caminho pede inglês ou francês CLB 7 (próximo de B2); pela sua estimativa de inglês, ainda falta chegar lá.",
    );
  if (profile.ageRange === "45_plus")
    evaluation.confirm(
      "A idade reduz a pontuação; confira se você soma os 67 pontos.",
    );
  evaluation.confirm(
    "Se você soma pelo menos 67 pontos nos fatores de seleção.",
    "Os recursos mínimos (15.263 CAD para uma pessoa), salvo quem tem oferta válida.",
  );
  // A entrada depende de convite em sorteios por pontuação.
  return evaluation.result(
    "express-entry-federal-skilled-worker",
    CANADA_RULES,
    "MEDIUM",
  );
}

function studyPermit(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "study", localPassport);
  admission(evaluation, {
    met: "Você informou que já foi aceito(a) por uma instituição.",
    missing: "A carta de aceitação de uma instituição designada (DLI).",
  });
  funds(evaluation, "taxas do curso e 23.448 CAD por ano de custo de vida");
  evaluation.confirm(
    "A carta de atestação provincial (PAL), exigida na maioria dos casos.",
  );
  return evaluation.result("study-permit", CANADA_RULES);
}

function spouseSponsorship(profile: ImmigrationProfile) {
  const evaluation = start(profile, where, "family", localPassport);
  if (familyBase(evaluation, where)) {
    relationship(evaluation, {
      accepted: ["spouse", "partner"],
      rejectedText: "Este caminho é para cônjuge ou parceiro(a).",
    });
    sponsorStatus(evaluation, {
      accepted: ["citizen", "permanent"],
      rejectedText:
        "O patrocinador precisa ser cidadão canadense ou residente permanente.",
    });
  }
  evaluation.confirm("Se o seu parceiro não tem impedimentos para patrocinar.");
  return evaluation.result("spouse-sponsorship", CANADA_RULES);
}

export function evaluateCanada(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  return [
    ...(wants(profile, "work") ? [expressEntry(profile)] : []),
    ...(wants(profile, "study") ? [studyPermit(profile)] : []),
    ...(wants(profile, "family") ? [spouseSponsorship(profile)] : []),
  ];
}
