import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ContactLink } from "@/features/legal/legal-page";

export const metadata: Metadata = {
  title: "Conta excluída | Meu Visto Fácil",
  robots: { index: false },
};

export default async function AccountDeletedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { acesso } = await searchParams;
  const accessPending = acesso === "pendente";
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-16">
        <div className="mx-auto max-w-prose">
          <h1 className="text-3xl font-semibold text-balance">
            {accessPending ? "Seus dados foram apagados" : "Conta excluída"}
          </h1>
          {accessPending ? (
            <p className="mt-4 leading-relaxed">
              Perfil, respostas e processos foram apagados, mas não conseguimos
              remover o seu acesso agora. Entre de novo com o mesmo e-mail e
              repita a exclusão no perfil, ou escreva para <ContactLink /> que
              removemos para você.
            </p>
          ) : (
            <p className="mt-4 leading-relaxed">
              Apagamos o seu perfil, as respostas, os processos e o seu acesso.
              Se quiser voltar, é só criar uma conta nova.
            </p>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            Voltar ao início
          </Link>
        </div>
      </Container>
    </main>
  );
}
