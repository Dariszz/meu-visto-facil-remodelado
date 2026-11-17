"use client";

import { Moon, Sun } from "lucide-react";
import { setThemePreference } from "./theme";
import { useTheme } from "./use-theme";

// Botão rápido do cabeçalho: alterna entre claro e escuro explícitos.
// "Seguir o sistema" fica disponível no rodapé (ThemeSelect).
export function ThemeToggle() {
  const theme = useTheme();
  const isDark = theme?.resolved === "dark";
  const label = isDark ? "Usar tema claro" : "Usar tema escuro";
  return (
    <button
      type="button"
      onClick={() => setThemePreference(isDark ? "light" : "dark")}
      aria-label={theme ? label : "Alternar tema"}
      title={theme ? label : undefined}
      className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-5" />
      ) : (
        <Moon aria-hidden="true" className="size-5" />
      )}
    </button>
  );
}
