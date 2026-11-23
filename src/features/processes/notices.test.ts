import { expect, test } from "vitest";
import { dashboardNotice, processNotice } from "./notices";

test("só aceita avisos conhecidos e nunca reflete texto da URL", () => {
  expect(dashboardNotice("arquivado")).toMatchObject({ tone: "success" });
  expect(processNotice("pausado")?.message).toMatch(/pausado/);
  expect(processNotice("erro")).toMatchObject({ tone: "error" });
  for (const value of [
    "<script>",
    "toString",
    "__proto__",
    ["pausado"],
    undefined,
  ])
    expect(processNotice(value)).toBeUndefined();
  expect(dashboardNotice("pausado")).toBeUndefined();
});
