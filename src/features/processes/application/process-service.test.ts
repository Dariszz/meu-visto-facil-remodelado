import { beforeEach, expect, test, vi } from "vitest";
import { irelandQuestions } from "@/features/questionnaire/data/ireland-questions";
import { normalizeProfile } from "@/features/questionnaire/immigration-profile";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  getCurrentUserProfile: vi.fn(),
  getQuestionnaire: vi.fn(),
  findVisaForChecklist: vi.fn(),
  listSourcesByIds: vi.fn(),
  createProcessWithChecklist: vi.fn(),
  findProcessForProfile: vi.fn(),
  listProcessesForProfile: vi.fn(),
  updateItemStatusForProfile: vi.fn(),
}));
vi.mock("@/features/profile/service", () => ({
  getCurrentUserProfile: mocks.getCurrentUserProfile,
}));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaire: mocks.getQuestionnaire,
}));
vi.mock("@/lib/db/repositories/checklist-catalog-repository", () => ({
  findVisaForChecklist: mocks.findVisaForChecklist,
  listSourcesByIds: mocks.listSourcesByIds,
}));
vi.mock("@/lib/db/repositories/process-repository", () => ({
  createProcessWithChecklist: mocks.createProcessWithChecklist,
  findProcessForProfile: mocks.findProcessForProfile,
  listProcessesForProfile: mocks.listProcessesForProfile,
  updateItemStatusForProfile: mocks.updateItemStatusForProfile,
}));

const {
  getProcessDetail,
  startProcess,
  updateChecklistItemStatus,
  ProcessUnavailableError,
} = await import("./process-service");

const answers = {
  objective: "work",
  region: "other",
  has_employment_offer: true,
  offer_duration: "2y_plus",
  occupation_area: "technology",
};
const ready = (values: Record<string, unknown>) => ({
  kind: "READY",
  complete: true,
  questions: irelandQuestions,
  answers: values,
  profile: normalizeProfile(values as never),
});
const visa = {
  id: "visa-1",
  slug: "critical-skills-employment-permit",
  name: "Critical Skills Employment Permit",
  lastReviewedAt: new Date("2026-09-10T00:00:00.000Z"),
  country: { code: "IE", slug: "ireland", name: "Irlanda" },
  requirements: [
    {
      id: "r1",
      code: "employment-offer",
      title: "Oferta de emprego",
      description: "Oferta por pelo menos dois anos.",
      category: "EMPLOYMENT",
      importance: "HIGH",
      isMandatory: true,
      sortOrder: 0,
      sourceIds: ["seed-source-ie-permit"],
    },
  ],
};
const PROCESS = "7f0e7c8a-4d9b-4c51-9a77-2a4f7a1c0b11";
const ITEM = "0b8f9c5e-1a2d-4e3f-8b7c-6d5e4f3a2b1c";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCurrentUserProfile.mockResolvedValue({ id: "profile-a" });
  mocks.getQuestionnaire.mockResolvedValue(ready(answers));
  mocks.findVisaForChecklist.mockResolvedValue(visa);
  mocks.createProcessWithChecklist.mockResolvedValue({
    id: PROCESS,
    created: true,
  });
});

test("cria o processo com snapshot, versão das regras e checklist revisado", async () => {
  await expect(
    startProcess("ireland", "critical-skills-employment-permit"),
  ).resolves.toEqual({ kind: "STARTED", processId: PROCESS, created: true });
  const input = mocks.createProcessWithChecklist.mock.calls[0][0];
  expect(input.userProfileId).toBe("profile-a");
  expect(input.visaId).toBe("visa-1");
  expect(input.snapshot.ruleEngineVersion).toBe("ireland-work-v1");
  expect(input.snapshot.recommendation.compatibility).toBe("HIGH");
  expect(input.snapshot.profile).toMatchObject({ offerDuration: "2y_plus" });
  expect(input.checklist.generatorVersion).toBe("base-checklist-v1");
  expect(input.checklist.items).toHaveLength(1);
  expect(input.checklist.items[0].sourceIds).toEqual(["seed-source-ie-permit"]);
});

test("sem perfil ou com questionário incompleto não cria nada", async () => {
  mocks.getQuestionnaire.mockResolvedValueOnce({ kind: "PROFILE_REQUIRED" });
  await expect(startProcess("ireland", visa.slug)).resolves.toEqual({
    kind: "PROFILE_REQUIRED",
  });
  mocks.getQuestionnaire.mockResolvedValueOnce({
    kind: "READY",
    complete: false,
  });
  await expect(startProcess("ireland", visa.slug)).resolves.toEqual({
    kind: "QUESTIONNAIRE_REQUIRED",
  });
  expect(mocks.createProcessWithChecklist).not.toHaveBeenCalled();
});

test("caminho não recomendado, desconhecido ou sem checklist revisado não vira processo", async () => {
  mocks.getQuestionnaire.mockResolvedValueOnce(
    ready({ ...answers, region: "eea" }),
  );
  await expect(startProcess("ireland", visa.slug)).resolves.toEqual({
    kind: "NOT_AVAILABLE",
  });
  await expect(
    startProcess("ireland", "visto-que-nao-existe"),
  ).resolves.toEqual({ kind: "NOT_AVAILABLE" });
  mocks.findVisaForChecklist.mockResolvedValueOnce(null);
  await expect(startProcess("ireland", visa.slug)).resolves.toEqual({
    kind: "NOT_AVAILABLE",
  });
  expect(mocks.createProcessWithChecklist).not.toHaveBeenCalled();
});

test("falha de banco vira erro genérico", async () => {
  mocks.createProcessWithChecklist.mockRejectedValue(new Error("db down"));
  await expect(startProcess("ireland", visa.slug)).rejects.toBeInstanceOf(
    ProcessUnavailableError,
  );
});

test("detalhe com id inválido responde como não encontrado sem consultar", async () => {
  await expect(getProcessDetail("../outro")).resolves.toEqual({
    kind: "NOT_FOUND",
  });
  expect(mocks.findProcessForProfile).not.toHaveBeenCalled();
  mocks.findProcessForProfile.mockResolvedValue(null);
  await expect(getProcessDetail(PROCESS)).resolves.toEqual({
    kind: "NOT_FOUND",
  });
  expect(mocks.findProcessForProfile).toHaveBeenCalledWith(
    "profile-a",
    PROCESS,
  );
});

test("atualizar item valida status e ids e usa sempre o perfil da sessão", async () => {
  await expect(updateChecklistItemStatus(PROCESS, ITEM, "DONE")).resolves.toBe(
    "NOT_FOUND",
  );
  await expect(updateChecklistItemStatus("x", ITEM, "COMPLETED")).resolves.toBe(
    "NOT_FOUND",
  );
  expect(mocks.updateItemStatusForProfile).not.toHaveBeenCalled();
  mocks.updateItemStatusForProfile.mockResolvedValue(true);
  await expect(
    updateChecklistItemStatus(PROCESS, ITEM, "COMPLETED"),
  ).resolves.toBe("UPDATED");
  expect(mocks.updateItemStatusForProfile).toHaveBeenCalledWith({
    userProfileId: "profile-a",
    processId: PROCESS,
    itemId: ITEM,
    status: "COMPLETED",
  });
  mocks.updateItemStatusForProfile.mockResolvedValue(false);
  await expect(
    updateChecklistItemStatus(PROCESS, ITEM, "PENDING"),
  ).resolves.toBe("NOT_FOUND");
});
