import { expect, test } from "vitest";
import { safeSourceLink } from "./safe-source-link";

test.each([
  "javascript:alert(1)",
  "data:text/html,test",
  "http://enterprise.gov.ie/",
  "https://enterprise.gov.ie.attacker.com/",
  "https://127.0.0.1/",
  "https://localhost/",
  "https://user:password@enterprise.gov.ie/",
  "https://enterprise.gov.ie:8443/",
  "invalid",
])("rejects unsafe stored link: %s", (value) => {
  expect(safeSourceLink(value, "enterprise.gov.ie")).toBeNull();
});
test("only approved exact hosts with consistent stored hostname become links", () => {
  expect(
    safeSourceLink("https://enterprise.gov.ie/example", "enterprise.gov.ie"),
  ).toBe("https://enterprise.gov.ie/example");
  expect(
    safeSourceLink(
      "https://www.irishimmigration.ie/example",
      "www.irishimmigration.ie",
    ),
  ).toBe("https://www.irishimmigration.ie/example");
  expect(
    safeSourceLink(
      "https://enterprise.gov.ie/example",
      "www.irishimmigration.ie",
    ),
  ).toBeNull();
});
