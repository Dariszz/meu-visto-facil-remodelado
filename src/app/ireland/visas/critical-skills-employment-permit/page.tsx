import type { Metadata } from "next";
import { CriticalSkillsCatalogPage } from "@/features/visas/catalog-pages";

export const metadata: Metadata = {
  title: "Critical Skills Employment Permit na Irlanda | Meu Visto Fácil",
  description:
    "Entenda os principais requisitos e etapas do Critical Skills Employment Permit na Irlanda, com fontes oficiais e orientações informativas.",
};

export default function Page() {
  return <CriticalSkillsCatalogPage />;
}
