// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { AuthenticationError } from "@/lib/auth/require-user";
import ProfilePage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
const { getCurrentUserProfile, redirect } = vi.hoisted(() => ({
  getCurrentUserProfile: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/profile/service", () => ({ getCurrentUserProfile }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/features/profile/profile-form", () => ({
  ProfileForm: ({
    initialDisplayName,
  }: {
    initialDisplayName?: string | null;
  }) =>
    initialDisplayName === undefined ? (
      <form aria-label="Criar perfil" />
    ) : (
      <form aria-label="Editar perfil" data-name={initialDisplayName ?? ""} />
    ),
}));
vi.mock("@/features/account/actions", () => ({ deleteAccountAction: vi.fn() }));
vi.mock("@/features/account/delete-account-form", () => ({
  DeleteAccountForm: () => <section aria-label="Excluir conta" />,
}));
beforeEach(() => vi.clearAllMocks());

test("redireciona para login quando a sessão não está autenticada", async () => {
  getCurrentUserProfile.mockRejectedValue(new AuthenticationError());
  await expect(ProfilePage()).rejects.toThrow("REDIRECT:/login");
});

test("oferece criação quando o usuário ainda não possui perfil", async () => {
  getCurrentUserProfile.mockResolvedValue(null);
  render(await ProfilePage());
  expect(
    screen.getByRole("heading", { name: "Crie seu perfil" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("form", { name: "Criar perfil" }),
  ).toBeInTheDocument();
});

test.each(["Pessoa", null])(
  "mostra perfil existente em modo de edição com nome %s",
  async (displayName) => {
    getCurrentUserProfile.mockResolvedValue({
      id: "private-profile-id",
      displayName,
      preferredLocale: "pt-BR",
    });
    render(await ProfilePage());
    expect(screen.getByRole("form", { name: "Editar perfil" })).toHaveAttribute(
      "data-name",
      displayName ?? "",
    );
    expect(screen.queryByText("private-profile-id")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Explorar a Irlanda" }),
    ).toHaveAttribute("href", "/ireland");
    expect(
      screen.getByRole("link", { name: "Ir para o painel" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(
      screen.getByRole("region", { name: "Excluir conta" }),
    ).toBeInTheDocument();
  },
);

test("falha de infraestrutura apresenta erro seguro e opção de tentar novamente", async () => {
  getCurrentUserProfile.mockRejectedValue(
    new Error("postgresql://secret database unavailable"),
  );
  render(await ProfilePage());
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Tente novamente em alguns instantes.",
  );
  expect(screen.queryByText(/postgresql|secret/)).not.toBeInTheDocument();
  expect(screen.queryByRole("form")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Tentar novamente" }),
  ).toHaveAttribute("href", "/profile");
});
