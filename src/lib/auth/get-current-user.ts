import "server-only";
import { z } from "zod";
import { createAuthClient } from "./server-client";

const currentUser = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
});
export type CurrentUser = z.infer<typeof currentUser>;

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const client = await createAuthClient({ readOnly: true });
    const { data, error } = await client.auth.getUser();
    if (error) return null;
    const parsed = currentUser.safeParse(data.user);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
