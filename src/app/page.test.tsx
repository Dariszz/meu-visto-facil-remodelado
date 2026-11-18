// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import HomePage, { metadata } from "@/app/page";
import { HeaderView } from "@/components/layout/header-view";
import { Footer } from "@/components/layout/footer";

test("comunica a proposta e distingue a prévia das funcionalidades futuras", () => {
  render(<HomePage />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Seu caminho para imigrar começa com informação clara.",
  );
  expect(screen.getByText(/Prévia conceitual/)).toBeInTheDocument();
  const ireland = screen.getByRole("region", {
    name: "Irlanda, o primeiro destino",
  });
  expect(
    within(ireland).getByText("Apresentações iniciais"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: /Você merece saber/ }),
  ).toHaveTextContent("catálogo de fontes ainda está em preparação");
  expect(
    screen.getByRole("region", { name: /Personalizado para você/ }),
  ).toHaveTextContent(
    "não terá liberdade para inventar URLs ou requisitos legais",
  );
});

test("oferece navegação e CTAs com destinos existentes, sem rotas futuras quebradas", () => {
  render(
    <>
      <HeaderView signedIn={false} />
      <HomePage />
      <Footer />
    </>,
  );
  expect(
    screen.getAllByRole("link", { name: "Explorar Irlanda" }),
  ).toHaveLength(3);
  for (const link of screen.getAllByRole("link")) {
    const href = link.getAttribute("href")!;
    expect(
      [
        "/",
        "/login",
        "/destinos",
        "/ireland",
        "/ireland/work",
        "/ireland/study",
        "/ireland/family",
        "/privacidade",
        "/termos",
      ].includes(href) || /^\/?#.+/.test(href),
    ).toBe(true);
    if (href.includes("#"))
      expect(document.getElementById(href.split("#")[1])).not.toBeNull();
    expect(link).toHaveAccessibleName();
  }
  for (const link of screen.getAllByRole("link", {
    name: "Explorar Irlanda",
  })) {
    expect(link).toHaveAttribute("href", "/ireland");
  }
  expect(screen.getByRole("link", { name: "Privacidade" })).toHaveAttribute(
    "href",
    "/privacidade",
  );
  expect(screen.getByRole("link", { name: "Termos" })).toHaveAttribute(
    "href",
    "/termos",
  );
  expect(screen.getByRole("contentinfo")).toHaveTextContent(
    "não substitui assessoria oficial",
  );
  expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
});

test("define metadata básica da apresentação pública", () => {
  expect(metadata.title).toContain("Meu Visto Fácil");
  expect(metadata.description).toContain("Irlanda");
  expect(metadata.openGraph).toMatchObject({
    locale: "pt_BR",
    type: "website",
  });
});

test("cabeçalho leva ao painel quando há sessão", () => {
  render(<HeaderView signedIn />);
  expect(screen.getByRole("link", { name: "Meu painel" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
  expect(screen.queryByRole("link", { name: "Entrar" })).toBeNull();
});
