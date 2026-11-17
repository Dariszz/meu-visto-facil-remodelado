import Link from "next/link";
import { CalendarDays, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";
import type { ChecklistItemStatus, ProcessDetailView } from "../types";
import { ChecklistWorkspace } from "./checklist-workspace";
import {
  formatLongDate,
  processStatusPresentation,
} from "./status-presentation";

export function ProcessDetail({
  process,
  dashboardHref,
  onStatusChange,
}: {
  process: ProcessDetailView;
  dashboardHref: string;
  // Deve ser uma Server Action: este componente roda no servidor.
  onStatusChange?: (itemId: string, status: ChecklistItemStatus) => void;
}) {
  const status = processStatusPresentation[process.status];
  return (
    <main id="main-content" tabIndex={-1}>
      <Container className="pb-section">
        <Breadcrumbs
          items={[
            { label: "Painel", href: dashboardHref },
            { label: process.title },
          ]}
        />
        <header className="border-b pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                status.tone,
              )}
            >
              {status.label}
            </span>
            <span className="text-sm text-muted-foreground">
              {process.countryName}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {process.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {process.visaHref ? (
              <Link
                href={process.visaHref}
                className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
              >
                {process.visaName}
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center">
                {process.visaName}
              </span>
            )}
            <span className="inline-flex min-h-11 items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4" />
              Iniciado em {formatLongDate(process.startedAt)}
            </span>
          </div>
        </header>

        <div className="mt-8">
          <ChecklistWorkspace
            categories={process.categories}
            sources={process.sources}
            onStatusChange={onStatusChange}
          />
        </div>

        <p className="mt-12 flex max-w-3xl gap-3 rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Checklist organizado a partir de fontes oficiais consultadas em{" "}
            {formatLongDate(process.referenceDate)}. É informativo, não avalia
            elegibilidade nem garante aprovação. Confirme as condições com as
            autoridades oficiais antes de tomar decisões.
          </span>
        </p>
      </Container>
    </main>
  );
}
