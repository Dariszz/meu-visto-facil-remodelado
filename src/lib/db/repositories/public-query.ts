import "server-only";
import { z } from "zod";

export const catalogSlug = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function publicQuery<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch {
    console.error(
      JSON.stringify({
        event: "catalog_read_failed",
        code: "CATALOG_UNAVAILABLE",
      }),
    );
    throw new Error("CATALOG_UNAVAILABLE");
  }
}
