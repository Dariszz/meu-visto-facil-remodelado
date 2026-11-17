// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  parseThemePreference,
  resolveTheme,
  setThemePreference,
  THEME_STORAGE_KEY,
  themeInitScript,
} from "./theme";
import { ThemeSelect } from "./theme-select";
import { ThemeToggle } from "./theme-toggle";

let systemDark = false;
const listeners = new Set<() => void>();

beforeEach(() => {
  systemDark = false;
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return systemDark;
    },
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }));
  const meta = document.createElement("meta");
  meta.name = "theme-color";
  document.head.append(meta);
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  document.head.innerHTML = "";
  listeners.clear();
});

const root = () => document.documentElement.classList;

test("preferência inválida volta para o sistema", () => {
  expect(parseThemePreference("dark")).toBe("dark");
  expect(parseThemePreference("roxo")).toBe("system");
  expect(parseThemePreference(null)).toBe("system");
  expect(resolveTheme("system", true)).toBe("dark");
  expect(resolveTheme("light", true)).toBe("light");
});

test("script inicial aplica a preferência salva ou a do sistema", () => {
  systemDark = true;
  new Function(themeInitScript)();
  expect(root().contains("dark")).toBe(true);

  localStorage.setItem(THEME_STORAGE_KEY, "light");
  new Function(themeInitScript)();
  expect(root().contains("light")).toBe(true);
  expect(root().contains("dark")).toBe(false);
});

test("escolher tema salva, aplica a classe e a cor da barra", () => {
  setThemePreference("dark");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  expect(root().contains("dark")).toBe(true);
  expect(
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!
      .content,
  ).toBe("#152d34");

  setThemePreference("system");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  expect(root().contains("light")).toBe(true);
});

test("botão do cabeçalho alterna e o seletor do rodapé acompanha", () => {
  render(
    <>
      <ThemeToggle />
      <ThemeSelect />
    </>,
  );
  expect(screen.getByRole("radio", { name: "Sistema" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Usar tema escuro" }));
  expect(root().contains("dark")).toBe(true);
  expect(screen.getByRole("radio", { name: "Escuro" })).toBeChecked();
  expect(
    screen.getByRole("button", { name: "Usar tema claro" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("radio", { name: "Sistema" }));
  expect(root().contains("light")).toBe(true);
});

test("quem segue o sistema acompanha a mudança do sistema", () => {
  render(<ThemeToggle />);
  systemDark = true;
  act(() => listeners.forEach((listener) => listener()));
  expect(root().contains("dark")).toBe(true);
  expect(
    screen.getByRole("button", { name: "Usar tema claro" }),
  ).toBeInTheDocument();
});
