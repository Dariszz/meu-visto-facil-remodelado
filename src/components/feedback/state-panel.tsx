import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Painéis de estado compartilhados (vazio e erro), para que telas privadas
// não precisem recriar o mesmo layout. Ações ficam a cargo de quem usa.
export function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
  headingLevel = 2,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-12 text-center sm:px-10",
        tone === "error" && "border-destructive/40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-full bg-secondary text-primary",
          tone === "error" && "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-6" strokeWidth={1.6} />
      </span>
      <Heading className="mt-5 text-lg font-semibold tracking-tight">
        {title}
      </Heading>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
      )}
    </div>
  );
}
