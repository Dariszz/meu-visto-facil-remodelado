import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export const metadata: Metadata = { title: "Nova senha | Meu Visto Fácil" };
export default async function ResetPasswordPage() {
  if (!(await getCurrentUser())) redirect("/login");
  return (
    <AuthShell
      title="Escolha uma nova senha"
      description="Defina uma nova senha para proteger sua conta."
    >
      <AuthForm mode="reset-password" />
    </AuthShell>
  );
}
