import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Eye } from "lucide-react";
import { Container } from "@/components/layout/container";
import { previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b border-warning/20 bg-warning-subtle text-warning">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Eye aria-hidden="true" className="size-4 shrink-0" />
            Prévia de interface com dados de exemplo. Nada aqui é salvo ou
            representa uma conta real.
          </p>
          <Link
            href={previewLinks.index}
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            Todas as prévias
          </Link>
        </Container>
      </div>
      {children}
    </>
  );
}
