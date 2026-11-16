import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { AuthShell } from "@/features/auth/auth-shell";
import { ProfileForm } from "@/features/profile/profile-form";
import { getCurrentUserProfile } from "@/features/profile/service";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = { title: "Meu perfil | Meu Visto Fácil" };

export default async function ProfilePage() {
  let profile: Awaited<ReturnType<typeof getCurrentUserProfile>>;
  try {
    profile = await getCurrentUserProfile();
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <AuthShell
        title="Meu perfil"
        description="Não foi possível carregar seu perfil agora."
      >
        <Alert>Tente novamente em alguns instantes.</Alert>
        <Link
          href="/profile"
          className="mt-5 inline-block text-sm text-primary underline underline-offset-4"
        >
          Tentar novamente
        </Link>
      </AuthShell>
    );
  }
  if (!profile)
    return (
      <AuthShell
        title="Crie seu perfil"
        description="Escolha como quer ser chamado e confira o idioma da sua conta."
      >
        <ProfileForm />
      </AuthShell>
    );
  return (
    <AuthShell
      title="Meu perfil"
      description="Seu perfil está criado. Confira os dados da sua conta."
    >
      <dl className="space-y-5 text-sm">
        <div>
          <dt className="font-medium">Nome de exibição</dt>
          <dd className="mt-1 break-words text-muted-foreground">
            {profile.displayName ?? "Não informado"}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Idioma</dt>
          <dd className="mt-1 text-muted-foreground">
            {profile.preferredLocale === "pt-BR"
              ? "Português (Brasil)"
              : "Idioma não disponível"}
          </dd>
        </div>
      </dl>
      <Link
        href="/ireland"
        className="mt-6 inline-block text-sm text-primary underline underline-offset-4"
      >
        Explorar a Irlanda
      </Link>
    </AuthShell>
  );
}
