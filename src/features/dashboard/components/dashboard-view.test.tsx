// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { emptyDashboard, exampleDashboard } from "@/features/previews/fixtures";
import { DashboardView } from "./dashboard-view";

const links = {
  explore: "/ireland",
  questionnaire: "/questionario",
  recommendations: "/recomendacoes",
};

test("painel resume processos em texto e permite continuar", () => {
  render(<DashboardView data={exampleDashboard} links={links} />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Olá, Marina" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Você tem 1 processo em andamento e 1 pausado. 3 itens concluídos, 11 em aberto.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: "2 de 8 itens concluídos, 1 em andamento",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: "Continuar Minha mudança com Critical Skills",
    }),
  ).toHaveAttribute("href", "/preview/processes/exemplo");
  expect(
    screen.getByRole("link", {
      name: "Abrir Plano alternativo: General Employment",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("Pausado")).toBeInTheDocument();
  expect(
    screen.getByText("Conferir ocupação e remuneração"),
  ).toBeInTheDocument();
});

test("painel vazio orienta o primeiro passo", () => {
  render(<DashboardView data={emptyDashboard} links={links} />);
  expect(
    screen.getByRole("heading", { name: "Nenhum processo salvo" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Responder questionário" }),
  ).toHaveAttribute("href", "/questionario");
  expect(
    screen.getByRole("link", { name: "Começar questionário" }),
  ).toBeInTheDocument();
});

test("processos arquivados não aparecem no painel", () => {
  render(
    <DashboardView
      data={{
        ...exampleDashboard,
        processes: exampleDashboard.processes.map((process) => ({
          ...process,
          status: "ARCHIVED" as const,
        })),
      }}
      links={links}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Nenhum processo salvo" }),
  ).toBeInTheDocument();
});

test("nome ausente usa saudação neutra", () => {
  render(
    <DashboardView
      data={{ ...emptyDashboard, displayName: null }}
      links={links}
    />,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Olá!" }),
  ).toBeInTheDocument();
});

test("sem processos e com questionário completo, não pede para responder de novo", () => {
  render(
    <DashboardView
      data={{ ...emptyDashboard, hasCompletedQuestionnaire: true }}
      links={links}
    />,
  );
  expect(screen.getByText(/Suas respostas estão salvas/)).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Responder questionário" }),
  ).toBeNull();
  expect(
    screen.getByRole("link", { name: "Ver recomendações" }),
  ).toHaveAttribute("href", "/recomendacoes");
});
