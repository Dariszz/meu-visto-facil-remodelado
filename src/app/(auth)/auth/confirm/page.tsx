import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";

export const metadata: Metadata = {
  title: "Confirmar acesso | Meu Visto Fácil",
};
const confirmationSchema = z.object({
  token_hash: z.string().min(1).max(2048),
  type: z.enum(["signup", "recovery"]),
});

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = confirmationSchema.safeParse(await searchParams);
  if (!parsed.success)
    return (
      <AuthShell
        title="Link inválido"
        description="Este link não contém os dados necessários para confirmar seu acesso."
      >
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline underline-offset-4"
        >
          Solicitar um novo link de recuperação
        </Link>
      </AuthShell>
    );
  return (
    <AuthShell
      title={
        parsed.data.type === "recovery"
          ? "Recuperar sua conta"
          : "Confirme seu e-mail"
      }
      description="Selecione Continuar para confirmar este link e acessar sua conta."
    >
      <AuthForm mode="confirm" confirmation={parsed.data} />
    </AuthShell>
  );
}
