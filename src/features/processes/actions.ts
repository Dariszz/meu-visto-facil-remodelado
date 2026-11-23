"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  addPersonalItem,
  deletePersonalItem,
  setProcessStatus,
  startProcess,
  startProcessForVisa,
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

// Página do visto: o navegador informa país e visto; o servidor confere se o
// visto está publicado e revisado antes de criar qualquer coisa.
export async function startProcessFromVisaAction(
  _state: StartProcessState,
  form: FormData,
): Promise<StartProcessState> {
  const country = visaSlug.safeParse(form.get("countrySlug"));
  const visa = visaSlug.safeParse(form.get("visaSlug"));
  if (!country.success || !visa.success)
    return {
      status: "error",
      message: "Este visto não pode virar checklist agora.",
    };
  let result: Awaited<ReturnType<typeof startProcessForVisa>>;
  try {
    result = await startProcessForVisa(country.data, visa.data);
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
    return {
      status: "error",
      message:
        "Não foi possível criar o checklist agora. Tente novamente em instantes.",
    };
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (result.kind !== "STARTED")
    return {
      status: "error",
      message: "Este visto ainda não tem checklist revisado.",
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

export type PersonalItemState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"title" | "description" | "stage", string>>;
};

export async function addPersonalItemAction(
  processId: string,
  _state: PersonalItemState,
  form: FormData,
): Promise<PersonalItemState> {
  let result: Awaited<ReturnType<typeof addPersonalItem>>;
  try {
    result = await addPersonalItem(processId, {
      stage: form.get("stage"),
      title: form.get("title") ?? "",
      description: form.get("description") ?? "",
    });
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
    return {
      status: "error",
      message: "Não foi possível salvar o item agora. Tente novamente.",
    };
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  if (result.kind === "INVALID")
    return {
      status: "error",
      message: "Confira o item.",
      fieldErrors: result.fieldErrors,
    };
  if (result.kind !== "ADDED")
    return {
      status: "error",
      message: "Não foi possível adicionar. O limite é de 50 itens pessoais.",
    };
  revalidatePath(processHref(processId));
  return { status: "success", message: "Item adicionado ao checklist." };
}

export async function deletePersonalItemAction(
  processId: string,
  itemId: string,
): Promise<boolean> {
  try {
    const deleted = await deletePersonalItem(processId, itemId);
    if (deleted) revalidatePath(processHref(processId));
    return deleted;
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
    return false;
  }
}

export async function setProcessStatusAction(
  processId: string,
  form: FormData,
): Promise<void> {
  const status = form.get("status");
  let ok = false;
  try {
    ok = await setProcessStatus(processId, status);
  } catch (error) {
    if (isAuthError(error)) redirect("/login");
  }
  if (ok && status === "ARCHIVED") {
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }
  revalidatePath(processHref(processId));
}
