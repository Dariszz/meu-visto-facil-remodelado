import "server-only";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { findPublicCountry } from "@/lib/db/repositories/country-repository";
import {
  listPublicVisas,
  findPublicVisa,
} from "@/lib/db/repositories/visa-repository";
import { listPublicVisaSources } from "@/lib/db/repositories/official-source-repository";
import { IrelandPage } from "./ireland-page";
import { CategoryPage } from "./category-page";
import { CriticalSkillsPage } from "./critical-skills-page";
import { irelandCategories, editorialVisaPreviews } from "./data/ireland";
import {
  presentCriticalSkills,
  presentVisaSummary,
} from "./catalog-presentation";
import type { VisaCategory } from "./types";

export async function IrelandCatalogPage() {
  await connection();
  const country = await findPublicCountry("ireland");
  if (!country) notFound();
  return <IrelandPage country={country} />;
}

export async function CategoryCatalogPage({
  slug,
}: {
  slug: VisaCategory["slug"];
}) {
  await connection();
  const country = await findPublicCountry("ireland");
  if (!country) notFound();
  const visas = await listPublicVisas("ireland", slug);
  const summaries = visas.map((visa) => presentVisaSummary(visa, slug));
  if (slug === "work")
    summaries.push(
      ...editorialVisaPreviews.filter(
        (preview) => !visas.some((visa) => visa.slug === preview.slug),
      ),
    );
  const category = {
    ...irelandCategories[slug],
    ...(visas[0] ? { name: visas[0].category.name } : {}),
  };
  return (
    <CategoryPage country={country} category={category} summaries={summaries} />
  );
}

export async function CriticalSkillsCatalogPage() {
  await connection();
  const slug = "critical-skills-employment-permit";
  const visa = await findPublicVisa("ireland", slug);
  if (!visa) notFound();
  const sources = await listPublicVisaSources("ireland", slug);
  return <CriticalSkillsPage visa={presentCriticalSkills(visa, sources)} />;
}
