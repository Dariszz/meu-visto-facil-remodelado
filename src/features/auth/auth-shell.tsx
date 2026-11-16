import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        Voltar ao início
      </Link>
      <Card className="mt-6">
        <CardHeader className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Sua conta
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
