// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import IrelandPage, { metadata as irelandMetadata } from "./page";
import WorkPage, { metadata as workMetadata } from "./work/page";
import StudyPage, { metadata as studyMetadata } from "./study/page";
import FamilyPage, { metadata as familyMetadata } from "./family/page";

test("destino conecta as três categorias e permite voltar ao início", () => {
  render(<IrelandPage />);
  for (const [label, slug] of [
    ["trabalho", "work"],
    ["estudo", "study"],
    ["família", "family"],
  ]) {
    expect(
      screen.getByRole("link", { name: `Explorar ${label}` }),
    ).toHaveAttribute("href", `/ireland/${slug}`);
  }
  const breadcrumbs = screen.getByRole("navigation", {
    name: "Caminho de navegação",
  });
  expect(
    within(breadcrumbs).getByRole("link", { name: "Início" }),
  ).toHaveAttribute("href", "/");
  expect(within(breadcrumbs).getByText("Irlanda")).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("trabalho apresenta as duas opções sem abrir detalhes inexistentes", () => {
  render(<WorkPage />);
  for (const name of [
    "Critical Skills Employment Permit",
    "General Employment Permit",
  ]) {
    expect(screen.getByRole("heading", { name, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Ver detalhes de ${name} — em breve`,
      }),
    ).toBeDisabled();
  }
  expect(
    screen.queryByRole("link", { name: /Ver detalhes/ }),
  ).not.toBeInTheDocument();
});

test.each([
  ["Estudo", StudyPage],
  ["Família", FamilyPage],
] as const)("%s apresenta estado em breve com saída útil", (name, Page) => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    `${name} na Irlanda`,
  );
  expect(
    screen.getByRole("heading", { name: "Opções detalhadas em breve" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Explorar outros objetivos" }),
  ).toHaveAttribute("href", "/ireland");
  expect(
    screen.queryByRole("button", { name: /Ver detalhes/ }),
  ).not.toBeInTheDocument();
});

test.each([
  [IrelandPage, irelandMetadata],
  [WorkPage, workMetadata],
  [StudyPage, studyMetadata],
  [FamilyPage, familyMetadata],
])(
  "página pública tem estrutura semântica, metadata e destinos válidos",
  (Page, metadata) => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
    expect(metadata.title).toContain("Irlanda");
    expect(metadata.description).toBeTruthy();
    const breadcrumbs = screen.getByRole("navigation", {
      name: "Caminho de navegação",
    });
    expect(within(breadcrumbs).getByRole("list")).toBeInTheDocument();
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAccessibleName();
      expect([
        "/",
        "/ireland",
        "/ireland/work",
        "/ireland/study",
        "/ireland/family",
      ]).toContain(link.getAttribute("href"));
    }
  },
);
