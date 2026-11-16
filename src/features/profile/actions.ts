"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { AuthenticationError } from "@/lib/auth/require-user";
import { createCurrentUserProfile } from "./service";
import type { ProfileActionState } from "./types";

export async function createProfileAction(
  _state: ProfileActionState,
  form: FormData,
): Promise<ProfileActionState> {
  try {
    // Explicit projection prevents clients from setting ownership or internal fields.
    await createCurrentUserProfile({
      displayName: form.get("displayName") ?? "",
      preferredLocale: form.get("preferredLocale"),
    });
  } catch (error) {
    if (error instanceof AuthenticationError)
      return {
        status: "error",
        message: "Sua sessão expirou. Entre novamente para criar seu perfil.",
      };
    if (error instanceof ZodError) {
      const fieldErrors: NonNullable<ProfileActionState["fieldErrors"]> = {};
      for (const issue of error.issues) {
        const field = issue.path[0];
        if (field === "displayName" || field === "preferredLocale")
          fieldErrors[field] ??= issue.message;
      }
      return {
        status: "error",
        message: "Confira os dados do perfil.",
        fieldErrors,
      };
    }
    return {
      status: "error",
      message:
        "Não foi possível criar seu perfil agora. Tente novamente em instantes.",
    };
  }
  revalidatePath("/profile");
  redirect("/profile");
}
