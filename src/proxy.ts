import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions, readAuthEnvironment } from "@/lib/auth/environment";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  try {
    const env = readAuthEnvironment();
    const client = createServerClient(
      env.SUPABASE_URL,
      env.SUPABASE_PUBLISHABLE_KEY,
      {
        cookieOptions: authCookieOptions(),
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(values) {
            values.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            values.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, {
                ...options,
                ...authCookieOptions(),
              }),
            );
          },
        },
      },
    );
    await client.auth.getUser();
  } catch {
    // Unavailable auth must not break rendering; private operations fail closed.
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = {
  matcher: [
    "/login",
    "/dashboard",
    "/questionnaire",
    "/recommendations",
    "/processes/:path*",
    "/profile",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/confirm",
  ],
};
