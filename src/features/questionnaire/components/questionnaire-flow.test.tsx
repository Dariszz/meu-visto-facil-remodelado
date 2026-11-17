// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { exampleQuestions } from "@/features/previews/fixtures";
import { QuestionnaireFlow } from "./questionnaire-flow";

function setup() {
  render(
    <QuestionnaireFlow questions={exampleQuestions} resultHref="/resultado" />,
  );
  return { click: (element: HTMLElement) => fireEvent.click(element) };
}

const continueButton = () => screen.getByRole("button", { name: /Continuar/ });

test("pergunta obrigatória sem resposta mostra erro e não avança", () => {
  const user = setup();
  expect(screen.getByText("Pergunta 1 de 7")).toBeInTheDocument();
  user.click(continueButton());
  expect(document.getElementById("objective-error")).toHaveTextContent(
    "Escolha uma opção para continuar.",
  );
  expect(
    screen.getByRole("heading", {
      name: "Qual é o seu principal objetivo na Irlanda?",
    }),
  ).toBeInTheDocument();
});

test("respostas abrem perguntas condicionais e chegam à revisão", () => {
  const user = setup();
  user.click(screen.getByRole("radio", { name: /Trabalhar/ }));
  expect(screen.getByText("Pergunta 1 de 6")).toBeInTheDocument();
  user.click(continueButton());
  user.click(screen.getByRole("radio", { name: /Outro país/ }));
  user.click(continueButton());
  expect(
    screen.getByRole("heading", {
      name: "Você já tem uma oferta de emprego na Irlanda?",
    }),
  ).toHaveFocus();
  user.click(screen.getByRole("radio", { name: "Sim" }));
  user.click(continueButton());
  expect(
    screen.getByRole("heading", {
      name: "Qual é a duração prevista da oferta?",
    }),
  ).toBeInTheDocument();
  user.click(screen.getByRole("radio", { name: "Dois anos ou mais" }));
  user.click(continueButton());
  user.click(screen.getByRole("radio", { name: "Tecnologia" }));
  user.click(continueButton());
  // Formação é opcional: o botão vira "Pular".
  user.click(screen.getByRole("button", { name: /Pular/ }));

  const review = screen.getByRole("heading", {
    name: "Confira suas respostas",
  });
  expect(review).toHaveFocus();
  const list = review.parentElement!.querySelector("dl")!;
  expect(within(list).getByText("Trabalhar")).toBeInTheDocument();
  expect(within(list).getByText("Sem resposta")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Ver caminhos possíveis/ }),
  ).toHaveAttribute("href", "/resultado");
});

test("alterar resposta na revisão volta para a pergunta", () => {
  const user = setup();
  user.click(screen.getByRole("radio", { name: /Estudar/ }));
  user.click(continueButton());
  user.click(screen.getByRole("radio", { name: /Reino Unido/ }));
  user.click(continueButton());
  user.click(screen.getByRole("button", { name: /Pular/ }));
  user.click(
    screen.getByRole("button", {
      name: "Alterar resposta: De onde é o seu passaporte?",
    }),
  );
  expect(screen.getByRole("radio", { name: /Reino Unido/ })).toBeChecked();
});

test("modo de salvar envia só as respostas visíveis", () => {
  const action = vi.fn(async (state: { status: "idle" | "error" }) => state);
  render(
    <QuestionnaireFlow
      questions={exampleQuestions}
      initialAnswers={{
        objective: "study",
        region: "uk",
        has_employment_offer: true,
      }}
      submitAction={action}
    />,
  );
  for (let i = 0; i < 3; i += 1)
    fireEvent.click(screen.getByRole("button", { name: /Continuar|Pular/ }));
  expect(
    screen.getByRole("button", { name: "Salvar respostas" }),
  ).toBeInTheDocument();
  const hidden = document.querySelector<HTMLInputElement>(
    'input[name="answers"]',
  )!;
  expect(JSON.parse(hidden.value)).toEqual({
    objective: "study",
    region: "uk",
  });
});
