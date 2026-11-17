import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import type { Compatibility } from "../types";

// Recommendation Engine V1 (Fases 16 a 18): regras determinísticas, sem IA.
// Usa só o que o questionário coleta. Nunca afirma elegibilidade: critérios
// que dependem de dados não coletados (ocupação, salário, empregador) ficam
// sempre como "a confirmar".
export const RULE_ENGINE_VERSION = "ireland-work-v1";

export type RecommendationResult = {
  visaSlug: string;
  compatibility: Compatibility;
  matchedCriteria: string[];
  missingCriteria: string[];
  blockers: string[];
  ruleVersion: string;
};

type Evaluation = Omit<
  RecommendationResult,
  "visaSlug" | "compatibility" | "ruleVersion"
> & {
  // Quantos fatos centrais ficaram sem resposta.
  unknownCore: number;
  exempt: boolean;
};

function emptyEvaluation(): Evaluation {
  return {
    matchedCriteria: [],
    missingCriteria: [],
    blockers: [],
    unknownCore: 0,
    exempt: false,
  };
}

// Fatos comuns às autorizações de trabalho irlandesas, conforme gov.ie e
// enterprise.gov.ie (consulta de 17/11/2026): quem não é do EEE precisa de
// employment permit, e as autorizações dependem de oferta de emprego.
function evaluateWorkBasics(profile: ImmigrationProfile): Evaluation {
  const result = emptyEvaluation();
  if (profile.objective === "work")
    result.matchedCriteria.push("Você pretende trabalhar na Irlanda.");
  else {
    result.missingCriteria.push(
      "Se o seu objetivo principal é trabalhar na Irlanda.",
    );
    result.unknownCore += 1;
  }

  if (profile.passportRegion === "eea") {
    result.exempt = true;
    result.blockers.push(
      "Pela informação oficial, quem tem nacionalidade do Espaço Econômico Europeu não precisa de employment permit para trabalhar na Irlanda. Confirme na fonte oficial.",
    );
  } else if (profile.passportRegion === "uk") {
    result.missingCriteria.push(
      "As regras específicas para quem tem passaporte do Reino Unido, que ainda não revisamos.",
    );
    result.unknownCore += 1;
  } else if (profile.passportRegion === null) {
    result.missingCriteria.push("A nacionalidade do seu passaporte.");
    result.unknownCore += 1;
  }

  if (profile.hasEmploymentOffer === true)
    result.matchedCriteria.push("Você informou uma oferta de emprego.");
  else if (profile.hasEmploymentOffer === false)
    result.blockers.push(
      "Este caminho depende de uma oferta de emprego de empregador na Irlanda, e você informou que ainda não tem uma.",
    );
  else {
    result.missingCriteria.push(
      "Se você já tem uma oferta de emprego na Irlanda.",
    );
    result.unknownCore += 1;
  }
  return result;
}

function compatibilityOf(
  evaluation: Evaluation,
  cap: Compatibility = "HIGH",
): Compatibility {
  if (evaluation.exempt) return "NOT_RECOMMENDED";
  if (evaluation.blockers.length) return "LOW";
  const level: Compatibility = evaluation.unknownCore === 0 ? "HIGH" : "MEDIUM";
  const order: Compatibility[] = ["HIGH", "MEDIUM", "LOW", "NOT_RECOMMENDED"];
  return order[Math.max(order.indexOf(level), order.indexOf(cap))];
}

function evaluateCriticalSkills(
  profile: ImmigrationProfile,
): RecommendationResult {
  const evaluation = evaluateWorkBasics(profile);
  if (profile.hasEmploymentOffer === true) {
    if (profile.offerDuration === "2y_plus")
      evaluation.matchedCriteria.push(
        "A oferta prevista é de dois anos ou mais.",
      );
    else if (profile.offerDuration === "under_2y")
      evaluation.blockers.push(
        "O Critical Skills pede oferta de pelo menos dois anos, e a sua é mais curta.",
      );
    else {
      evaluation.missingCriteria.push(
        "Se a oferta tem duração de pelo menos dois anos.",
      );
      evaluation.unknownCore += 1;
    }
  }
  evaluation.missingCriteria.push(
    "Se a ocupação e a remuneração estão dentro dos critérios vigentes.",
    "Se suas qualificações e experiência atendem ao enquadramento.",
    "Se o empregador atende às condições oficiais.",
  );
  return {
    visaSlug: "critical-skills-employment-permit",
    compatibility: compatibilityOf(evaluation),
    matchedCriteria: evaluation.matchedCriteria,
    missingCriteria: evaluation.missingCriteria,
    blockers: evaluation.blockers,
    ruleVersion: RULE_ENGINE_VERSION,
  };
}

function evaluateGeneralEmployment(
  profile: ImmigrationProfile,
): RecommendationResult {
  const evaluation = evaluateWorkBasics(profile);
  evaluation.missingCriteria.push(
    "Se a ocupação não está na lista oficial de ocupações inelegíveis.",
    "Se o empregador atende às condições oficiais.",
    "Os requisitos detalhados, ainda em revisão pela plataforma.",
  );
  return {
    visaSlug: "general-employment-permit",
    // Conteúdo ainda não revisado: nunca passa de compatibilidade média.
    compatibility: compatibilityOf(evaluation, "MEDIUM"),
    matchedCriteria: evaluation.matchedCriteria,
    missingCriteria: evaluation.missingCriteria,
    blockers: evaluation.blockers,
    ruleVersion: RULE_ENGINE_VERSION,
  };
}

// Caminhos de trabalho só são avaliados para quem quer trabalhar ou ainda
// está explorando. Estudo e família não têm regras revisadas ainda.
export function evaluateIrelandWorkPaths(
  profile: ImmigrationProfile,
): RecommendationResult[] {
  if (profile.objective !== "work" && profile.objective !== "exploring")
    return [];
  return [evaluateCriticalSkills(profile), evaluateGeneralEmployment(profile)];
}
