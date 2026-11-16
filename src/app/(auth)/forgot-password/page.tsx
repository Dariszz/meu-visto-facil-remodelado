import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";

export const metadata: Metadata = {
  title: "Recuperar senha | Meu Visto Fácil",
};
export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recupere seu acesso"
      description="Informe seu e-mail para solicitar um link de recuperação de senha."
    >
      <AuthForm mode="forgot-password" />
    </AuthShell>
  );
}
