// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { exampleProcess } from "@/features/previews/fixtures";
import { ChecklistWorkspace } from "./checklist-workspace";
import { ProcessDetail } from "./process-detail";

afterEach(() => window.history.replaceState(null, "", "/"));

function setup(onStatusChange = vi.fn(), initialFilter?: "concluidos") {
  render(
    <ChecklistWorkspace
      categories={exampleProcess.categories}
      sources={exampleProcess.sources}
      initialFilter={initialFilter}
      onStatusChange={onStatusChange}
    />,
  );
  return onStatusChange;
}

const summary = () =>
  screen.getByRole("region", { name: "Progresso do processo" });

test("marcar item atualiza a régua e notifica a mudança", () => {
  const onStatusChange = setup();
  expect(summary()).toHaveTextContent(
    "2 de 8 itens concluídos, 1 em andamento (25%)",
  );
  expect(
    within(summary()).getByRole("img", {
      name: "Requisitos: 1 de 4 itens concluídos, 1 em andamento",
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Reunir comprovantes de qualificação e experiência",
    }),
  );
  expect(summary()).toHaveTextContent("3 de 8 itens concluídos");
  expect(summary()).toHaveTextContent("(37%)");
  expect(onStatusChange).toHaveBeenCalledWith("qualifications", "COMPLETED");
});

test("próximo passo aponta para o obrigatório em andamento", () => {
  setup();
  expect(
    within(summary()).getByRole("link", {
      name: "Próximo passo: Conferir ocupação e remuneração",
    }),
  ).toHaveAttribute("href", "#item-occupation");
});

test("filtro mostra só concluídos e fica registrado na URL", () => {
  setup();
  fireEvent.click(screen.getByRole("radio", { name: "Concluídos" }));
  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  expect(window.location.search).toBe("?filtro=concluidos");
  expect(
    within(screen.getByRole("region", { name: "Entrada no país" })).getByText(
      "Nenhum item neste filtro.",
    ),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("radio", { name: "Todos" }));
  expect(window.location.search).toBe("");
});

test("filtro inicial vem da página", () => {
  setup(vi.fn(), "concluidos");
  expect(screen.getByRole("radio", { name: "Concluídos" })).toBeChecked();
  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
});

test("somente itens não obrigatórios podem ser marcados como não aplicáveis", () => {
  const onStatusChange = setup();
  expect(
    screen.queryAllByRole("button", { name: "Não se aplica", hidden: true }),
  ).toHaveLength(0);
  const name = "Separar os documentos em uma pasta";
  fireEvent.click(screen.getByRole("checkbox", { name }));
  const personalItem = screen.getByRole("checkbox", { name }).closest("li")!;
  expect(personalItem).toHaveTextContent("Item pessoal");
  fireEvent.click(
    within(personalItem).getByRole("button", {
      name: "Não se aplica",
      hidden: true,
    }),
  );
  expect(onStatusChange).toHaveBeenLastCalledWith("folder", "NOT_APPLICABLE");
  expect(screen.getByRole("checkbox", { name })).toBeDisabled();
  // O item sai da base: 1 concluído de 7 aplicáveis.
  expect(summary()).toHaveTextContent("1 de 7 itens concluídos");
});

test("processo mostra cabeçalho, situação, link do visto e aviso", () => {
  render(<ProcessDetail process={exampleProcess} dashboardHref="/painel" />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Minha mudança com Critical Skills",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Em andamento", { selector: "dd" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Critical Skills Employment Permit" }),
  ).toHaveAttribute("href", "/ireland/visas/critical-skills-employment-permit");
  expect(screen.getByRole("link", { name: "Painel" })).toHaveAttribute(
    "href",
    "/painel",
  );
  expect(screen.getByText(/não avalia elegibilidade/)).toBeInTheDocument();
});

test("falha ao salvar desfaz a mudança e avisa", async () => {
  setup(vi.fn().mockResolvedValue(false));
  const checkbox = screen.getByRole("checkbox", {
    name: "Reunir comprovantes de qualificação e experiência",
  });
  fireEvent.click(checkbox);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Não foi possível salvar a última mudança",
  );
  expect(checkbox).not.toBeChecked();
  expect(summary()).toHaveTextContent("2 de 8 itens concluídos");
});
