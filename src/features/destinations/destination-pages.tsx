import "server-only";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  findPublicDestination,
  listPublicDestinations,
} from "@/lib/db/repositories/destination-repository";
import { DestinationPage } from "./destination-page";
import { DestinationsPage } from "./destinations-page";

export async function DestinationsCatalogPage() {
  await connection();
  return <DestinationsPage destinations={await listPublicDestinations()} />;
}

export async function DestinationCatalogPage({ slug }: { slug: string }) {
  await connection();
  const destination = await findPublicDestination(slug);
  if (!destination) notFound();
  return <DestinationPage destination={destination} />;
}
