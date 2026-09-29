import "server-only";
import { z } from "zod";
import type { VerificationSource } from "@/lib/db/repositories/source-verification-repository";
import {
  validateOfficialSourceUrl,
  type SourceVerificationResult,
} from "./validate-official-source-url";

export const sourceIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/);

type VerificationDependencies = {
  findSource: (id: string) => Promise<VerificationSource | null>;
  save: (
    source: VerificationSource,
    result: SourceVerificationResult,
  ) => Promise<boolean>;
  validate?: typeof validateOfficialSourceUrl;
};

export async function verifyOfficialSource(
  sourceId: unknown,
  dependencies: VerificationDependencies,
): Promise<SourceVerificationResult> {
  const parsed = sourceIdSchema.safeParse(sourceId);
  if (!parsed.success) throw new Error("SOURCE_ID_INVALID");
  const source = await dependencies.findSource(parsed.data);
  if (!source || source.status === "ARCHIVED")
    throw new Error("SOURCE_NOT_FOUND");
  const result = await (dependencies.validate ?? validateOfficialSourceUrl)({
    url: source.url,
    hostname: source.hostname,
  });
  if (!(await dependencies.save(source, result)))
    throw new Error("SOURCE_VERIFICATION_CONFLICT");
  return result;
}
