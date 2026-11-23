// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  catalogSourceFixtures,
  catalogVisaFixture,
} from "@/test/catalog-fixtures";
import { VisaDetailPage } from "./visa-detail-page";
import { dedicatedVisaRoute, visaPageHref } from "./visa-routes";

const visa = {
  ...catalogVisaFixture,
  officialName: "Official name",
  authorityName: "Autoridade oficial",
  steps: [
    {
      code: "registration",
      title: "Registrar a permissão",
      text: "Registro após a chegada.",
      sources: [
        { sourceId: "seed-source-ie-permit", relationType: "PRIMARY" as const },
      ],
    },
  ],
};

test("mostra requisitos, etapas, autoridade e fontes oficiais", () => {
  render(
    <VisaDetailPage
      visa={visa}
      sources={catalogSourceFixtures}
      signedIn={false}
      startAction={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: visa.name }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Autoridade oficial/)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Principais requisitos" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Registrar a permissão")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Entrar para criar meu checklist" }),
  ).toHaveAttribute(
    "href",
    `/login?next=${encodeURIComponent(`/destinos/${visa.country.slug}/${visa.slug}`)}`,
  );
});

test("com sessão, oferece criar o checklist", () => {
  render(
    <VisaDetailPage
      visa={visa}
      sources={catalogSourceFixtures}
      signedIn
      startAction={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("button", {
      name: `Criar meu checklist de ${visa.name}`,
    }),
  ).toBeInTheDocument();
});

test("rotas: Critical Skills mantém a página própria; demais usam a genérica", () => {
  expect(
    dedicatedVisaRoute("ireland", "critical-skills-employment-permit"),
  ).toBe("/ireland/visas/critical-skills-employment-permit");
  expect(visaPageHref("ireland", "student-stamp-2")).toBe(
    "/destinos/ireland/student-stamp-2",
  );
});
