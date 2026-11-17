import type { ReactNode } from "react";

// Agrupa Skeletons sob um status com nome acessível, como pede o design system.
export function LoadingRegion({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-label={label} aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
