import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Meu Visto Fácil",
  description:
    "Clareza e organização para compreender seus próximos passos de imigração.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 rounded-md bg-card p-3 focus:not-sr-only"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
