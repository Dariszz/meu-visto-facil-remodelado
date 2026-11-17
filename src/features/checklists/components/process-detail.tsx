import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";
import type { ChecklistItemStatus, ProcessDetailView } from "../types";
import type { ChecklistFilter } from "../filters";
import { ChecklistWorkspace } from "./checklist-workspace";
import {
  formatLongDate,
  processStatusPresentation,
} from "./status-presentation";

export function ProcessDetail({
  process,
  dashboardHref,
  initialFilter,
  onStatusChange,
}: {
  process: ProcessDetailView;
  dashboardHref: string;
  initialFilter?: ChecklistFilter;
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
        <header className="pt-2 pb-8">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {process.title}
          </h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="sr-only">Situação</dt>
              <dd
                className={cn(
                  "flex items-center gap-2 font-medium",
                  status.text,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", status.dot)}
                />
                {status.label}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Permissão</dt>
              <dd>
                {process.visaHref ? (
                  <Link
                    href={process.visaHref}
                    className="text-primary underline underline-offset-4"
                  >
                    {process.visaName}
                  </Link>
                ) : (
                  process.visaName
                )}
                <span className="text-muted-foreground">
                  , {process.countryName}
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Início</dt>
              <dd className="text-muted-foreground">
                Iniciado em {formatLongDate(process.startedAt)}
              </dd>
            </div>
          </dl>
        </header>

        <ChecklistWorkspace
          categories={process.categories}
          sources={process.sources}
          initialFilter={initialFilter}
          onStatusChange={onStatusChange}
        />

        <p className="mt-14 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Checklist organizado a partir de fontes oficiais consultadas em{" "}
          {formatLongDate(process.referenceDate)}. É informativo: não avalia
          elegibilidade nem garante aprovação. Confirme as condições com as
          autoridades oficiais antes de decidir.
        </p>
      </Container>
    </main>
  );
}
