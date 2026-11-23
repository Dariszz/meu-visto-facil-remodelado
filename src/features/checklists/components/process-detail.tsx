import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";
import type { ChecklistItemStatus, ProcessDetailView } from "../types";
import type { ChecklistFilter } from "../filters";
import { ActionNotice, type Notice } from "@/components/feedback/action-notice";
import { ChecklistWorkspace } from "./checklist-workspace";
import {
  PersonalItemForm,
  type PersonalItemFormState,
} from "./personal-item-form";
import {
  formatLongDate,
  processStatusPresentation,
} from "./status-presentation";

export function ProcessDetail({
  process,
  dashboardHref,
  initialFilter,
  onStatusChange,
  onDeletePersonal,
  addPersonalItem,
  setStatus,
  notice,
}: {
  process: ProcessDetailView;
  dashboardHref: string;
  initialFilter?: ChecklistFilter;
  // Deve ser uma Server Action: este componente roda no servidor.
  onStatusChange?: (
    itemId: string,
    status: ChecklistItemStatus,
  ) => Promise<boolean | void>;
  onDeletePersonal?: (itemId: string) => Promise<boolean>;
  addPersonalItem?: (
    state: PersonalItemFormState,
    form: FormData,
  ) => Promise<PersonalItemFormState>;
  // Server Action que recebe o campo "status" do formulário.
  setStatus?: (form: FormData) => Promise<void>;
  notice?: Notice;
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
              <dt className="sr-only">Visto</dt>
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

        {notice && (
          <ActionNotice
            notice={notice}
            dismissHref={`/processes/${process.id}`}
            className="mb-6"
          />
        )}

        {setStatus && (
          <ProcessStatusControls status={process.status} action={setStatus} />
        )}

        <ChecklistWorkspace
          // Remonta quando itens entram ou saem (ex.: item pessoal novo).
          key={process.categories
            .flatMap((category) => category.items.map((item) => item.id))
            .join(",")}
          categories={process.categories}
          sources={process.sources}
          initialFilter={initialFilter}
          onStatusChange={onStatusChange}
          onDeletePersonal={onDeletePersonal}
        />

        {addPersonalItem && <PersonalItemForm action={addPersonalItem} />}

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

const statusActions: Record<
  ProcessDetailView["status"],
  readonly { status: ProcessDetailView["status"]; label: string }[]
> = {
  ACTIVE: [
    { status: "PAUSED", label: "Pausar" },
    { status: "COMPLETED", label: "Marcar como concluído" },
  ],
  PAUSED: [{ status: "ACTIVE", label: "Retomar" }],
  COMPLETED: [{ status: "ACTIVE", label: "Reabrir" }],
  ARCHIVED: [],
};

function ProcessStatusControls({
  status,
  action,
}: {
  status: ProcessDetailView["status"];
  action: (form: FormData) => Promise<void>;
}) {
  return (
    <div className="-mt-4 mb-8 flex flex-wrap items-center gap-2">
      {statusActions[status].map((option) => (
        <form key={option.status} action={action}>
          <input type="hidden" name="status" value={option.status} />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {option.label}
          </button>
        </form>
      ))}
      <form action={action}>
        <input type="hidden" name="status" value="ARCHIVED" />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-md px-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Arquivar processo
        </button>
      </form>
    </div>
  );
}
