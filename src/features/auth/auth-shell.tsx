import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-lg px-4 py-12 sm:py-20"
    >
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
      >
        Voltar ao início
      </Link>
      <div className="mt-6 rounded-lg border bg-card">
        <div className="space-y-3 p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
      </div>
    </main>
  );
}
