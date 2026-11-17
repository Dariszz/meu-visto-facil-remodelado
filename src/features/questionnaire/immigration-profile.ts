import { z } from "zod";
import type { Answers } from "./types";

// Objeto de domínio do perfil migratório (Fase 15). Regras de recomendação e
// checklist trabalham só com este tipo, nunca com respostas cruas.
export type ImmigrationProfile = {
  objective: "work" | "study" | "family" | "exploring" | null;
  passportRegion: "eea" | "uk" | "other" | null;
  hasEmploymentOffer: boolean | null;
  offerDuration: "under_2y" | "2y_plus" | "unknown" | null;
  occupationArea:
    "technology" | "engineering" | "healthcare" | "education" | "other" | null;
  educationLevel: "secondary" | "technical" | "degree" | "postgraduate" | null;
  familyInCountry: boolean | null;
};

const fields = {
  objective: ["objective", z.enum(["work", "study", "family", "exploring"])],
  passportRegion: ["region", z.enum(["eea", "uk", "other"])],
  hasEmploymentOffer: ["has_employment_offer", z.boolean()],
  offerDuration: ["offer_duration", z.enum(["under_2y", "2y_plus", "unknown"])],
  occupationArea: [
    "occupation_area",
    z.enum(["technology", "engineering", "healthcare", "education", "other"]),
  ],
  educationLevel: [
    "education_level",
    z.enum(["secondary", "technical", "degree", "postgraduate"]),
  ],
  familyInCountry: ["family_in_country", z.boolean()],
} as const satisfies Record<
  keyof ImmigrationProfile,
  readonly [string, z.ZodType]
>;

// Resposta ausente, de tipo inesperado ou com valor desconhecido vira null:
// "não sabemos" é diferente de "não", e as regras tratam null como falta de
// informação, nunca como resposta negativa.
export function normalizeProfile(answers: Answers): ImmigrationProfile {
  const read = <K extends keyof ImmigrationProfile>(key: K) => {
    const [code, schema] = fields[key];
    const result = schema.safeParse(answers[code]);
    return (result.success ? result.data : null) as ImmigrationProfile[K];
  };
  const profile: ImmigrationProfile = {
    objective: read("objective"),
    passportRegion: read("passportRegion"),
    hasEmploymentOffer: read("hasEmploymentOffer"),
    offerDuration: read("offerDuration"),
    occupationArea: read("occupationArea"),
    educationLevel: read("educationLevel"),
    familyInCountry: read("familyInCountry"),
  };
  // Duração só tem sentido com oferta confirmada.
  if (profile.hasEmploymentOffer !== true) profile.offerDuration = null;
  return profile;
}
