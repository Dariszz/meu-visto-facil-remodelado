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
        "rounded-lg border-l-4 border-primary/50 bg-card px-6 py-7 sm:px-8",
        tone === "error" && "border-destructive",
        className,
      )}
    >
      <Heading className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-balance">
        <Icon
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0 text-primary",
            tone === "error" && "text-destructive",
          )}
          strokeWidth={1.8}
        />
        {title}
      </Heading>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5 flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}
