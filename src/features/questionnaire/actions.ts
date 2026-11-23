"use server";

import { redirect } from "next/navigation";
import { isRecommendationDestination } from "@/features/destinations/registry";
import { AnswersInvalidError } from "./answers";
import { saveQuestionnaire } from "./application/questionnaire-service";

export type QuestionnaireActionState = {
  status: "idle" | "error";
  message?: string;
};

const MAX_PAYLOAD = 10_000;

// O destino vem da rota, ligado no servidor (bind); o navegador envia só as
// respostas, e o destino é conferido de novo aqui.
export async function saveQuestionnaireAction(
  countrySlug: string,
  _state: QuestionnaireActionState,
  form: FormData,
): Promise<QuestionnaireActionState> {
  if (!isRecommendationDestination(countrySlug))
    return {
      status: "error",
      message: "O questionário deste destino não está disponível no momento.",
    };
  const raw = form.get("answers");
  if (typeof raw !== "string" || raw.length > MAX_PAYLOAD)
    return {
      status: "error",
      message: "Não foi possível ler as respostas. Revise e tente de novo.",
    };
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return {
      status: "error",
      message: "Não foi possível ler as respostas. Revise e tente de novo.",
    };
  }
  let result: Awaited<ReturnType<typeof saveQuestionnaire>>;
  try {
    result = await saveQuestionnaire(countrySlug, input);
  } catch (error) {
    if ((error as { code?: string }).code === "AUTH_REQUIRED")
      redirect("/login");
    if (error instanceof AnswersInvalidError)
      return {
        status: "error",
        message:
          "Algumas respostas estão incompletas. Revise as perguntas marcadas como obrigatórias.",
      };
    return {
      status: "error",
      message:
        "Não foi possível salvar agora. Suas respostas continuam na tela; tente novamente em instantes.",
    };
  }
  if (result === "PROFILE_REQUIRED") redirect("/profile");
  if (result === "UNAVAILABLE_FOR_COUNTRY")
    return {
      status: "error",
      message: "O questionário deste destino não está disponível no momento.",
    };
  redirect(`/recommendations/${countrySlug}`);
}
