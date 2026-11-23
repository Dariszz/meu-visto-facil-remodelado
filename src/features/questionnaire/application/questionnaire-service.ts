import "server-only";
import {
  recommendationDestinations,
  type RecommendationDestination,
} from "@/features/destinations/registry";
import { getCurrentUserProfile } from "@/features/profile/service";
import {
  findAnswers,
  replaceAnswers,
} from "@/lib/db/repositories/answer-repository";
import {
  listActiveQuestions,
  toQuestionView,
} from "@/lib/db/repositories/question-repository";
import {
  isQuestionnaireComplete,
  readStoredAnswers,
  validateAnswers,
} from "../answers";
import {
  normalizeProfile,
  type ImmigrationProfile,
} from "../immigration-profile";
import type { Answers, QuestionView } from "../types";

export class QuestionnaireUnavailableError extends Error {
  readonly code = "QUESTIONNAIRE_UNAVAILABLE";
  constructor() {
    super("QUESTIONNAIRE_UNAVAILABLE");
    this.name = "QuestionnaireUnavailableError";
  }
}

export type QuestionnaireState =
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "UNAVAILABLE_FOR_COUNTRY" }
  | {
      kind: "READY";
      questions: QuestionView[];
      answers: Answers;
      complete: boolean;
      profile: ImmigrationProfile;
    };

async function guarded<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Erros de autenticação e de validação seguem para quem chamou tratar.
    if (
      error instanceof Error &&
      ["AUTH_REQUIRED", "ANSWERS_INVALID"].includes(
        (error as { code?: string }).code ?? "",
      )
    )
      throw error;
    console.error(
      JSON.stringify({
        event: "questionnaire_operation_failed",
        code: "QUESTIONNAIRE_UNAVAILABLE",
      }),
    );
    throw new QuestionnaireUnavailableError();
  }
}

// Perfil e perguntas não dependem um do outro: buscados em paralelo para
// economizar uma ida ao banco. O erro do perfil (inclusive falta de sessão)
// tem prioridade sobre o das perguntas.
async function loadProfileAndQuestions(countrySlug: string) {
  const [profile, records] = await Promise.allSettled([
    getCurrentUserProfile(),
    listActiveQuestions(countrySlug),
  ]);
  if (profile.status === "rejected") throw profile.reason;
  return {
    profile: profile.value,
    records: () =>
      records.status === "fulfilled"
        ? Promise.resolve(records.value)
        : Promise.reject(records.reason),
  };
}

// Serviço de aplicação (ADR 0004): identidade sempre resolvida no servidor;
// o navegador nunca informa de quem são as respostas.
export async function getQuestionnaire(
  countrySlug: string,
): Promise<QuestionnaireState> {
  const loaded = await loadProfileAndQuestions(countrySlug);
  const profile = loaded.profile;
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  return guarded(async () => {
    const records = await loaded.records();
    if (!records.length) return { kind: "UNAVAILABLE_FOR_COUNTRY" as const };
    const codeById = new Map(records.map((record) => [record.id, record.code]));
    const stored = await findAnswers(
      profile.id,
      records.map((record) => record.id),
    );
    const questions = records.map(toQuestionView);
    const answers = readStoredAnswers(
      questions,
      stored.map((row) => ({
        questionCode: codeById.get(row.questionId) ?? "",
        value: row.value,
      })),
    );
    return {
      kind: "READY" as const,
      questions,
      answers,
      complete: isQuestionnaireComplete(questions, answers),
      profile: normalizeProfile(answers),
    };
  });
}

export async function saveQuestionnaire(
  countrySlug: string,
  input: unknown,
): Promise<"SAVED" | "PROFILE_REQUIRED" | "UNAVAILABLE_FOR_COUNTRY"> {
  const loaded = await loadProfileAndQuestions(countrySlug);
  const profile = loaded.profile;
  if (!profile) return "PROFILE_REQUIRED";
  return guarded(async () => {
    const records = await loaded.records();
    if (!records.length) return "UNAVAILABLE_FOR_COUNTRY" as const;
    const answers = validateAnswers(records.map(toQuestionView), input);
    const idByCode = new Map(records.map((record) => [record.code, record.id]));
    await replaceAnswers({
      userProfileId: profile.id,
      countryQuestionIds: records.map((record) => record.id),
      answers: Object.entries(answers).map(([code, value]) => ({
        questionId: idByCode.get(code)!,
        value: value as string | boolean | string[],
      })),
    });
    return "SAVED" as const;
  });
}

export type DestinationQuestionnaireStatus = {
  slug: RecommendationDestination;
  name: string;
  status: "COMPLETE" | "STARTED" | "NOT_STARTED";
};

// Situação do questionário em cada destino, para a escolha de país.
export async function getQuestionnaireOverview(): Promise<
  | { kind: "PROFILE_REQUIRED" }
  | { kind: "READY"; destinations: DestinationQuestionnaireStatus[] }
> {
  const profile = await getCurrentUserProfile();
  if (!profile) return { kind: "PROFILE_REQUIRED" };
  const slugs = Object.keys(
    recommendationDestinations,
  ) as RecommendationDestination[];
  const states = await Promise.all(slugs.map((slug) => getQuestionnaire(slug)));
  return {
    kind: "READY",
    destinations: slugs.flatMap((slug, index) => {
      const state = states[index];
      if (state.kind !== "READY") return [];
      return [
        {
          slug,
          name: recommendationDestinations[slug].name,
          status: state.complete
            ? ("COMPLETE" as const)
            : Object.keys(state.answers).length
              ? ("STARTED" as const)
              : ("NOT_STARTED" as const),
        },
      ];
    }),
  };
}
