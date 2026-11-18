import "server-only";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  findPublicDestination,
  listPublicDestinations,
} from "@/lib/db/repositories/destination-repository";
import { listPublicVisasForCountry } from "@/lib/db/repositories/visa-repository";
import { visaPageHref } from "@/features/visas/visa-routes";
import { DestinationPage } from "./destination-page";
import { DestinationsPage } from "./destinations-page";

export async function DestinationsCatalogPage() {
  await connection();
  return <DestinationsPage destinations={await listPublicDestinations()} />;
}

export async function DestinationCatalogPage({ slug }: { slug: string }) {
  await connection();
  const [destination, visas] = await Promise.all([
    findPublicDestination(slug),
    listPublicVisasForCountry(slug),
  ]);
  if (!destination) notFound();
  return (
    <DestinationPage
      destination={destination}
      visas={visas.map((visa) => ({
        slug: visa.slug,
        name: visa.name,
        shortDescription: visa.shortDescription,
        category: visa.category.name,
        href: visaPageHref(slug, visa.slug),
      }))}
    />
  );
}
