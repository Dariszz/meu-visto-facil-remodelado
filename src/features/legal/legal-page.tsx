import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export const LEGAL_CONTACT_EMAIL = "meuvistofacil.oficial@gmail.com";
export const LEGAL_UPDATED_AT = "18 de novembro de 2026";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="py-12 sm:py-16">
        <article className="mx-auto max-w-prose">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            Voltar ao início
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Atualizado em {LEGAL_UPDATED_AT}
          </p>
          <p className="mt-6 text-lg leading-relaxed">{intro}</p>
          <div className="mt-10 space-y-10 leading-relaxed">{children}</div>
        </article>
      </Container>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
      <h2 className="text-xl font-semibold text-balance">{title}</h2>
      {children}
    </section>
  );
}

export function ContactLink() {
  return (
    <a
      href={`mailto:${LEGAL_CONTACT_EMAIL}`}
      className="break-all text-primary underline underline-offset-4"
    >
      {LEGAL_CONTACT_EMAIL}
    </a>
  );
}
