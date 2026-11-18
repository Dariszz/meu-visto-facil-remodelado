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
const { listMyProcesses } = vi.hoisted(() => ({ listMyProcesses: vi.fn() }));
vi.mock("@/features/processes/application/process-service", () => ({
  listMyProcesses,
}));
beforeEach(() => {
  vi.clearAllMocks();
  getQuestionnaire.mockResolvedValue({ kind: "READY", complete: false });
  listMyProcesses.mockResolvedValue([]);
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

test("processos do próprio perfil aparecem no painel", async () => {
  getCurrentUserProfile.mockResolvedValue({
    id: "p1",
    displayName: null,
    preferredLocale: "pt-BR",
  });
  const summary = {
    id: "proc-1",
    title: "Minha mudança: Critical Skills Employment Permit",
    visaName: "Critical Skills Employment Permit",
    countryName: "Irlanda",
    status: "ACTIVE",
    itemStatuses: ["COMPLETED", "PENDING"],
    nextStep: "Ocupação e remuneração",
    updatedAt: "2026-11-18T00:00:00.000Z",
    href: "/processes/proc-1",
  };
  listMyProcesses.mockResolvedValue([summary]);
  const result = await getDashboard();
  expect(result.kind === "READY" && result.view.processes).toEqual([summary]);
});
