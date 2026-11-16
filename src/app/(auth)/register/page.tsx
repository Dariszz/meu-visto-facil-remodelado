import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";

export const metadata: Metadata = { title: "Criar conta | Meu Visto Fácil" };
export default function RegisterPage() {
  return (
    <AuthShell
      title="Crie sua conta"
      description="Informe seu e-mail e escolha uma senha. Enviaremos um link para confirmar seu e-mail."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
