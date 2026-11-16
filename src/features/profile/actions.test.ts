import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import { createCurrentUserProfile } from "./service";
import { createProfileAction } from "./actions";
import { profileSchema } from "./validation";

vi.mock("server-only", () => ({}));
vi.mock("./service", () => ({ createCurrentUserProfile: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const initial = { status: "idle" as const };
function form() {
  const value = new FormData();
  value.set("displayName", "Maria");
  value.set("preferredLocale", "pt-BR");
  return value;
}
beforeEach(() => vi.resetAllMocks());
test("projeta campos permitidos, ignora identidade e redirect enviados", async () => {
  const data = form();
  data.set("authUserId", "other-user");
  data.set("next", "https://evil.example");
  await expect(createProfileAction(initial, data)).rejects.toThrow(
    "REDIRECT:/profile",
  );
  expect(createCurrentUserProfile).toHaveBeenCalledWith({
    displayName: "Maria",
    preferredLocale: "pt-BR",
  });
});
test("sessão expirada tem mensagem recuperável", async () => {
  vi.mocked(createCurrentUserProfile).mockRejectedValue(
    new AuthenticationError(),
  );
  expect((await createProfileAction(initial, form())).message).toMatch(
    /Entre novamente/,
  );
});
test("erros validados associados ao campo", async () => {
  const parsed = profileSchema.safeParse({
    displayName: "Maria",
    preferredLocale: "invalid",
  });
  if (parsed.success) throw new Error("fixture inválida");
  vi.mocked(createCurrentUserProfile).mockRejectedValue(parsed.error);
  expect(
    (await createProfileAction(initial, form())).fieldErrors?.preferredLocale,
  ).toBeTruthy();
});
test("erros internos não vazam para a UI", async () => {
  vi.mocked(createCurrentUserProfile).mockRejectedValue(
    new Error("private-db-credentials"),
  );
  const result = await createProfileAction(initial, form());
  expect(result.status).toBe("error");
  expect(JSON.stringify(result)).not.toContain("private-db-credentials");
});
