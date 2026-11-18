// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DeleteAccountForm } from "./delete-account-form";

test("formulário explica o que é apagado e pede confirmação digitada", () => {
  render(<DeleteAccountForm action={async () => ({ status: "idle" })} />);
  expect(
    screen.getByRole("region", { name: "Excluir conta" }),
  ).toHaveTextContent("Não dá para desfazer");
  expect(
    screen.getByRole("textbox", { name: "Digite EXCLUIR para confirmar" }),
  ).toHaveAttribute("name", "confirmation");
  expect(
    screen.getByRole("button", { name: "Excluir minha conta" }),
  ).toBeInTheDocument();
});
