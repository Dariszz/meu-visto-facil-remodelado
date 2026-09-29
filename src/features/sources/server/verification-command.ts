import "server-only";
import { sourceIdSchema } from "./verify-official-source";

// Operational confirmation, not automatic proof of an environment's purpose.
export function parseVerificationCommand(
  args: string[],
  env: Record<string, string | undefined>,
): string {
  if (
    env.NODE_ENV === "production" ||
    env.DB_SEED_CONFIRM !== "development" ||
    args.length !== 2 ||
    args[0] !== "--confirm-development"
  )
    throw new Error("SOURCE_VERIFICATION_TARGET_REJECTED");
  const parsed = sourceIdSchema.safeParse(args[1]);
  if (!parsed.success) throw new Error("SOURCE_ID_INVALID");
  return parsed.data;
}
