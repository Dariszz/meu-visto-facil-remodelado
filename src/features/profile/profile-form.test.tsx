// @vitest-environment jsdom
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { ProfileForm } from "./profile-form";
import type { ProfileActionState } from "./types";

const { createProfileAction } = vi.hoisted(() => ({
  createProfileAction: vi.fn(),
}));
vi.mock("./actions", () => ({ createProfileAction }));
beforeEach(() => vi.resetAllMocks());

test("permite criar sem nome e envia o idioma disponível sem identidade", async () => {
  createProfileAction.mockResolvedValue({
    status: "success",
    message: "Perfil criado.",
  });
  render(<ProfileForm />);
  expect(
    screen.getByLabelText("Nome de exibição (opcional)"),
  ).not.toBeRequired();
  expect(screen.getByRole("combobox", { name: "Idioma" })).toHaveTextContent(
    "Português (Brasil)",
  );
  fireEvent.submit(
    screen.getByRole("button", { name: "Criar meu perfil" }).closest("form")!,
  );
  expect(await screen.findByRole("status")).toHaveTextContent("Perfil criado.");
  const submitted = createProfileAction.mock.calls[0][1] as FormData;
  expect(submitted.get("displayName")).toBe("");
  expect(submitted.get("preferredLocale")).toBe("pt-BR");
  expect(submitted.has("authUserId")).toBe(false);
});

test("preserva o nome e associa erros de validação aos campos", async () => {
  createProfileAction.mockResolvedValue({
    status: "error",
    message: "Confira os dados do perfil.",
    fieldErrors: {
      displayName: "Nome inválido.",
      preferredLocale: "Idioma inválido.",
    },
  });
  render(<ProfileForm />);
  fireEvent.change(screen.getByLabelText("Nome de exibição (opcional)"), {
    target: { value: "Pessoa" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: "Criar meu perfil" }).closest("form")!,
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Confira os dados do perfil.",
  );
  const name = screen.getByLabelText("Nome de exibição (opcional)");
  expect(name).toHaveValue("Pessoa");
  expect(name).toBeInvalid();
  expect(name).toHaveAccessibleDescription(/Nome inválido/);
  expect(
    screen.getByRole("combobox", { name: "Idioma" }),
  ).toHaveAccessibleDescription("Idioma inválido.");
  expect(
    (createProfileAction.mock.calls[0][1] as FormData).get("displayName"),
  ).toBe("Pessoa");
});

test("bloqueia novo envio enquanto aguarda e permite tentar novamente após erro", async () => {
  let resolve!: (state: ProfileActionState) => void;
  createProfileAction.mockReturnValue(
    new Promise<ProfileActionState>((done) => {
      resolve = done;
    }),
  );
  render(<ProfileForm />);
  fireEvent.submit(
    screen.getByRole("button", { name: "Criar meu perfil" }).closest("form")!,
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Criando perfil…" }),
    ).toBeDisabled(),
  );
  expect(screen.getByLabelText("Nome de exibição (opcional)")).toBeDisabled();
  expect(screen.getByRole("combobox", { name: "Idioma" })).toBeDisabled();
  await act(async () =>
    resolve({
      status: "error",
      message: "Não foi possível criar seu perfil agora.",
    }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível criar seu perfil agora.",
  );
  expect(
    screen.getByRole("button", { name: "Criar meu perfil" }),
  ).toBeEnabled();
});
