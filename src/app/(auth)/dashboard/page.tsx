import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CloudOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatePanel } from "@/components/feedback/state-panel";
import { Button } from "@/components/ui/button";
import {
  getDashboard,
  type DashboardResult,
} from "@/features/dashboard/application/get-dashboard";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { dashboardNotice } from "@/features/processes/notices";
import { AuthenticationError } from "@/lib/auth/require-user";

export const metadata: Metadata = { title: "Painel | Meu Visto Fácil" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
} = {}) {
  const { aviso } = (await searchParams) ?? {};
  let result: DashboardResult;
  try {
    result = await getDashboard();
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/login");
    return (
      <main id="main-content" tabIndex={-1}>
        <Container className="py-14">
          <StatePanel
            tone="error"
            icon={CloudOff}
            title="Não foi possível carregar seu painel"
            description="Pode ser uma instabilidade temporária. Seus dados não foram perdidos. Tente novamente em alguns instantes."
            action={
              <Button asChild variant="outline">
                <Link href="/dashboard">Tentar novamente</Link>
              </Button>
            }
          />
        </Container>
      </main>
    );
  }
  if (result.kind === "PROFILE_REQUIRED") redirect("/profile");
  return (
    <DashboardView
      data={result.view}
      links={{
        explore: "/destinos",
        questionnaire: "/questionnaire",
        recommendations: "/recommendations",
      }}
      notice={dashboardNotice(aviso)}
    />
  );
}
