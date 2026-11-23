// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  exampleProfileFacts,
  exampleProfileFactsNoOffer,
  exampleRecommendations,
  exampleRecommendationsNoOffer,
} from "@/features/previews/fixtures";
import { RecommendationsView } from "./recommendations-view";

const links = {
  dashboard: "/painel",
  questionnaire: "/questionario",
  explore: "/ireland",
};

test("caminhos aparecem do mais ao menos compatível", () => {
  render(
    <RecommendationsView
      countryName="Irlanda"
      inName="na Irlanda"
      profileFacts={exampleProfileFacts}
      recommendations={exampleRecommendations}
      links={links}
    />,
  );
  const headings = screen
    .getAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
  expect(headings.slice(0, 2)).toEqual([
    "Critical Skills Employment Permit",
    "General Employment Permit",
  ]);
  expect(screen.getByText("Alta compatibilidade")).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: "Abrir processo de Critical Skills Employment Permit",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Página de detalhes em preparação"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: "Ver detalhes de Critical Skills Employment Permit",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Caminhos possíveis na Irlanda" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Ver todos os vistos" }),
  ).toHaveAttribute("href", "/ireland");
  const profile = screen.getByRole("complementary", { name: "Seu perfil" });
  expect(within(profile).getByText("Tecnologia")).toBeInTheDocument();
});

test("impedimento aparece destacado e sem opção de iniciar processo", () => {
  render(
    <RecommendationsView
      countryName="Irlanda"
      inName="na Irlanda"
      profileFacts={exampleProfileFactsNoOffer}
      recommendations={exampleRecommendationsNoOffer}
      links={links}
    />,
  );
  expect(screen.getByText("Baixa compatibilidade")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Possíveis impedimentos" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Iniciar processo/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Iniciar processo/ }),
  ).not.toBeInTheDocument();
});

test("caminho pronto oferece criar o processo pelo servidor", () => {
  const start = async () => ({ status: "idle" as const });
  render(
    <RecommendationsView
      countryName="Irlanda"
      inName="na Irlanda"
      profileFacts={exampleProfileFacts}
      recommendations={[
        {
          ...exampleRecommendations.find(
            (r) => r.visaSlug === "critical-skills-employment-permit",
          )!,
          process: { kind: "START" },
        },
      ]}
      links={links}
      startAction={start}
    />,
  );
  const button = screen.getByRole("button", {
    name: "Iniciar processo de Critical Skills Employment Permit",
  });
  const form = button.closest("form")!;
  expect(
    form.querySelector('input[name="visaSlug"]')?.getAttribute("value"),
  ).toBe("critical-skills-employment-permit");
});

test("sem resultados mostra estado vazio com saídas", () => {
  render(
    <RecommendationsView
      countryName="Irlanda"
      inName="na Irlanda"
      profileFacts={[]}
      recommendations={[]}
      links={links}
    />,
  );
  expect(
    screen.getByRole("heading", {
      name: "Nenhum caminho encontrado por enquanto",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Explorar catálogo" }),
  ).toHaveAttribute("href", "/ireland");
});
