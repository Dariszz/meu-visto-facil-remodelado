// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  catalogSourceFixtures,
  catalogVisaFixture,
} from "@/test/catalog-fixtures";
import { findPublicCountry } from "@/lib/db/repositories/country-repository";
import {
  findPublicVisa,
  listPublicVisas,
} from "@/lib/db/repositories/visa-repository";
import { listPublicVisaSources } from "@/lib/db/repositories/official-source-repository";
import {
  CategoryCatalogPage,
  CriticalSkillsCatalogPage,
  IrelandCatalogPage,
} from "./catalog-pages";
import { CriticalSkillsPage } from "./critical-skills-page";
import { presentCriticalSkills } from "./catalog-presentation";
import CatalogError from "@/app/ireland/error";
import CatalogNotFound from "@/app/ireland/not-found";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({
  connection: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
vi.mock("@/lib/db/repositories/country-repository", () => ({
  findPublicCountry: vi.fn(),
}));
vi.mock("@/lib/db/repositories/visa-repository", () => ({
  findPublicVisa: vi.fn(),
  listPublicVisas: vi.fn(),
}));
vi.mock("@/lib/db/repositories/official-source-repository", () => ({
  listPublicVisaSources: vi.fn(),
}));

test("async server composition renders the returned contract, without local facts overriding it", async () => {
  vi.mocked(findPublicVisa).mockResolvedValue({
    ...catalogVisaFixture,
    name: "Nome retornado pelo catálogo",
    description: "Descrição retornada",
    requirements: [
      {
        code: "fresh",
        title: "Requisito retornado",
        text: "Condição retornada",
        sources: [],
      },
    ],
  });
  vi.mocked(listPublicVisaSources).mockResolvedValue([]);
  render(await CriticalSkillsCatalogPage());
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Nome retornado pelo catálogo",
  );
  expect(screen.getByText("Condição retornada")).toBeInTheDocument();
  expect(
    screen.queryByText(/Oferta por pelo menos dois anos/),
  ).not.toBeInTheDocument();
  expect(screen.getByText("Fontes em atualização.")).toBeInTheDocument();
});

test("absent or unpublished records produce not-found, infrastructure failures stay errors", async () => {
  vi.mocked(findPublicCountry).mockResolvedValue(null);
  await expect(IrelandCatalogPage()).rejects.toThrow("NOT_FOUND");
  await expect(CategoryCatalogPage({ slug: "study" })).rejects.toThrow(
    "NOT_FOUND",
  );
  vi.mocked(findPublicVisa).mockResolvedValue(null);
  await expect(CriticalSkillsCatalogPage()).rejects.toThrow("NOT_FOUND");
  vi.mocked(findPublicVisa).mockRejectedValue(new Error("CATALOG_UNAVAILABLE"));
  await expect(CriticalSkillsCatalogPage()).rejects.toThrow(
    "CATALOG_UNAVAILABLE",
  );
});

test("empty published work catalog does not expose Critical Skills from local data", async () => {
  vi.mocked(findPublicCountry).mockResolvedValue(catalogVisaFixture.country);
  vi.mocked(listPublicVisas).mockResolvedValue([]);
  render(await CategoryCatalogPage({ slug: "work" }));
  expect(
    screen.queryByText("Critical Skills Employment Permit"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /General Employment/ }),
  ).toBeDisabled();
});

test("sources without safe links and empty requirements have usable states", () => {
  render(
    <CriticalSkillsPage
      visa={presentCriticalSkills(
        { ...catalogVisaFixture, requirements: [] },
        catalogSourceFixtures.map((source) => ({
          ...source,
          url: null,
          status: "BROKEN",
        })),
      )}
    />,
  );
  expect(screen.getByText(/Requisitos em atualização/)).toBeInTheDocument();
  expect(screen.getAllByText(/Link indisponível/)).toHaveLength(3);
  expect(
    screen
      .queryAllByRole("link")
      .some((link) => link.getAttribute("href")?.startsWith("https:")),
  ).toBe(false);
});

test("error UI hides details and allows retry", () => {
  const reset = vi.fn();
  render(
    <CatalogError
      error={new Error("postgresql://secret@internal")}
      reset={reset}
    />,
  );
  expect(screen.queryByText(/secret/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(reset).toHaveBeenCalledOnce();
});

test("not-found provides a route out of an unavailable country", () => {
  render(<CatalogNotFound />);
  expect(
    screen.getByRole("link", { name: "Voltar ao início" }),
  ).toHaveAttribute("href", "/");
});
