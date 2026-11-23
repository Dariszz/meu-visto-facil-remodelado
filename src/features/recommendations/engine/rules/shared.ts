import type { ImmigrationProfile } from "@/features/questionnaire/immigration-profile";
import { Evaluation, objective, passport, type Objective } from "../kit";

const objectivePhrases: Record<Objective, string> = {
  work: "trabalhar com contrato",
  job_search: "procurar emprego",
  remote_work: "morar e trabalhar remotamente",
  study: "estudar",
  family: "morar com familiares",
  own_income: "morar com renda própria",
  exploring: "explorar caminhos",
};

// Início comum: objetivo e nacionalidade.
export function start(
  profile: ImmigrationProfile,
  inName: string,
  expected: Objective | readonly Objective[],
  passportRule: Parameters<typeof passport>[1],
) {
  const evaluation = new Evaluation(profile);
  const list = typeof expected === "string" ? [expected] : expected;
  objective(
    evaluation,
    list,
    `Você pretende ${objectivePhrases[profile.objective ?? list[0]]} ${inName}.`,
    `Se o seu objetivo principal é ${objectivePhrases[list[0]]} ${inName}.`,
  );
  passport(evaluation, passportRule);
  return evaluation;
}

// Destinos da UE: quem é da UE/EEE/Suíça tem livre circulação.
export const euPassport = {
  exempt: ["eea"],
  exemptText:
    "Pela informação oficial, cidadãos da União Europeia, do Espaço Econômico Europeu e da Suíça não precisam deste visto. Confirme na fonte oficial.",
  unreviewed: ["uk"],
} as const;

export const otherRegime =
  "Familiares de cidadãos do país costumam seguir outro regime, que ainda não revisamos. Confirme na fonte oficial.";
