import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { startProcessFromVisaAction } from "@/features/processes/actions";
import { VisaDetailPage } from "@/features/visas/visa-detail-page";
import { dedicatedVisaRoute } from "@/features/visas/visa-routes";
import { readSessionHint } from "@/lib/auth/session-hint";
import { listPublicVisaSources } from "@/lib/db/repositories/official-source-repository";
import { findPublicVisa } from "@/lib/db/repositories/visa-repository";

type Params = Promise<{ pais: string; visto: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { pais, visto } = await params;
  const visa = await findPublicVisa(pais, visto).catch(() => null);
  return visa
    ? {
        title: `${visa.name} (${visa.country.name}) | Meu Visto Fácil`,
        description: visa.shortDescription,
      }
    : { title: "Visto | Meu Visto Fácil" };
}

export default async function VisaPage({ params }: { params: Params }) {
  await connection();
  const { pais, visto } = await params;
  const dedicated = dedicatedVisaRoute(pais, visto);
  if (dedicated) redirect(dedicated);
  const [visa, sources, signedIn] = await Promise.all([
    findPublicVisa(pais, visto),
    listPublicVisaSources(pais, visto),
    readSessionHint(),
  ]);
  if (!visa) notFound();
  return (
    <VisaDetailPage
      visa={visa}
      sources={sources}
      signedIn={signedIn}
      startAction={startProcessFromVisaAction}
    />
  );
}
