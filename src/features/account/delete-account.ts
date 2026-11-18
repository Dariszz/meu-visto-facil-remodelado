import "server-only";
import { deleteAuthUser, isAccountDeletionConfigured } from "@/lib/auth/admin";
import { signOut } from "@/lib/auth/operations";
import { requireUser } from "@/lib/auth/require-user";
import { deleteUserProfileByAuthUserId } from "@/lib/db/repositories/user-profile-repository";

export type DeleteAccountResult =
  "DELETED" | "UNAVAILABLE" | "DATA_DELETED_ACCESS_REMAINS";

// Ordem pensada para nunca sobrar dado pessoal: primeiro o perfil (com
// respostas e processos, por cascade), depois a sessão, por último o acesso.
// Se só o último passo falhar, os dados já foram apagados e a pessoa pode
// entrar de novo e repetir.
export async function deleteMyAccount(): Promise<DeleteAccountResult> {
  const user = await requireUser();
  if (!isAccountDeletionConfigured()) return "UNAVAILABLE";
  try {
    await deleteUserProfileByAuthUserId(user.id);
  } catch {
    console.error(
      JSON.stringify({ event: "account_deletion_failed", step: "profile" }),
    );
    return "UNAVAILABLE";
  }
  await signOut().catch(() => undefined);
  const { error } = await deleteAuthUser(user.id);
  if (error) {
    console.error(
      JSON.stringify({ event: "account_deletion_failed", step: "auth" }),
    );
    return "DATA_DELETED_ACCESS_REMAINS";
  }
  return "DELETED";
}
