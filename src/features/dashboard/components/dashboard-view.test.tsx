// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { emptyDashboard, exampleDashboard } from "@/features/previews/fixtures";
import { DashboardView } from "./dashboard-view";

const links = {
  explore: "/ireland",
  questionnaire: "/questionario",
  recommendations: "/recomendacoes",
};

test("painel resume processos e permite continuar", () => {
  render(<DashboardView data={exampleDashboard} links={links} />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Olá, Marina" }),
  ).toBeInTheDocument();
  const stats = screen.getByText("Processos ativos").closest("dl")!;
  expect(within(stats).getByText("1")).toBeInTheDocument();
  expect(within(stats).getByText("3")).toBeInTheDocument();
  expect(within(stats).getByText("11")).toBeInTheDocument();
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
});

test("painel vazio orienta o primeiro passo", () => {
  render(<DashboardView data={emptyDashboard} links={links} />);
  expect(
    screen.getByRole("heading", { name: "Nenhum processo salvo" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Processos ativos")).not.toBeInTheDocument();
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
