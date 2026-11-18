"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  startProcess,
  updateChecklistItemStatus,
} from "./application/process-service";
import { processHref } from "./presentation";

export type StartProcessState = { status: "idle" | "error"; message?: string };

const visaSlug = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const isAuthError = (error: unknown) =>
  (error as { code?: string } | null)?.code === "AUTH_REQUIRED";

// Fase 19: país fixo no servidor (Irlanda); o navegador envia só o visto.
export async function startIrelandProcessAction(
  _state: StartProcessState,
  form: FormData,
): Promise<StartProcessState> {
  const parsed = visaSlug.safeParse(form.get("visaSlug"));
  if (!parsed.success)
    return {
      status: "error",
      message: "Este caminho não pode virar processo agora.",
    };
  let result: Awaited<ReturnType<typeof startProcess>>;
  try {
    result = await startProcess("ireland", parsed.data);
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
    return {
      status: "error",
      message:
        "Não foi possível criar o processo agora. Tente novamente em instantes.",
    };
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (result.kind === "QUESTIONNAIRE_REQUIRED") redirect("/questionnaire");
  if (result.kind === "NOT_AVAILABLE")
    return {
      status: "error",
      message:
        "Este caminho ainda não tem checklist revisado ou não se aplica às suas respostas.",
    };
  redirect(processHref(result.processId));
}

// Fase 23: devolve só se deu certo; a tela desfaz a mudança quando falha.
export async function updateChecklistItemStatusAction(
  processId: string,
  itemId: string,
  status: string,
): Promise<boolean> {
  try {
    return (
      (await updateChecklistItemStatus(processId, itemId, status)) === "UPDATED"
    );
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
    return false;
  }
}
