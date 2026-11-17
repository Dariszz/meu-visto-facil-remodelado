import type { Metadata } from "next";
import { DestinationCatalogPage } from "@/features/destinations/destination-pages";

export const metadata: Metadata = { title: "Destino | Meu Visto Fácil" };

export default async function DestinationRoute({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  return <DestinationCatalogPage slug={pais} />;
}
