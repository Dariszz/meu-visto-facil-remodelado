// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import type { CatalogSource } from "@/features/visas/catalog-types";
import { DestinationPage } from "./destination-page";
import { DestinationsPage } from "./destinations-page";

const source = (overrides: Partial<CatalogSource> = {}): CatalogSource => ({
  id: "s1",
  title: "Vistos nacionais",
  authority: "Ministério",
  hostname: "enterprise.gov.ie",
  status: "ACTIVE",
  url: "https://enterprise.gov.ie/en/",
  consultedAt: "2026-11-17",
  lastVerifiedAt: null,
  lastSuccessfulVerificationAt: null,
  ...overrides,
});

test("lista destinos com o nível de cobertura em texto", () => {
  render(
    <DestinationsPage
      destinations={[
        {
          code: "IE",
          slug: "ireland",
          name: "Irlanda",
          coverageLevel: "PARTIAL",
        },
        {
          code: "PT",
          slug: "portugal",
          name: "Portugal",
          coverageLevel: "LINKS_ONLY",
        },
      ]}
    />,
  );
  const items = screen.getAllByRole("listitem");
  expect(
    within(items[0]).getByRole("link", { name: "Irlanda" }),
  ).toHaveAttribute("href", "/destinos/ireland");
  expect(
    within(items[0]).getByText("Alguns caminhos revisados"),
  ).toBeInTheDocument();
  expect(
    within(items[1]).getByText("Só sites oficiais, por enquanto"),
  ).toBeInTheDocument();
});

test("destino só com links não oferece checklist e mostra os sites oficiais", () => {
  render(
    <DestinationPage
      destination={{
        code: "PT",
        slug: "portugal",
        name: "Portugal",
        coverageLevel: "LINKS_ONLY",
        sources: [
          source(),
          source({
            id: "s2",
            title: "Fonte fora do ar",
            status: "BROKEN",
            url: null,
          }),
        ],
      }}
    />,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Portugal" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/não montamos checklist/)).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Ver caminhos/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Vistos nacionais/ }),
  ).toHaveAttribute("href", "https://enterprise.gov.ie/en/");
  expect(
    screen.queryByRole("link", { name: /Fonte fora do ar/ }),
  ).not.toBeInTheDocument();
});

test("destino com páginas próprias leva aos caminhos revisados", () => {
  render(
    <DestinationPage
      destination={{
        code: "IE",
        slug: "ireland",
        name: "Irlanda",
        coverageLevel: "PARTIAL",
        sources: [],
      }}
    />,
  );
  expect(
    screen.getByRole("link", { name: "Ver caminhos para Irlanda" }),
  ).toHaveAttribute("href", "/ireland");
  expect(screen.getByText(/ainda estão em revisão/)).toBeInTheDocument();
});

test("lista os caminhos revisados agrupados por categoria", () => {
  render(
    <DestinationPage
      destination={{
        code: "IE",
        slug: "ireland",
        name: "Irlanda",
        coverageLevel: "PARTIAL",
        sources: [source()],
      }}
      visas={[
        {
          slug: "student-stamp-2",
          name: "Estudante (Stamp 2)",
          shortDescription: "Estudo em tempo integral.",
          category: "Estudo",
          href: "/destinos/ireland/student-stamp-2",
        },
      ]}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Caminhos revisados" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Ver requisitos de Estudante (Stamp 2)" }),
  ).toHaveAttribute("href", "/destinos/ireland/student-stamp-2");
});
