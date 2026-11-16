import { z } from "zod";

const databaseUrl = z
  .string()
  .min(1)
  .superRefine((value, context) => {
    try {
      const url = new URL(value);
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      const allowedParameters = new Set([
        "sslmode",
        "schema",
        "channel_binding",
        "sslrootcert",
      ]);
      if (
        !["postgres:", "postgresql:"].includes(url.protocol) ||
        !url.username ||
        !url.password ||
        !url.hostname ||
        !/^\/[a-zA-Z0-9_-]+$/.test(url.pathname) ||
        url.hash ||
        (url.searchParams.has("sslrootcert") &&
          !url.searchParams.get("sslrootcert")) ||
        (!local && url.searchParams.get("sslmode") !== "verify-full") ||
        [...url.searchParams.keys()].some(
          (key) => !allowedParameters.has(key),
        ) ||
        [...url.searchParams.keys()].some(
          (key) => url.searchParams.getAll(key).length !== 1,
        ) ||
        url.searchParams.get("schema") !== "catalog"
      )
        context.addIssue({
          code: "custom",
          message: "Invalid database configuration",
        });
    } catch {
      context.addIssue({
        code: "custom",
        message: "Invalid database configuration",
      });
    }
  });

export function readDatabaseUrl(
  value: unknown,
  name:
    | "DATABASE_URL"
    | "DIRECT_URL"
    | "TEST_DATABASE_URL"
    | "PROFILE_DATABASE_URL",
): string {
  const result = databaseUrl.safeParse(value);
  if (!result.success) throw new Error(`DATABASE_CONFIG_INVALID: ${name}`);
  return result.data;
}

export function readTestDatabaseUrl(
  env: Record<string, string | undefined>,
): string {
  const value = readDatabaseUrl(env.TEST_DATABASE_URL, "TEST_DATABASE_URL");
  const url = new URL(value);
  // A hosted Supabase database is named postgres; pin the explicit project instead.
  const directProject = /^db\.([a-z0-9]{20})\.supabase\.co$/.exec(
    url.hostname,
  )?.[1];
  const sessionProject = /^[a-z0-9-]+\.pooler\.supabase\.com$/.test(
    url.hostname,
  )
    ? /\.([a-z0-9]{20})$/.exec(url.username)?.[1]
    : undefined;
  const project = directProject ?? sessionProject;
  const supabaseTarget =
    project !== undefined &&
    url.pathname === "/postgres" &&
    url.port === "5432" &&
    env.DB_TEST_CONFIRM === `supabase:${project}`;
  const localTarget =
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
    url.pathname === "/meu_visto_facil_test" &&
    env.DB_TEST_CONFIRM === "meu_visto_facil_test";
  if ((!supabaseTarget && !localTarget) || env.NODE_ENV === "production") {
    throw new Error("DATABASE_TEST_TARGET_REJECTED");
  }
  return value;
}
