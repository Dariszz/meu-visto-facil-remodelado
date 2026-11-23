import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthShell } from "@/features/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";

export const metadata: Metadata = { title: "Entrar | Meu Visto Fácil" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const returnTo = typeof next === "string" ? safeRedirectPath(next) : null;
  const user = await getCurrentUser();
  if (user)
    return (
      <AuthShell
        title="Você está conectado"
        description="Sua sessão está ativa no Meu Visto Fácil."
      >
        <p className="mb-5 break-all text-sm text-muted-foreground">
          {user.email}
        </p>
        <AuthForm mode="logout" />
        <Button asChild className="mt-5 w-full">
          <Link href={returnTo ?? "/dashboard"}>
            {returnTo ? "Continuar" : "Ir para o painel"}
          </Link>
        </Button>
        <p className="mt-5 text-center text-sm">
          <Link
            href="/profile"
            className="text-primary underline underline-offset-4"
          >
            Meu perfil
          </Link>
        </p>
        <p className="mt-5 text-center text-sm">
          <Link
            href="/ireland"
            className="text-primary underline underline-offset-4"
          >
            Explorar a Irlanda
          </Link>
        </p>
      </AuthShell>
    );
  return (
    <AuthShell
      title="Bem-vindo de volta"
      description="Entre com seu e-mail e senha para acessar sua conta."
    >
      <AuthForm mode="login" next={returnTo ?? undefined} />
    </AuthShell>
  );
}
