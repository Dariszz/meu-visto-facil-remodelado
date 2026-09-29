import type { Metadata } from "next";
import { CategoryCatalogPage } from "@/features/visas/catalog-pages";

export const metadata: Metadata = {
  title: "Trabalho na Irlanda | Meu Visto Fácil",
  description:
    "Explore a categoria de trabalho na Irlanda e acompanhe a preparação das opções detalhadas do catálogo.",
};
export default function Page() {
  return <CategoryCatalogPage slug="work" />;
}
