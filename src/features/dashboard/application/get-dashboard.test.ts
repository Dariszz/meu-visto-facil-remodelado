import { beforeEach, expect, test, vi } from "vitest";
import { getDashboard } from "./get-dashboard";

vi.mock("server-only", () => ({}));
const { getCurrentUserProfile } = vi.hoisted(() => ({
  getCurrentUserProfile: vi.fn(),
}));
vi.mock("@/features/profile/service", () => ({ getCurrentUserProfile }));
const { getQuestionnaire } = vi.hoisted(() => ({ getQuestionnaire: vi.fn() }));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaire,
}));
beforeEach(() => {
  vi.clearAllMocks();
  getQuestionnaire.mockResolvedValue({ kind: "READY", complete: false });
});

test("sem perfil, pede a criação do perfil", async () => {
  getCurrentUserProfile.mockResolvedValue(null);
  await expect(getDashboard()).resolves.toEqual({ kind: "PROFILE_REQUIRED" });
});

test("com perfil, devolve o view model com nome e listas reais vazias", async () => {
  getCurrentUserProfile.mockResolvedValue({
    id: "p1",
    displayName: "Marina",
    preferredLocale: "pt-BR",
  });
  await expect(getDashboard()).resolves.toEqual({
    kind: "READY",
    view: {
      displayName: "Marina",
      processes: [],
      hasCompletedQuestionnaire: false,
    },
  });
});

test("erros de identidade e banco sobem para a página tratar", async () => {
  getCurrentUserProfile.mockRejectedValue(new Error("PROFILE_UNAVAILABLE"));
  await expect(getDashboard()).rejects.toThrow("PROFILE_UNAVAILABLE");
});

test("questionário completo aparece no painel", async () => {
  getCurrentUserProfile.mockResolvedValue({
    id: "p1",
    displayName: null,
    preferredLocale: "pt-BR",
  });
  getQuestionnaire.mockResolvedValue({ kind: "READY", complete: true });
  const result = await getDashboard();
  expect(result.kind === "READY" && result.view.hasCompletedQuestionnaire).toBe(
    true,
  );
});
