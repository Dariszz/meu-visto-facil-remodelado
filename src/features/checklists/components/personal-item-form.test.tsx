// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PersonalItemForm } from "./personal-item-form";

test("envia título, observação e etapa e mostra erros por campo", async () => {
  const action = vi.fn().mockResolvedValue({
    status: "error",
    message: "Revise os campos.",
    fieldErrors: { title: "Informe o item." },
  });
  render(<PersonalItemForm action={action} />);
  fireEvent.change(screen.getByLabelText("Item"), {
    target: { value: "Traduzir diploma" },
  });
  fireEvent.change(screen.getByLabelText("Etapa"), {
    target: { value: "APPLICATION" },
  });
  fireEvent.submit(
    screen
      .getByRole("button", { name: "Adicionar ao checklist" })
      .closest("form")!,
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Revise os campos.",
  );
  expect(screen.getByText("Informe o item.")).toBeInTheDocument();
  expect(screen.getByLabelText("Item")).toHaveAttribute("aria-invalid", "true");
  const form = action.mock.calls[0][1] as FormData;
  expect(form.get("title")).toBe("Traduzir diploma");
  expect(form.get("stage")).toBe("APPLICATION");
});
