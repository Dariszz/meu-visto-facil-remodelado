"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CircleDot, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { calculateChecklistProgress, findNextChecklistItem } from "../progress";
import type {
  ChecklistCategoryView,
  ChecklistItemStatus,
  ChecklistItemView,
  ChecklistSourceRef,
} from "../types";
import { itemStatusPresentation } from "./status-presentation";

type Filter = "all" | "open" | "done";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Em aberto" },
  { value: "done", label: "Concluídos" },
];

function matchesFilter(item: ChecklistItemView, filter: Filter) {
  if (filter === "open")
    return item.status === "PENDING" || item.status === "IN_PROGRESS";
  if (filter === "done")
    return item.status === "COMPLETED" || item.status === "NOT_APPLICABLE";
  return true;
}

export function ChecklistWorkspace({
  categories: initialCategories,
  sources,
  onStatusChange,
}: {
  categories: readonly ChecklistCategoryView[];
  sources: readonly ChecklistSourceRef[];
  // Ponto de integração da Fase 23: persistir a mudança no servidor.
  onStatusChange?: (itemId: string, status: ChecklistItemStatus) => void;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [filter, setFilter] = useState<Filter>("all");
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

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        {/* Resumo compacto para telas pequenas, onde o painel lateral fica no fim. */}
        <div className="mb-8 rounded-xl border bg-card p-5 lg:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {progress.completed} de {progress.applicable} itens concluídos
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {progress.percent}%
            </p>
          </div>
          <Progress
            value={progress.percent}
            aria-label="Progresso geral do checklist (resumo)"
            className="mt-3"
          />
          {nextItem && (
            <a
              href={`#item-${nextItem.id}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
            >
              Próximo passo: {nextItem.title}
            </a>
          )}
        </div>
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Filtrar itens do checklist</legend>
          {filters.map((option) => (
            <label
              key={option.value}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border bg-card px-4 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                filter === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={filterName}
                value={option.value}
                checked={filter === option.value}
                onChange={() => setFilter(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        <div className="mt-8 space-y-10">
          {categories.map((category) => {
            const visible = category.items.filter((item) =>
              matchesFilter(item, filter),
            );
            const categoryProgress = calculateChecklistProgress(category.items);
            return (
              <section
                key={category.id}
                aria-labelledby={`category-${category.id}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-3">
                  <h2
                    id={`category-${category.id}`}
                    className="text-xl font-semibold tracking-tight"
                  >
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {categoryProgress.completed} de{" "}
                    {categoryProgress.applicable} concluídos
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
        aria-label="Resumo do progresso"
        className="space-y-5 lg:sticky lg:top-6"
      >
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Progresso geral
          </p>
          <p
            className="mt-2 text-4xl font-semibold tracking-tight"
            aria-live="polite"
          >
            {progress.percent}%
          </p>
          <Progress
            value={progress.percent}
            aria-label="Progresso geral do checklist"
            className="mt-4"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            {progress.completed} de {progress.applicable} itens concluídos
          </p>
          <ul className="mt-6 space-y-4 border-t pt-5">
            {categories.map((category) => {
              const categoryProgress = calculateChecklistProgress(
                category.items,
              );
              return (
                <li key={category.id}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{category.title}</span>
                    <span className="text-muted-foreground">
                      {categoryProgress.percent}%
                    </span>
                  </div>
                  <Progress
                    value={categoryProgress.percent}
                    aria-label={`Progresso de ${category.title}`}
                    className="mt-2 h-1.5"
                  />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-6">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <CircleDot aria-hidden="true" className="size-4" />
            Próximo passo
          </p>
          {nextItem ? (
            <>
              <p className="mt-3 font-semibold leading-snug">
                {nextItem.title}
              </p>
              <a
                href={`#item-${nextItem.id}`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
              >
                Ir para o item{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Todos os itens aplicáveis foram concluídos. Confira as fontes
              oficiais antes de qualquer decisão.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <BookOpen aria-hidden="true" className="size-4 text-primary" />
            Fontes oficiais usadas
          </p>
          <ul className="mt-4 space-y-4 text-sm">
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
        </Card>
      </aside>
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
    <li id={`item-${item.id}`} className="scroll-mt-6 py-5">
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <label
              htmlFor={checkboxId}
              className={cn(
                "cursor-pointer font-medium leading-snug",
                (done || notApplicable) && "text-muted-foreground line-through",
              )}
            >
              {item.title}
            </label>
            {item.isMandatory ? (
              <Badge variant="outline">Obrigatório</Badge>
            ) : (
              !item.isOfficial && <Badge variant="secondary">Pessoal</Badge>
            )}
            {item.status !== "PENDING" && !done && (
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-semibold",
                  status.tone,
                )}
              >
                {status.label}
              </span>
            )}
          </div>
          <details className="group mt-2">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm text-primary underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
              <ListChecks aria-hidden="true" className="size-4" />
              <span className="group-open:hidden">Ver detalhes</span>
              <span className="hidden group-open:inline">Ocultar detalhes</span>
              <span className="sr-only"> de {item.title}</span>
            </summary>
            <div className="mt-2 space-y-4 rounded-lg bg-muted/60 p-4 text-sm">
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
