// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Page, { metadata } from "./page";

test("detalhes oferecem conteúdo, estrutura semântica e limites informativos", () => {
  render(<Page />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Critical Skills Employment Permit",
  );
  for (const name of [
    "Para quem pode ser relevante",
    "Principais requisitos",
    "Trabalho, entrada e residência",
    "Etapas gerais do caminho",
    "Fontes oficiais",
  ]) {
    expect(screen.getByRole("heading", { name, level: 2 })).toBeInTheDocument();
  }
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
  expect(screen.getByText("Irlanda · Trabalho")).toBeInTheDocument();
  expect(
    screen.getByText(/Oferta por pelo menos dois anos/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Pode ser necessário conforme sua nacionalidade/),
  ).toBeInTheDocument();
  expect(screen.getByText(/É distinta do permit/)).toBeInTheDocument();
  const disclaimer = screen.getByRole("complementary", {
    name: "Aviso sobre o conteúdo",
  });
  expect(disclaimer).toHaveTextContent(
    "não constitui aconselhamento ou revisão jurídica",
  );
  expect(disclaimer).toHaveTextContent("Não garante aprovação");
  expect(screen.getAllByText("10 de setembro de 2026")[0]).toHaveAttribute(
    "datetime",
    "2026-09-10",
  );
  expect(metadata.title).toContain("Critical Skills Employment Permit");
  expect(metadata.description).toBeTruthy();
});

test("breadcrumbs permitem retornar e identificam a página atual", () => {
  render(<Page />);
  const nav = screen.getByRole("navigation", { name: "Caminho de navegação" });
  for (const [name, href] of [
    ["Início", "/"],
    ["Irlanda", "/ireland"],
    ["Trabalho", "/ireland/work"],
  ]) {
    expect(within(nav).getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  }
  expect(within(nav).getByText("Critical Skills")).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("link", { name: "Voltar para trabalho na Irlanda" }),
  ).toHaveAttribute("href", "/ireland/work");
});

test("referências chegam às fontes oficiais com autoridades e URLs HTTPS controladas", () => {
  render(<Page />);
  const expected = [
    [
      "Critical Skills Employment Permit",
      "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/",
      "Department of Enterprise, Tourism and Employment",
    ],
    [
      "Coming to work in Ireland",
      "https://www.irishimmigration.ie/coming-to-work-in-ireland/",
      "Immigration Service Delivery",
    ],
    [
      "Registering your immigration permission",
      "https://www.irishimmigration.ie/registering-your-immigration-permission/",
      "Immigration Service Delivery",
    ],
  ];
  for (const [name, href, authority] of expected) {
    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    expect(link.closest("li")).toHaveTextContent(authority);
  }
  const external = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("href")?.startsWith("https:"));
  expect(external).toHaveLength(3);
  for (const link of external) {
    const url = new URL(link.getAttribute("href")!);
    expect(["enterprise.gov.ie", "www.irishimmigration.ie"]).toContain(
      url.hostname,
    );
    expect(url.username + url.password + url.port + url.search).toBe("");
    expect(link).not.toHaveAttribute("target", "_blank");
  }
  for (const link of screen.getAllByRole("link")) {
    expect(link).toHaveAccessibleName();
    const href = link.getAttribute("href")!;
    if (href.startsWith("#"))
      expect(document.getElementById(href.slice(1))).not.toBeNull();
    else
      expect([
        "/",
        "/ireland",
        "/ireland/work",
        ...expected.map((item) => item[1]),
      ]).toContain(href);
  }
});

vi.mock("@/features/visas/catalog-pages", async () => {
  const { CriticalSkillsPage } =
    await import("@/features/visas/critical-skills-page");
  const { catalogVisaFixture, catalogSourceFixtures } =
    await import("@/test/catalog-fixtures");
  const { presentCriticalSkills } =
    await import("@/features/visas/catalog-presentation");
  return {
    CriticalSkillsCatalogPage: () => (
      <CriticalSkillsPage
        visa={presentCriticalSkills(catalogVisaFixture, catalogSourceFixtures)}
      />
    ),
  };
});
