// @vitest-environment jsdom
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Progress } from "./progress";
import { DialogExample } from "@/app/design-system/dialog-example";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";

test("botões comuns não submetem formulários e botões desabilitados não disparam ações", () => {
  const click = vi.fn();
  render(
    <form>
      <Button>Ação</Button>
      <Button disabled onClick={click}>
        Indisponível
      </Button>
      <Button type="submit">Enviar</Button>
    </form>,
  );
  expect(screen.getByRole("button", { name: "Ação" })).toHaveAttribute(
    "type",
    "button",
  );
  expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute(
    "type",
    "submit",
  );
  fireEvent.click(screen.getByRole("button", { name: "Indisponível" }));
  expect(click).not.toHaveBeenCalled();
});

test("campos preservam rótulos, erros associados e estado desabilitado", () => {
  render(
    <>
      <label htmlFor="name">Nome</label>
      <Input id="name" aria-invalid="true" aria-describedby="error" />
      <p id="error">Informe seu nome.</p>
      <label htmlFor="notes">Notas</label>
      <Textarea id="notes" disabled />
    </>,
  );
  expect(
    screen.getByRole("textbox", { name: "Nome" }),
  ).toHaveAccessibleDescription("Informe seu nome.");
  expect(screen.getByRole("textbox", { name: "Nome" })).toBeInvalid();
  expect(screen.getByRole("textbox", { name: "Notas" })).toBeDisabled();
});

test.each([
  [60, 100, 60],
  [150, 100, 100],
  [-10, 100, 0],
  [25, 50, 25],
])("progresso %s de %s mantém semântica válida", (value, max, expected) => {
  render(<Progress aria-label="Exemplo" value={value} max={max} />);
  const progress = screen.getByRole("progressbar", { name: "Exemplo" });
  expect(progress).toHaveAttribute("aria-valuenow", String(expected));
  expect(progress).toHaveAttribute("aria-valuemax", String(max));
  expect(progress.firstElementChild).toHaveStyle({
    transform: `translateX(-${100 - (expected / max) * 100}%)`,
  });
});

test("progresso desconhecido não anuncia uma porcentagem inventada", () => {
  render(<Progress aria-label="Carregando" value={null} />);
  expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
});

test("Dialog tem nome, descrição, fecha com Escape e devolve o foco", async () => {
  render(<DialogExample />);
  const trigger = screen.getByRole("button", {
    name: "Abrir exemplo de diálogo",
  });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Um passo de cada vez" });
  expect(dialog).toHaveAccessibleDescription(/Nenhuma informação será enviada/);
  expect(dialog.contains(document.activeElement)).toBe(true);
  fireEvent.keyDown(document.activeElement ?? dialog, { key: "Escape" });
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(trigger).toHaveFocus());
  fireEvent.click(trigger);
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Fechar",
    }),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});

test("Select tem nome acessível e respeita disabled", () => {
  render(
    <Select defaultValue="a" disabled>
      <SelectTrigger aria-label="Densidade">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Confortável</SelectItem>
      </SelectContent>
    </Select>,
  );
  expect(screen.getByRole("combobox", { name: "Densidade" })).toBeDisabled();
});
