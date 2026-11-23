import { z } from "zod";
import type { Answers } from "./types";

// Objeto de domínio do perfil migratório (Fase 15). Regras de recomendação e
// checklist trabalham só com este tipo, nunca com respostas cruas. Os mesmos
// códigos de pergunta valem para todos os destinos; cada destino pergunta só
// o que as regras dele usam, e o que não foi perguntado fica null.
export const objectives = [
  "work",
  "study",
  "family",
  "remote_work",
  "own_income",
  "job_search",
  "exploring",
] as const;

const enums = {
  objective: z.enum(objectives),
  // eea: UE, EEE ou Suíça; uk: Reino Unido; ie: Irlanda (só no Reino Unido);
  // local: cidadania ou residência permanente do próprio destino.
  passportRegion: z.enum(["eea", "uk", "ie", "local", "other"]),
  offerDuration: z.enum(["under_2y", "2y_plus", "unknown"]),
  occupationArea: z.enum([
    "technology",
    "engineering",
    "healthcare",
    "education",
    "other",
  ]),
  educationLevel: z.enum(["secondary", "technical", "degree", "postgraduate"]),
  experienceYears: z.enum(["none", "under_1", "1_3", "3_5", "5_plus"]),
  englishLevel: z.enum(["basic", "intermediate", "upper", "advanced"]),
  germanLevel: z.enum(["none", "a1_a2", "b1", "b2_plus"]),
  ageRange: z.enum(["under_21", "21_29", "30_39", "40_44", "45_plus"]),
  remoteIncome: z.enum([
    "none",
    "under_2200",
    "2200_2450",
    "2450_3700",
    "3700_plus",
  ]),
  remoteMonths: z.enum(["under_3", "3_6", "6_plus"]),
  passiveIncome: z.enum([
    "none",
    "under_1000",
    "1000_2400",
    "2400_2600",
    "2600_plus",
  ]),
  familyRelationship: z.enum(["spouse", "partner", "parent", "other"]),
  // "unknown" (não sei) vira null na normalização.
  familySponsorStatus: z.enum(["citizen", "permanent", "temporary"]),
};

export type ImmigrationProfile = {
  objective: z.infer<typeof enums.objective> | null;
  passportRegion: z.infer<typeof enums.passportRegion> | null;
  hasEmploymentOffer: boolean | null;
  offerDuration: z.infer<typeof enums.offerDuration> | null;
  occupationArea: z.infer<typeof enums.occupationArea> | null;
  educationLevel: z.infer<typeof enums.educationLevel> | null;
  familyInCountry: boolean | null;
  experienceYears: z.infer<typeof enums.experienceYears> | null;
  englishLevel: z.infer<typeof enums.englishLevel> | null;
  germanLevel: z.infer<typeof enums.germanLevel> | null;
  ageRange: z.infer<typeof enums.ageRange> | null;
  hasAdmission: boolean | null;
  hasFunds: boolean | null;
  worksRemotely: boolean | null;
  remoteIncome: z.infer<typeof enums.remoteIncome> | null;
  remoteMonths: z.infer<typeof enums.remoteMonths> | null;
  passiveIncome: z.infer<typeof enums.passiveIncome> | null;
  familyRelationship: z.infer<typeof enums.familyRelationship> | null;
  familySponsorStatus: z.infer<typeof enums.familySponsorStatus> | null;
};

const fields = {
  objective: ["objective", enums.objective],
  passportRegion: ["region", enums.passportRegion],
  hasEmploymentOffer: ["has_employment_offer", z.boolean()],
  offerDuration: ["offer_duration", enums.offerDuration],
  occupationArea: ["occupation_area", enums.occupationArea],
  educationLevel: ["education_level", enums.educationLevel],
  familyInCountry: ["family_in_country", z.boolean()],
  experienceYears: ["experience_years", enums.experienceYears],
  englishLevel: ["english_level", enums.englishLevel],
  germanLevel: ["german_level", enums.germanLevel],
  ageRange: ["age_range", enums.ageRange],
  hasAdmission: ["has_admission", z.boolean()],
  hasFunds: ["has_funds", z.boolean()],
  worksRemotely: ["works_remotely", z.boolean()],
  remoteIncome: ["remote_income", enums.remoteIncome],
  remoteMonths: ["remote_months", enums.remoteMonths],
  passiveIncome: ["passive_income", enums.passiveIncome],
  familyRelationship: ["family_relationship", enums.familyRelationship],
  familySponsorStatus: ["family_sponsor_status", enums.familySponsorStatus],
} as const satisfies Record<
  keyof ImmigrationProfile,
  readonly [string, z.ZodType]
>;

export const emptyProfile: ImmigrationProfile = Object.fromEntries(
  Object.keys(fields).map((key) => [key, null]),
) as ImmigrationProfile;

// Resposta ausente, de tipo inesperado ou com valor desconhecido vira null:
// "não sabemos" é diferente de "não", e as regras tratam null como falta de
// informação, nunca como resposta negativa.
export function normalizeProfile(answers: Answers): ImmigrationProfile {
  const profile = { ...emptyProfile } as Record<string, unknown>;
  for (const [key, [code, schema]] of Object.entries(fields)) {
    const result = schema.safeParse(answers[code]);
    profile[key] = result.success ? result.data : null;
  }
  const normalized = profile as ImmigrationProfile;
  // Respostas que só têm sentido com a anterior confirmada.
  if (normalized.hasEmploymentOffer !== true) normalized.offerDuration = null;
  if (normalized.worksRemotely !== true) {
    normalized.remoteIncome = null;
    normalized.remoteMonths = null;
  }
  if (normalized.familyInCountry !== true) {
    normalized.familyRelationship = null;
    normalized.familySponsorStatus = null;
  }
  return normalized;
}
