// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import HomePage, { metadata } from "@/app/page";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

test("comunica a proposta e distingue a prévia das funcionalidades futuras", () => {
  render(<HomePage />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Seu caminho para imigrar começa com informação clara.",
  );
  expect(screen.getByText(/Prévia conceitual/)).toBeInTheDocument();
  const ireland = screen.getByRole("region", { name: "Irlanda." });
  expect(
    within(ireland).getByText("Exploração disponível"),
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
      <Header />
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
        "/ireland",
        "/ireland/work",
        "/ireland/study",
        "/ireland/family",
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
  expect(
    screen.queryByRole("link", { name: /Privacidade|Termos|Login/ }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toHaveTextContent(
    "Não oferecemos aconselhamento jurídico",
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
