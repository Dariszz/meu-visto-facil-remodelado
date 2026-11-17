"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import {
  signIn,
  signUp,
  requestPasswordReset,
  updatePassword,
  signOut,
  confirmEmail,
} from "@/lib/auth/operations";
import {
  confirmationSchema,
  emailSchema,
  loginSchema,
  passwordSchema,
  registerSchema,
} from "./validation";
import type { AuthActionState } from "./types";

function invalid(error: ZodError): AuthActionState {
  const fieldErrors: NonNullable<AuthActionState["fieldErrors"]> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === "email" ||
      field === "password" ||
      field === "confirmPassword"
    )
      fieldErrors[field] ??= issue.message;
  }
  return {
    status: "error",
    message: "Confira os dados informados.",
    fieldErrors,
  };
}
const unavailable = (): AuthActionState => ({
  status: "error",
  message: "Não foi possível concluir agora. Tente novamente em instantes.",
});
function credentials(form: FormData) {
  return {
    email: form.get("email"),
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  };
}

export async function loginAction(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(credentials(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const result = await signIn(parsed.data.email, parsed.data.password);
    if (result.error)
      return {
        status: "error",
        message:
          "Não foi possível entrar. Confira e-mail, senha e confirmação da conta.",
      };
  } catch {
    return unavailable();
  }
  revalidatePath("/login");
  redirect("/dashboard");
}

export async function registerAction(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(credentials(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    if ((await signUp(parsed.data.email, parsed.data.password)).error)
      return unavailable();
  } catch {
    return unavailable();
  }
  return {
    status: "success",
    message:
      "Se o cadastro puder ser realizado, você receberá um e-mail para confirmar sua conta. Se já possui uma conta, entre ou recupere sua senha.",
  };
}

export async function forgotPasswordAction(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = emailSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) return invalid(parsed.error);
  try {
    if ((await requestPasswordReset(parsed.data.email)).error)
      return unavailable();
  } catch {
    return unavailable();
  }
  return {
    status: "success",
    message:
      "Se houver uma conta associada a este e-mail, você receberá as instruções para recuperar sua senha.",
  };
}

export async function resetPasswordAction(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = passwordSchema.safeParse(credentials(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    if ((await updatePassword(parsed.data.password)).error)
      return unavailable();
  } catch {
    return unavailable();
  }
  return {
    status: "success",
    message:
      "Senha atualizada. Você já pode acessar sua conta com a nova senha.",
  };
}

export async function logoutAction(
  _state: AuthActionState,
  _form: FormData,
): Promise<AuthActionState> {
  void _state;
  void _form;
  try {
    if ((await signOut()).error) return unavailable();
  } catch {
    return unavailable();
  }
  revalidatePath("/login");
  redirect("/login");
}

export async function confirmEmailAction(
  _state: AuthActionState,
  form: FormData,
): Promise<AuthActionState> {
  const parsed = confirmationSchema.safeParse({
    token_hash: form.get("token_hash"),
    type: form.get("type"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Este link é inválido. Solicite um novo e-mail.",
    };
  try {
    if ((await confirmEmail(parsed.data.token_hash, parsed.data.type)).error)
      return {
        status: "error",
        message: "Este link expirou ou já foi usado. Solicite um novo e-mail.",
      };
  } catch {
    return unavailable();
  }
  revalidatePath("/login");
  redirect(parsed.data.type === "recovery" ? "/reset-password" : "/login");
}
