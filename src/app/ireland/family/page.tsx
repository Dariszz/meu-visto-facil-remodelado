import type { Metadata } from "next";
import { CategoryPage } from "@/features/visas/category-page";
import { irelandCategories } from "@/features/visas/data/ireland";
export const metadata: Metadata = {
  title: "Família na Irlanda | Meu Visto Fácil",
  description:
    "Explore a categoria de família na Irlanda e acompanhe a preparação das opções detalhadas do catálogo.",
};
export default function Page() {
  return <CategoryPage category={irelandCategories.family} />;
}
