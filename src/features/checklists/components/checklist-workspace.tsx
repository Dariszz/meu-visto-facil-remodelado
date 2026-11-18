"use client";

import { useId, useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { calculateChecklistProgress, findNextChecklistItem } from "../progress";
import type {
  ChecklistCategoryView,
  ChecklistItemStatus,
  ChecklistItemView,
  ChecklistSourceRef,
} from "../types";
import {
  checklistFilters,
  type ChecklistFilter,
  filterLabels,
  matchesFilter,
} from "../filters";
import { describeProgress, ItemStrip } from "./item-strip";
import { itemStatusPresentation } from "./status-presentation";

export function ChecklistWorkspace({
  categories: initialCategories,
  sources,
  initialFilter = "todos",
  onStatusChange,
}: {
  categories: readonly ChecklistCategoryView[];
  sources: readonly ChecklistSourceRef[];
  initialFilter?: ChecklistFilter;
  // Ponto de integração da Fase 23: persistir a mudança no servidor.
  onStatusChange?: (itemId: string, status: ChecklistItemStatus) => void;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [filter, setFilter] = useState<ChecklistFilter>(initialFilter);
  const filterName = useId();

  const allItems = useMemo(
    () => categories.flatMap((category) => category.items),
    [categories],
  );
  const progress = calculateChecklistProgress(allItems);
  const nextItem = findNextChecklistItem(allItems);
  const sourcesById = new Map(sources.map((source) => [source.id, source]));

  function setStatus(itemId: string, status: ChecklistItemStatus) {
    setCategories((current) =>
      current.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.id === itemId ? { ...item, status } : item,
        ),
      })),
    );
    onStatusChange?.(itemId, status);
  }

  function changeFilter(value: ChecklistFilter) {
    setFilter(value);
    // Mantém o filtro na URL (compartilhável e preservado ao recarregar)
    // sem disparar nova renderização no servidor.
    const url = new URL(window.location.href);
    if (value === "todos") url.searchParams.delete("filtro");
    else url.searchParams.set("filtro", value);
    window.history.replaceState(null, "", url);
  }

  return (
    <div>
      <section aria-label="Progresso do processo" className="border-b pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="text-lg tabular-nums" aria-live="polite">
            <span className="font-semibold">
              {describeProgress(allItems.map((item) => item.status))}
            </span>{" "}
            <span className="text-muted-foreground">({progress.percent}%)</span>
          </p>
          {nextItem ? (
            <a
              href={`#item-${nextItem.id}`}
              className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
            >
              Próximo passo: {nextItem.title}
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              Todos os itens aplicáveis foram concluídos.
            </p>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="min-w-0"
              style={{ flexGrow: category.items.length, flexBasis: 0 }}
            >
              <ItemStrip
                size="lg"
                statuses={category.items.map((item) => item.status)}
                label={`${category.title}: ${describeProgress(
                  category.items.map((item) => item.status),
                )}`}
              />
              <p
                aria-hidden="true"
                className="mt-2 hidden text-xs leading-snug break-words hyphens-auto text-muted-foreground sm:block"
              >
                {category.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <fieldset className="inline-flex rounded-md border bg-card p-1">
            <legend className="sr-only">Filtrar itens do checklist</legend>
            {checklistFilters.map((option) => (
              <label
                key={option}
                className={cn(
                  "inline-flex min-h-10 cursor-pointer items-center rounded-[5px] px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                  filter === option
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name={filterName}
                  value={option}
                  checked={filter === option}
                  onChange={() => changeFilter(option)}
                  className="sr-only"
                />
                {filterLabels[option]}
              </label>
            ))}
          </fieldset>

          <div className="mt-8 space-y-10">
            {categories.map((category) => {
              const visible = category.items.filter((item) =>
                matchesFilter(item, filter),
              );
              const categoryProgress = calculateChecklistProgress(
                category.items,
              );
              return (
                <section
                  key={category.id}
                  aria-labelledby={`category-${category.id}`}
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-foreground/15 pb-2">
                    <h2
                      id={`category-${category.id}`}
                      className="text-lg font-semibold tracking-tight text-balance"
                    >
                      {category.title}
                    </h2>
                    <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
                      {categoryProgress.completed}/{categoryProgress.applicable}
                    </p>
                  </div>
                  {visible.length ? (
                    <ul className="divide-y">
                      {visible.map((item) => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          sources={item.sourceIds.flatMap((id) => {
                            const source = sourcesById.get(id);
                            return source ? [source] : [];
                          })}
                          onStatusChange={setStatus}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="py-5 text-sm text-muted-foreground">
                      Nenhum item neste filtro.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <aside
          aria-label="Fontes oficiais"
          className="border-t border-foreground/15 pt-4 lg:sticky lg:top-6"
        >
          <h2 className="text-sm font-semibold">Fontes oficiais usadas</h2>
          <ul className="mt-4 space-y-5 text-sm">
            {sources.map((source) => (
              <li key={source.id}>
                <p className="font-medium leading-snug">{source.title}</p>
                <p className="mt-1 text-muted-foreground">{source.authority}</p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {source.hostname}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function ChecklistItemRow({
  item,
  sources,
  onStatusChange,
}: {
  item: ChecklistItemView;
  sources: readonly ChecklistSourceRef[];
  onStatusChange: (itemId: string, status: ChecklistItemStatus) => void;
}) {
  const checkboxId = `check-${item.id}`;
  const done = item.status === "COMPLETED";
  const notApplicable = item.status === "NOT_APPLICABLE";
  const status = itemStatusPresentation[item.status];

  return (
    <li id={`item-${item.id}`} className="scroll-mt-6 py-4">
      <div className="flex gap-4">
        <input
          id={checkboxId}
          type="checkbox"
          checked={done}
          disabled={notApplicable}
          onChange={(event) =>
            onStatusChange(
              item.id,
              event.target.checked ? "COMPLETED" : "PENDING",
            )
          }
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
        />
        <div className="min-w-0 flex-1">
          <label
            htmlFor={checkboxId}
            className={cn(
              "block cursor-pointer font-medium leading-snug",
              (done || notApplicable) && "text-muted-foreground line-through",
            )}
          >
            {item.title}
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.isMandatory
              ? "Obrigatório"
              : item.isOfficial
                ? "Recomendado"
                : "Item pessoal"}
            {item.status === "IN_PROGRESS" || notApplicable ? (
              <span className={cn("ml-3 font-medium", status.text)}>
                {status.label}
              </span>
            ) : null}
          </p>
          <details className="group mt-1">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
              <ListChecks aria-hidden="true" className="size-4" />
              <span className="group-open:hidden">Ver detalhes</span>
              <span className="hidden group-open:inline">Ocultar detalhes</span>
              <span className="sr-only"> de {item.title}</span>
            </summary>
            <div className="mb-2 space-y-3 border-l-2 border-primary/30 pl-4 text-sm">
              <p className="leading-relaxed">{item.description}</p>
              {sources.length > 0 && (
                <p className="text-muted-foreground">
                  Fonte: {sources.map((source) => source.authority).join("; ")}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {item.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(item.id, "IN_PROGRESS")}
                  >
                    Marcar em andamento
                  </Button>
                )}
                {(item.status === "IN_PROGRESS" || notApplicable) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(item.id, "PENDING")}
                  >
                    Voltar para pendente
                  </Button>
                )}
                {!item.isMandatory && !notApplicable && !done && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStatusChange(item.id, "NOT_APPLICABLE")}
                  >
                    Não se aplica
                  </Button>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </li>
  );
}
