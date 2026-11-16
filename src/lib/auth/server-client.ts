import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authCookieOptions, readAuthEnvironment } from "./environment";

export async function createAuthClient({ readOnly = false } = {}) {
  const env = readAuthEnvironment();
  const store = await cookies();
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: authCookieOptions(),
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        // Server Components rely on the proxy to persist refreshed cookies.
        if (readOnly) return;
        values.forEach(({ name, value, options }) =>
          store.set(name, value, { ...options, ...authCookieOptions() }),
        );
      },
    },
  });
}
