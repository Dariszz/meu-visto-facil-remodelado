"use client";

import { useSyncExternalStore } from "react";
import {
  readThemePreference,
  resolveTheme,
  systemPrefersDark,
  THEME_CHANGE_EVENT,
  type ResolvedTheme,
  type ThemePreference,
} from "./theme";

type ThemeSnapshot = `${ThemePreference}:${ResolvedTheme}`;

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    // Quem segue o sistema acompanha a mudança sem recarregar.
    if (readThemePreference() === "system") {
      const resolved = resolveTheme("system", media.matches);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.classList.toggle("light", resolved === "light");
    }
    onChange();
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  media.addEventListener("change", handleSystemChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    media.removeEventListener("change", handleSystemChange);
  };
}

function getSnapshot(): ThemeSnapshot {
  const preference = readThemePreference();
  return `${preference}:${resolveTheme(preference, systemPrefersDark())}`;
}

// No servidor o tema é desconhecido: os controles renderizam neutros e se
// ajustam após a hidratação, sem divergência de HTML.
export function useTheme(): {
  preference: ThemePreference;
  resolved: ResolvedTheme;
} | null {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => null);
  if (!snapshot) return null;
  const [preference, resolved] = snapshot.split(":") as [
    ThemePreference,
    ResolvedTheme,
  ];
  return { preference, resolved };
}
