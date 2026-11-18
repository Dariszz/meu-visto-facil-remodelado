// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import PrivacyPage from "./privacidade/page";
import TermsPage from "./termos/page";

test("privacidade explica dados, prestadores e como excluir", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Política de privacidade" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Supabase:/)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "excluir a sua conta" }),
  ).toHaveAttribute("href", "/profile");
  expect(
    screen.getAllByRole("link", { name: "meuvistofacil.oficial@gmail.com" })[0],
  ).toHaveAttribute("href", "mailto:meuvistofacil.oficial@gmail.com");
});

test("termos deixam claro que não é aconselhamento jurídico", () => {
  render(<TermsPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Termos de uso" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Não é aconselhamento jurídico/)).toBeInTheDocument();
});
