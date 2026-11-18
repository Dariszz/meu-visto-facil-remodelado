"use server";

import { redirect } from "next/navigation";
import { deleteMyAccount } from "./delete-account";
import { DELETE_CONFIRMATION, type DeleteAccountState } from "./types";

export async function deleteAccountAction(
  _state: DeleteAccountState,
  form: FormData,
): Promise<DeleteAccountState> {
  const confirmation = String(form.get("confirmation") ?? "").trim();
  if (confirmation.toUpperCase() !== DELETE_CONFIRMATION)
    return {
      status: "error",
      message: `Digite ${DELETE_CONFIRMATION} para confirmar.`,
    };
  let result: Awaited<ReturnType<typeof deleteMyAccount>>;
  try {
    result = await deleteMyAccount();
  } catch (error) {
    if ((error as { code?: string } | null)?.code === "AUTH_REQUIRED")
      redirect("/login");
    throw error;
  }
  if (result === "UNAVAILABLE")
    return {
      status: "error",
      message:
        "Não foi possível excluir a conta agora. Nada foi apagado; tente novamente em instantes.",
    };
  if (result === "DATA_DELETED_ACCESS_REMAINS")
    redirect("/conta-excluida?acesso=pendente");
  redirect("/conta-excluida");
}
