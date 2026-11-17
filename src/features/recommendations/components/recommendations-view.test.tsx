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
      profileFacts={exampleProfileFacts}
      recommendations={exampleRecommendations}
      pendingCategories={["Estudo", "Família"]}
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
      name: "Iniciar processo de Critical Skills Employment Permit",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Detalhes em breve" }),
  ).toBeDisabled();
  expect(screen.getByText(/Estudo e Família ainda não/)).toBeInTheDocument();
  const profile = screen.getByRole("complementary", { name: "Seu perfil" });
  expect(within(profile).getByText("Tecnologia")).toBeInTheDocument();
});

test("impedimento aparece destacado e sem opção de iniciar processo", () => {
  render(
    <RecommendationsView
      countryName="Irlanda"
      profileFacts={exampleProfileFactsNoOffer}
      recommendations={exampleRecommendationsNoOffer}
      pendingCategories={[]}
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
});

test("sem resultados mostra estado vazio com saídas", () => {
  render(
    <RecommendationsView
      countryName="Irlanda"
      profileFacts={[]}
      recommendations={[]}
      pendingCategories={[]}
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
