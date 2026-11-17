"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { setThemePreference, type ThemePreference } from "./theme";
import { useTheme } from "./use-theme";

const options: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

export function ThemeSelect() {
  const theme = useTheme();
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <legend className="float-left mr-1 text-muted-foreground">Tema</legend>
      <div className="inline-flex rounded-md border bg-background p-0.5">
        {options.map((option) => {
          const checked = theme?.preference === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "inline-flex min-h-10 cursor-pointer items-center rounded-[5px] px-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                checked
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => setThemePreference(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
