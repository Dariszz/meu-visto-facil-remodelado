import { expect, test } from "vitest";
import { loginHref, safeRedirectPath } from "./safe-redirect";

test("aceita caminhos internos", () => {
  expect(safeRedirectPath("/destinos/germany/cartao-azul-ue")).toBe(
    "/destinos/germany/cartao-azul-ue",
  );
  expect(safeRedirectPath("/processes?x=1")).toBe("/processes?x=1");
});

test.each([
  undefined,
  "",
  "https://evil.example",
  "//evil.example",
  "/\\evil.example",
  "javascript:alert(1)",
  "destinos",
  "/a\nb",
  `/${"a".repeat(400)}`,
])("rejeita destino inseguro %s", (value) => {
  expect(safeRedirectPath(value)).toBe("/dashboard");
});

test("monta o link de login com o retorno", () => {
  expect(loginHref("/destinos/italy/estudo")).toBe(
    "/login?next=%2Fdestinos%2Fitaly%2Festudo",
  );
});
