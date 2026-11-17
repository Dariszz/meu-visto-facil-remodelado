import type { Metadata } from "next";
import { ProcessDetail } from "@/features/checklists/components/process-detail";
import { exampleProcess, previewLinks } from "@/features/previews/fixtures";

export const metadata: Metadata = {
  title: "Prévia do processo | Meu Visto Fácil",
};

export default function ProcessPreviewPage() {
  return (
    <ProcessDetail
      process={exampleProcess}
      dashboardHref={previewLinks.dashboard}
    />
  );
}
