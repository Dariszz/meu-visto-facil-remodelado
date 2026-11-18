import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { readAuthEnvironment } from "./environment";

// Chave secreta do Supabase: só no servidor, usada apenas para excluir a
// própria conta da pessoa autenticada. Nunca vai para o navegador.
const secretKey = z.string().regex(/^sb_secret_[A-Za-z0-9_-]+$/);

export function isAccountDeletionConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return secretKey.safeParse(env.SUPABASE_SECRET_KEY).success;
}

export async function deleteAuthUser(
  authUserId: string,
  env: Record<string, string | undefined> = process.env,
): Promise<{ error: boolean }> {
  const key = secretKey.safeParse(env.SUPABASE_SECRET_KEY);
  if (!key.success) return { error: true };
  const { SUPABASE_URL } = readAuthEnvironment(env);
  const admin = createClient(SUPABASE_URL, key.data, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  try {
    const { error } = await admin.auth.admin.deleteUser(authUserId);
    // Já inexistente conta como concluído: a exclusão pode ser repetida.
    return { error: Boolean(error) && error?.status !== 404 };
  } catch {
    return { error: true };
  }
}
