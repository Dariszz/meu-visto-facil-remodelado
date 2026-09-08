import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/landing-page";

const description =
  "Entenda possibilidades de imigração, organize requisitos e planeje seus próximos passos com fontes oficiais e personalização. Primeiro destino: Irlanda.";
export const metadata: Metadata = {
  title: "Meu Visto Fácil | Seu próximo passo começa com clareza",
  description,
  openGraph: {
    title: "Meu Visto Fácil | Imigrar começa com informação clara",
    description,
    locale: "pt_BR",
    type: "website",
    siteName: "Meu Visto Fácil",
  },
};
export default function HomePage() {
  return <LandingPage />;
}
