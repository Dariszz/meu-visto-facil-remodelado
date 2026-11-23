import { beforeEach, expect, test, vi } from "vitest";
import { AnswersInvalidError } from "./answers";
import { saveQuestionnaireAction } from "./actions";

const saveIrelandQuestionnaireAction = saveQuestionnaireAction.bind(
  null,
  "ireland",
);

vi.mock("server-only", () => ({}));
const { saveQuestionnaire, redirect } = vi.hoisted(() => ({
  saveQuestionnaire: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("./application/questionnaire-service", () => ({ saveQuestionnaire }));
vi.mock("next/navigation", () => ({ redirect }));
beforeEach(() => vi.clearAllMocks());

const idle = { status: "idle" as const };
function form(answers: string | null) {
  const data = new FormData();
  if (answers !== null) data.set("answers", answers);
  data.set("userProfileId", "outro");
  return data;
}

test("salva para a Irlanda e leva às recomendações, ignorando campos extras", async () => {
  saveQuestionnaire.mockResolvedValue("SAVED");
  await expect(
    saveIrelandQuestionnaireAction(idle, form('{"objective":"work"}')),
  ).rejects.toThrow("REDIRECT:/recommendations/ireland");
  expect(saveQuestionnaire).toHaveBeenCalledWith("ireland", {
    objective: "work",
  });
});

test("rejeita payload ausente, grande demais ou inválido sem chamar o serviço", async () => {
  for (const payload of [null, "{", "x".repeat(10_001)]) {
    expect(
      await saveIrelandQuestionnaireAction(idle, form(payload)),
    ).toMatchObject({
      status: "error",
    });
  }
  expect(saveQuestionnaire).not.toHaveBeenCalled();
});

test("respostas inválidas e falhas mostram mensagem sem detalhes técnicos", async () => {
  saveQuestionnaire.mockRejectedValueOnce(
    new AnswersInvalidError(["REQUIRED:x"]),
  );
  const invalid = await saveIrelandQuestionnaireAction(idle, form("{}"));
  expect(invalid.message).toMatch(/obrigatórias/);
  expect(invalid.message).not.toMatch(/REQUIRED/);
  saveQuestionnaire.mockRejectedValueOnce(new Error("db down"));
  expect(
    (await saveIrelandQuestionnaireAction(idle, form("{}"))).message,
  ).toMatch(/Não foi possível salvar/);
});

test("sessão ausente volta ao login; sem perfil vai criar o perfil", async () => {
  saveQuestionnaire.mockRejectedValueOnce(
    Object.assign(new Error("AUTH_REQUIRED"), { code: "AUTH_REQUIRED" }),
  );
  await expect(
    saveIrelandQuestionnaireAction(idle, form("{}")),
  ).rejects.toThrow("REDIRECT:/login");
  saveQuestionnaire.mockResolvedValueOnce("PROFILE_REQUIRED");
  await expect(
    saveIrelandQuestionnaireAction(idle, form("{}")),
  ).rejects.toThrow("REDIRECT:/profile");
});

test("destino desconhecido não chama o serviço", async () => {
  expect(
    await saveQuestionnaireAction("marte", idle, form('{"objective":"work"}')),
  ).toMatchObject({ status: "error" });
  expect(saveQuestionnaire).not.toHaveBeenCalled();
});
