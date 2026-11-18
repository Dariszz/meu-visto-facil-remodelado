import "server-only";
import { cookies } from "next/headers";

// Cookie de sessão do Supabase: sb-<projeto>-auth-token, às vezes dividido em
// partes (.0, .1). Só a presença importa aqui.
const sessionCookie = /^sb-[a-z0-9]+-auth-token(\.\d+)?$/;

export function hasSessionCookie(names: readonly string[]): boolean {
  return names.some((name) => sessionCookie.test(name));
}

// Dica barata para o cabeçalho: lê só os cookies, sem chamar o Supabase.
// Não serve para autorizar nada; as páginas privadas continuam validando a
// sessão no servidor. Se a sessão tiver expirado, o painel leva ao login.
export async function readSessionHint(): Promise<boolean> {
  try {
    const store = await cookies();
    return hasSessionCookie(store.getAll().map((cookie) => cookie.name));
  } catch {
    return false;
  }
}
