import "server-only";
import { z } from "zod";

const origin = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    return (
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === "/" &&
      (url.protocol === "https:" ||
        (process.env.NODE_ENV !== "production" &&
          local &&
          url.protocol === "http:"))
    );
  });
const schema = z.object({
  SUPABASE_URL: origin,
  SUPABASE_PUBLISHABLE_KEY: z.string().regex(/^sb_publishable_[A-Za-z0-9_-]+$/),
  APP_ORIGIN: origin,
});

export function readAuthEnvironment(
  env: Record<string, string | undefined> = process.env,
) {
  const result = schema.safeParse(env);
  if (!result.success) throw new Error("AUTH_CONFIG_INVALID");
  return result.data;
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
