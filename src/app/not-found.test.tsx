// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import NotFound from "./not-found";

test("página 404 em português, com saídas para o início e os destinos", () => {
  render(<NotFound />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Página não encontrada" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Voltar ao início" }),
  ).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Ver destinos" })).toHaveAttribute(
    "href",
    "/destinos",
  );
});
