import "server-only";
import { createAuthClient } from "./server-client";
import { readAuthEnvironment } from "./environment";
import { requireUser } from "./require-user";

type Result = { error: boolean };
type EmailOperation = "sign_up" | "request_password_reset";

function logEmailFailure(operation: EmailOperation) {
  // Fixed fields only: provider errors can contain credentials or personal data.
  console.error(
    JSON.stringify({ event: "auth_email_operation_failed", operation }),
  );
}

async function perform(
  operation: () => Promise<{ error: unknown }>,
  emailOperation?: EmailOperation,
): Promise<Result> {
  try {
    return { error: Boolean((await operation()).error) };
  } catch {
    if (emailOperation) logEmailFailure(emailOperation);
    return { error: true };
  }
}

export async function signIn(email: string, password: string): Promise<Result> {
  return perform(async () =>
    (await createAuthClient()).auth.signInWithPassword({ email, password }),
  );
}

export async function signUp(email: string, password: string): Promise<Result> {
  return perform(async () => {
    const { APP_ORIGIN } = readAuthEnvironment();
    const client = await createAuthClient();
    const { error } = await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: new URL("/auth/confirm", APP_ORIGIN).href },
    });
    if (error) logEmailFailure("sign_up");
    // Provider responses must not disclose whether an email is registered.
    return { error: null };
  }, "sign_up");
}

export async function requestPasswordReset(email: string): Promise<Result> {
  return perform(async () => {
    const { APP_ORIGIN } = readAuthEnvironment();
    const client = await createAuthClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("/auth/confirm", APP_ORIGIN).href,
    });
    if (error) logEmailFailure("request_password_reset");
    return { error: null };
  }, "request_password_reset");
}

export async function updatePassword(password: string): Promise<Result> {
  return perform(async () => {
    await requireUser();
    return (await createAuthClient()).auth.updateUser({ password });
  });
}

export async function signOut(): Promise<Result> {
  return perform(async () =>
    (await createAuthClient()).auth.signOut({ scope: "local" }),
  );
}

export async function confirmEmail(
  tokenHash: string,
  type: "signup" | "recovery",
): Promise<Result> {
  return perform(async () =>
    (await createAuthClient()).auth.verifyOtp({ token_hash: tokenHash, type }),
  );
}
