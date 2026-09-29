import "server-only";
import type { Prisma } from "../generated/client";
import type { SourceVerificationResult } from "@/features/sources/server/validate-official-source-url";

const verificationSelect = {
  id: true,
  url: true,
  hostname: true,
  status: true,
  updatedAt: true,
  lastVerifiedAt: true,
} satisfies Prisma.OfficialSourceSelect;

export type VerificationSource = Prisma.OfficialSourceGetPayload<{
  select: typeof verificationSelect;
}>;

// Explicit client: public catalog credentials remain read-only.
export function findSourceForVerification(
  db: Prisma.TransactionClient,
  id: string,
): Promise<VerificationSource | null> {
  return db.officialSource.findFirst({
    where: { id, status: { not: "ARCHIVED" } },
    select: verificationSelect,
  });
}

export async function saveSourceVerification(
  db: Prisma.TransactionClient,
  source: VerificationSource,
  result: SourceVerificationResult,
): Promise<boolean> {
  if (source.status === "ARCHIVED") return false;
  const saved = await db.officialSource.updateMany({
    // Discard stale network results after editorial edits or another verification.
    where: {
      id: source.id,
      url: source.url,
      hostname: source.hostname,
      status: source.status,
      updatedAt: source.updatedAt,
      lastVerifiedAt: source.lastVerifiedAt,
    },
    data: {
      status: result.status,
      lastVerifiedAt: result.checkedAt,
      ...(result.status === "ACTIVE"
        ? { lastSuccessfulVerificationAt: result.checkedAt }
        : {}),
      verificationStatusCode: result.httpStatus,
      verificationResolvedUrl: result.resolvedUrl,
      verificationDurationMs: result.durationMs,
    },
  });
  return saved.count === 1;
}
