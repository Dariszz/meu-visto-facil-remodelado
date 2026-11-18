import type { Prisma } from "../src/lib/db/generated/client";
import type { CategorySlug, CountryContent } from "./seed-data/countries/types";

export const contentCategories: Record<
  CategorySlug,
  { name: string; description: string }
> = {
  work: {
    name: "Trabalho",
    description: "Caminhos para trabalhar com contrato ou oferta de emprego.",
  },
  study: {
    name: "Estudo",
    description: "Caminhos para estudar em cursos reconhecidos.",
  },
  family: {
    name: "Família",
    description: "Caminhos para morar com familiares que já vivem no país.",
  },
  "remote-work": {
    name: "Trabalho remoto",
    description: "Caminhos para quem trabalha a distância para fora do país.",
  },
  residence: {
    name: "Residência",
    description:
      "Caminhos para morar com renda própria, sem trabalhar no país.",
  },
  "job-search": {
    name: "Procura de trabalho",
    description: "Caminhos para entrar no país e procurar emprego.",
  },
};

const sourceId = (code: string, key: string) =>
  `seed-source-${code.toLowerCase()}-${key}`;

// Semeia um destino inteiro. Ao contrário do seed original da Irlanda, este
// atualiza o conteúdo quando ele muda: a revisão editorial vive no código.
// Só escreve o que mudou: rodar o seed duas vezes não altera nada (nem updatedAt).
function differs(
  existing: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  return Object.entries(data).some(([key, value]) => {
    const current = existing[key];
    if (value instanceof Date)
      return (
        !(current instanceof Date) || current.getTime() !== value.getTime()
      );
    return current !== value;
  });
}

// Requisitos que saíram do arquivo viram DEPRECATED (o histórico dos
// checklists continua apontando para eles).
// `keepCountryStatus`: para destinos que têm fluxo próprio de publicação (a
// Irlanda), não mexe em status nem cobertura do país.
export async function seedCountryContent(
  tx: Prisma.TransactionClient,
  content: CountryContent,
  { keepCountryStatus = false } = {},
) {
  const consultedAt = new Date(`${content.consultedAt}T00:00:00.000Z`);
  const code = content.code.toUpperCase();
  const countryData = {
    slug: content.slug,
    name: content.name,
    status: "ACTIVE" as const,
    coverageLevel: content.coverageLevel,
  };
  let country = await tx.country.findUnique({ where: { code } });
  if (keepCountryStatus) {
    if (!country) throw new Error(`SEED_COUNTRY_MISSING:${code}`);
  } else if (!country) {
    country = await tx.country.create({
      data: { id: `seed-country-${code.toLowerCase()}`, code, ...countryData },
    });
  } else if (differs(country, countryData)) {
    country = await tx.country.update({
      where: { id: country.id },
      data: countryData,
    });
  }

  for (const [key, source] of Object.entries(content.sources)) {
    const url = new URL(source.url);
    if (url.protocol !== "https:") throw new Error("SEED_SOURCE_NOT_HTTPS");
    const data = {
      title: source.title,
      authority: source.authority,
      url: source.url,
      hostname: url.hostname,
      status: "ACTIVE" as const,
      editorialConsultedAt: consultedAt,
    };
    const existing = await tx.officialSource.findFirst({
      where: {
        countryId: country.id,
        OR: [{ id: sourceId(code, key) }, { url: source.url }],
      },
    });
    // Fonte criada por outro seed (mesma URL) é só reutilizada: quem a criou
    // continua dono dos metadados de verificação.
    if (existing?.id === sourceId(code, key)) {
      if (differs(existing, data))
        await tx.officialSource.update({ where: { id: existing.id }, data });
    } else if (!existing)
      await tx.officialSource.create({
        data: { id: sourceId(code, key), countryId: country.id, ...data },
      });
  }
  const sourceIdFor = async (key: string) => {
    const source = content.sources[key];
    if (!source) throw new Error(`SEED_SOURCE_MISSING:${content.slug}:${key}`);
    const record = await tx.officialSource.findFirstOrThrow({
      where: { countryId: country.id, url: source.url },
      select: { id: true },
    });
    return record.id;
  };

  for (const visa of content.visas) {
    const categoryInfo = contentCategories[visa.category];
    const category = await tx.visaCategory.upsert({
      where: { slug: visa.category },
      update: {},
      create: {
        id: `seed-category-${visa.category}`,
        slug: visa.category,
        ...categoryInfo,
      },
    });
    const data = {
      categoryId: category.id,
      name: visa.name,
      officialName: visa.officialName ?? null,
      authorityName: visa.authority,
      shortDescription: visa.shortDescription,
      description: visa.description,
      status: "ACTIVE" as const,
      reviewStatus: "REVIEWED" as const,
      lastReviewedAt: consultedAt,
    };
    const found = await tx.visa.findUnique({
      where: { countryId_slug: { countryId: country.id, slug: visa.slug } },
    });
    const record = !found
      ? await tx.visa.create({
          data: {
            id: `seed-visa-${code.toLowerCase()}-${visa.slug}`,
            countryId: country.id,
            slug: visa.slug,
            ...data,
          },
        })
      : differs(found, data)
        ? await tx.visa.update({ where: { id: found.id }, data })
        : found;

    const overview = await sourceIdFor(visa.overviewSource);
    const cited = new Set([
      overview,
      ...(await Promise.all(
        [...visa.requirements, ...visa.steps].map((item) =>
          sourceIdFor(item.source),
        ),
      )),
    ]);
    const wanted = new Map(
      [...cited].map((id) => [
        id,
        id === overview ? ("OVERVIEW" as const) : ("OFFICIAL_GUIDE" as const),
      ]),
    );
    const links = await tx.visaSource.findMany({
      where: { visaId: record.id },
    });
    const stale = links.filter(
      (link) => wanted.get(link.sourceId) !== link.relationType,
    );
    await tx.visaSource.deleteMany({
      where: {
        visaId: record.id,
        sourceId: { in: stale.map((link) => link.sourceId) },
      },
    });
    const kept = new Set(
      links.filter((link) => !stale.includes(link)).map((l) => l.sourceId),
    );
    await tx.visaSource.createMany({
      data: [...wanted]
        .filter(([id]) => !kept.has(id))
        .map(([id, relationType]) => ({
          visaId: record.id,
          sourceId: id,
          relationType,
        })),
    });

    const items = [
      ...visa.requirements.map((item) => ({
        ...item,
        requirementType: "CONDITION" as const,
      })),
      ...visa.steps.map((item) => ({
        ...item,
        requirementType: "ACTION" as const,
      })),
    ];
    const codes = new Set<string>();
    for (const [index, item] of items.entries()) {
      if (codes.has(item.code))
        throw new Error(`SEED_DUPLICATE_REQUIREMENT:${visa.slug}:${item.code}`);
      codes.add(item.code);
      const requirementData = {
        title: item.title,
        description: item.description,
        category: item.category,
        requirementType: item.requirementType,
        importance: item.importance ?? "HIGH",
        isMandatory: true,
        sourceControlled: true,
        reviewStatus: "REVIEWED" as const,
        lastVerifiedAt: consultedAt,
        sortOrder: index,
      };
      const current = await tx.visaRequirement.findUnique({
        where: { visaId_code: { visaId: record.id, code: item.code } },
      });
      const requirement = !current
        ? await tx.visaRequirement.create({
            data: {
              id: `seed-requirement-${code.toLowerCase()}-${visa.slug}-${item.code}`,
              visaId: record.id,
              code: item.code,
              ...requirementData,
            },
          })
        : differs(current, requirementData)
          ? await tx.visaRequirement.update({
              where: { id: current.id },
              data: requirementData,
            })
          : current;
      const primary = await sourceIdFor(item.source);
      const sources = await tx.requirementSource.findMany({
        where: { requirementId: requirement.id },
      });
      const upToDate =
        sources.length === 1 &&
        sources[0].sourceId === primary &&
        sources[0].relationType === "PRIMARY";
      if (!upToDate) {
        await tx.requirementSource.deleteMany({
          where: { requirementId: requirement.id },
        });
        await tx.requirementSource.create({
          data: {
            requirementId: requirement.id,
            sourceId: primary,
            relationType: "PRIMARY",
          },
        });
      }
    }
    await tx.visaRequirement.updateMany({
      where: {
        visaId: record.id,
        code: { notIn: [...codes] },
        reviewStatus: { not: "DEPRECATED" },
      },
      data: { reviewStatus: "DEPRECATED" },
    });
  }
  return country;
}
