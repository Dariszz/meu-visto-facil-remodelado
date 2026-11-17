import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import {
  emptyDashboard,
  exampleDashboard,
  previewLinks,
} from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia do painel | Meu Visto Fácil",
};

export default async function DashboardPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { estado } = await searchParams;
  return (
    <DashboardView
      data={estado === "vazio" ? emptyDashboard : exampleDashboard}
      links={{
        explore: previewLinks.explore,
        questionnaire: previewLinks.questionnaire,
        recommendations: previewLinks.recommendations,
      }}
    />
  );
}
