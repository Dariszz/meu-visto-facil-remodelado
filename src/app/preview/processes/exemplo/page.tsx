import type { Metadata } from "next";
import { parseChecklistFilter } from "@/features/checklists/filters";
import { ProcessDetail } from "@/features/checklists/components/process-detail";
import { exampleProcess, previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia do processo | Meu Visto Fácil",
};

export default async function ProcessPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filtro } = await searchParams;
  return (
    <ProcessDetail
      process={exampleProcess}
      dashboardHref={previewLinks.dashboard}
      initialFilter={parseChecklistFilter(filtro)}
    />
  );
}
