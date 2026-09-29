// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { catalogSourceFixtures } from "@/test/catalog-fixtures";
import { OfficialSourceItem } from "./official-source-item";

test("registered source exposes its identity without claiming a technical verification", () => {
  const source = catalogSourceFixtures[0];
  render(<OfficialSourceItem source={source} />);

  expect(screen.getByText(source.authority)).toBeInTheDocument();
  expect(screen.getByText(source.hostname)).toBeInTheDocument();
  expect(screen.getByText("Fonte cadastrada")).toBeInTheDocument();
  expect(screen.getByText("Não registrada")).toBeInTheDocument();
  expect(screen.getByText("Nenhuma registrada")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", source.url);
  expect(screen.getByText("10 de setembro de 2026")).toHaveAttribute(
    "datetime",
    "2026-09-10",
  );
});

test("editorial consultation, latest attempt and previous success remain distinct", () => {
  const source = {
    ...catalogSourceFixtures[0],
    lastVerifiedAt: "2026-09-20T18:45:12.123Z",
    lastSuccessfulVerificationAt: "2026-09-18T06:15:30.456Z",
  };
  const { container } = render(<OfficialSourceItem source={source} />);

  for (const [label, date] of [
    ["Consulta editorial", source.consultedAt],
    ["Última tentativa de verificação", source.lastVerifiedAt],
    ["Última verificação bem-sucedida", source.lastSuccessfulVerificationAt],
  ] as const) {
    const value = screen.getByText(label).nextElementSibling;
    expect(value?.querySelector("time")).toHaveAttribute("datetime", date);
  }
  expect(container.querySelectorAll("time")).toHaveLength(3);
});

test("an attempted verification never substitutes for a missing successful verification", () => {
  render(
    <OfficialSourceItem
      source={{
        ...catalogSourceFixtures[0],
        consultedAt: null,
        lastVerifiedAt: "2026-09-20T18:45:12.123Z",
      }}
    />,
  );
  expect(screen.getByText("Não informada")).toBeInTheDocument();
  expect(screen.getByText("Nenhuma registrada")).toBeInTheDocument();
  expect(screen.queryByText("Não registrada")).not.toBeInTheDocument();
});

test.each([
  ["TEMPORARILY_UNAVAILABLE", "Temporariamente indisponível"],
  ["BROKEN", "Link indisponível"],
] as const)(
  "%s keeps traceability while its link is unavailable",
  (status, label) => {
    const source = { ...catalogSourceFixtures[0], status };
    render(<OfficialSourceItem source={source} />);
    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    expect(screen.getByText(source.authority)).toBeInTheDocument();
    expect(screen.getByText(source.hostname)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  },
);

test.each([
  null,
  "javascript:alert(1)",
  "https://unapproved.enterprise.gov.ie/",
])(
  "a registered source with rejected URL %s retains metadata without a link",
  (url) => {
    render(
      <OfficialSourceItem source={{ ...catalogSourceFixtures[0], url }} />,
    );
    expect(screen.getByText("Fonte cadastrada")).toBeInTheDocument();
    expect(screen.getByText(/Link indisponível/)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  },
);
