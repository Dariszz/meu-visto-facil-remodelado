import "server-only";
import { cache } from "react";
import { z } from "zod";
import { createAuthClient } from "./server-client";

const currentUser = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
});
export type CurrentUser = z.infer<typeof currentUser>;

// Memorizado por requisição: painel e serviços pedem o usuário mais de uma
// vez na mesma renderização, e cada consulta é uma chamada ao Supabase Auth.
export const getCurrentUser = cache(
  async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
      const client = await createAuthClient({ readOnly: true });
      const { data, error } = await client.auth.getUser();
      if (error) return null;
      const parsed = currentUser.safeParse(data.user);
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  },
);
