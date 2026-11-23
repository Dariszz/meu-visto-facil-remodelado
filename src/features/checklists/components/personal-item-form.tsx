"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PersonalItemFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"title" | "description" | "stage", string>>;
};

const stages = [
  { value: "REQUIREMENTS", label: "Requisitos" },
  { value: "APPLICATION", label: "Solicitação" },
  { value: "ENTRY", label: "Entrada" },
  { value: "AFTER_ARRIVAL", label: "Após a chegada" },
] as const;

export function PersonalItemForm({
  action: serverAction,
}: {
  action: (
    state: PersonalItemFormState,
    form: FormData,
  ) => Promise<PersonalItemFormState>;
}) {
  const [state, action, pending] = useActionState(serverAction, {
    status: "idle",
  } as PersonalItemFormState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);
  const errors = state.fieldErrors ?? {};
  return (
    <details className="group mt-12 max-w-2xl border-t pt-6">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-medium text-primary [&::-webkit-details-marker]:hidden">
        <Plus aria-hidden="true" className="size-4" />
        Adicionar item pessoal
      </summary>
      <form
        ref={formRef}
        action={action}
        aria-busy={pending}
        className="mt-4 space-y-4"
      >
        <p className="text-sm text-muted-foreground">
          Itens pessoais ajudam a organizar o que é só seu (por exemplo,
          &ldquo;traduzir diploma&rdquo;). Eles não são requisitos oficiais.
        </p>
        <div className="space-y-2">
          <label htmlFor="personal-title" className="text-sm font-medium">
            Item
          </label>
          <Input
            id="personal-title"
            name="title"
            required
            maxLength={120}
            disabled={pending}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? "personal-title-error" : undefined}
          />
          {errors.title && (
            <p id="personal-title-error" className="text-sm text-destructive">
              {errors.title}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="personal-description" className="text-sm font-medium">
            Observação (opcional)
          </label>
          <textarea
            id="personal-description"
            name="description"
            maxLength={500}
            rows={3}
            disabled={pending}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={
              errors.description ? "personal-description-error" : undefined
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
          {errors.description && (
            <p
              id="personal-description-error"
              className="text-sm text-destructive"
            >
              {errors.description}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="personal-stage" className="text-sm font-medium">
            Etapa
          </label>
          <select
            id="personal-stage"
            name="stage"
            defaultValue="REQUIREMENTS"
            disabled={pending}
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-64"
          >
            {stages.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        {state.message && (
          <Alert
            role={state.status === "error" ? "alert" : "status"}
            variant={state.status === "error" ? "destructive" : "default"}
          >
            {state.message}
          </Alert>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando…" : "Adicionar ao checklist"}
        </Button>
      </form>
    </details>
  );
}
