// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { exampleProcess } from "@/features/previews/fixtures";
import { ChecklistWorkspace } from "./checklist-workspace";
import { ProcessDetail } from "./process-detail";

function setup(onStatusChange = vi.fn()) {
  render(
    <ChecklistWorkspace
      categories={exampleProcess.categories}
      sources={exampleProcess.sources}
      onStatusChange={onStatusChange}
    />,
  );
  return onStatusChange;
}

const summary = () =>
  screen.getByRole("complementary", { name: "Resumo do progresso" });

test("marcar item atualiza o progresso e notifica a mudança", () => {
  const onStatusChange = setup();
  expect(
    within(summary()).getByText("25%", { selector: "p" }),
  ).toBeInTheDocument();
  expect(
    within(summary()).getByText("2 de 8 itens concluídos"),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Reunir comprovantes de qualificação e experiência",
    }),
  );
  expect(
    within(summary()).getByText("37%", { selector: "p" }),
  ).toBeInTheDocument();
  expect(onStatusChange).toHaveBeenCalledWith("qualifications", "COMPLETED");
});

test("próximo passo aponta para o obrigatório em andamento", () => {
  setup();
  expect(
    within(summary()).getByText("Conferir ocupação e remuneração"),
  ).toBeInTheDocument();
  expect(
    within(summary()).getByRole("link", { name: /Ir para o item/ }),
  ).toHaveAttribute("href", "#item-occupation");
});

test("filtro mostra só itens concluídos", () => {
  setup();
  fireEvent.click(screen.getByRole("radio", { name: "Concluídos" }));
  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  expect(
    within(screen.getByRole("region", { name: "Entrada no país" })).getByText(
      "Nenhum item neste filtro.",
    ),
  ).toBeInTheDocument();
});

test("somente itens não obrigatórios podem ser marcados como não aplicáveis", () => {
  const onStatusChange = setup();
  expect(
    screen.queryAllByRole("button", { name: "Não se aplica", hidden: true }),
  ).toHaveLength(0);
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "Separar os documentos em uma pasta",
    }),
  );
  const personalItem = screen
    .getByRole("checkbox", { name: "Separar os documentos em uma pasta" })
    .closest("li")!;
  fireEvent.click(
    within(personalItem).getByRole("button", {
      name: "Não se aplica",
      hidden: true,
    }),
  );
  expect(onStatusChange).toHaveBeenLastCalledWith("folder", "NOT_APPLICABLE");
  expect(
    screen.getByRole("checkbox", {
      name: "Separar os documentos em uma pasta",
    }),
  ).toBeDisabled();
  // O item sai da base: 1 concluído de 7 aplicáveis.
  expect(
    within(summary()).getByText("14%", { selector: "p" }),
  ).toBeInTheDocument();
});

test("processo mostra cabeçalho, link do visto e aviso informativo", () => {
  render(<ProcessDetail process={exampleProcess} dashboardHref="/painel" />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Minha mudança com Critical Skills",
    }),
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
