"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/button";
import { DELETE_CONFIRMATION, type DeleteAccountState } from "./types";

export function DeleteAccountForm({
  action,
}: {
  action: (
    state: DeleteAccountState,
    form: FormData,
  ) => Promise<DeleteAccountState>;
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
  });
  const inputId = useId();
  const hintId = useId();
  return (
    <section
      aria-labelledby={`${inputId}-title`}
      className="mt-10 border-t pt-8"
    >
      <h2 id={`${inputId}-title`} className="text-lg font-semibold">
        Excluir conta
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Apaga de vez o seu perfil, as respostas do questionário, os processos
        com o andamento do checklist e o seu acesso. Não dá para desfazer.
      </p>
      <form action={formAction} className="mt-5 space-y-3">
        <label htmlFor={inputId} className="block text-sm font-medium">
          Digite {DELETE_CONFIRMATION} para confirmar
        </label>
        <input
          id={inputId}
          name="confirmation"
          autoComplete="off"
          aria-describedby={state.status === "error" ? hintId : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="block min-h-11 w-full rounded-md border border-input bg-background px-3 text-base"
        />
        {state.status === "error" && (
          <p id={hintId} role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
        <Button
          type="submit"
          variant="destructive"
          disabled={pending}
          className="w-full"
        >
          {pending ? "Excluindo…" : "Excluir minha conta"}
        </Button>
      </form>
    </section>
  );
}
