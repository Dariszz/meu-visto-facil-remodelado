import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CloudOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import { ProcessDetail } from "@/features/checklists/components/process-detail";
import { parseChecklistFilter } from "@/features/checklists/filters";
import {
  addPersonalItemAction,
  deletePersonalItemAction,
  setProcessStatusAction,
  updateChecklistItemStatusAction,
} from "@/features/processes/actions";
import {
  getProcessDetail,
  type ProcessDetailResult,
} from "@/features/processes/application/process-service";
import { processNotice } from "@/features/processes/notices";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = { title: "Processo | Meu Visto Fácil" };

export default async function ProcessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, { filtro, aviso }] = await Promise.all([params, searchParams]);
  let result: ProcessDetailResult;
  try {
    result = await getProcessDetail(id);
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <main id="main-content" tabIndex={-1}>
        <Container className="py-14">
          <StatePanel
            tone="error"
            icon={CloudOff}
            title="Não foi possível carregar o processo"
            description="Pode ser uma instabilidade temporária. Seu progresso não foi perdido. Tente novamente em alguns instantes."
            action={
              <Button asChild variant="outline">
                <Link href={`/processes/${encodeURIComponent(id)}`}>
                  Tentar novamente
                </Link>
              </Button>
            }
          />
        </Container>
      </main>
    );
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  // Inexistente e de outra pessoa respondem igual: 404, sem revelar nada.
  if (result.kind === "NOT_FOUND") notFound();
  return (
    <ProcessDetail
      process={result.process}
      dashboardHref="/dashboard"
      initialFilter={parseChecklistFilter(filtro)}
      onStatusChange={updateChecklistItemStatusAction.bind(
        null,
        result.process.id,
      )}
      onDeletePersonal={deletePersonalItemAction.bind(null, result.process.id)}
      addPersonalItem={addPersonalItemAction.bind(null, result.process.id)}
      setStatus={setProcessStatusAction.bind(null, result.process.id)}
      notice={processNotice(aviso)}
    />
  );
}
