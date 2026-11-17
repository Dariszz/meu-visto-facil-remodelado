// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { metadata as layoutMetadata } from "./layout";
import PreviewLayout from "./layout";
import PreviewIndexPage from "./page";
import DashboardPreviewPage from "./dashboard/page";
import RecommendationsPreviewPage from "./recommendations/page";
import StatesPreviewPage from "./estados/page";

test("prévias não são indexadas e avisam que os dados são de exemplo", () => {
  expect(layoutMetadata.robots).toEqual({ index: false, follow: false });
  render(
    <PreviewLayout>
      <p>conteúdo</p>
    </PreviewLayout>,
  );
  expect(screen.getByText(/dados de exemplo/)).toBeInTheDocument();
});

test("índice lista as cinco prévias", () => {
  render(<PreviewIndexPage />);
  expect(screen.getAllByRole("link", { name: /Abrir prévia/ })).toHaveLength(5);
});

test("painel e recomendações respeitam as variações por parâmetro", async () => {
  render(
    await DashboardPreviewPage({
      searchParams: Promise.resolve({ estado: "vazio" }),
    }),
  );
  expect(
    screen.getByRole("heading", { name: "Nenhum processo salvo" }),
  ).toBeInTheDocument();

  render(
    await RecommendationsPreviewPage({
      searchParams: Promise.resolve({ cenario: "sem-oferta" }),
    }),
  );
  expect(screen.getByText("Baixa compatibilidade")).toBeInTheDocument();
});

test("estados anunciam carregamento e erro", () => {
  render(<StatesPreviewPage />);
  expect(screen.getAllByRole("status")).toHaveLength(3);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar seus processos",
  );
});
