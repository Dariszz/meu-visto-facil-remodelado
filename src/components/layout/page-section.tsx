import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
export function PageSection({
  className,
  ...props
}: ComponentProps<"section">) {
  return <section className={cn("py-section", className)} {...props} />;
}
