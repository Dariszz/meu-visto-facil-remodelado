"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { StartProcessState } from "../actions";

export function StartProcessForm({
  action,
  visaSlug,
  visaName,
}: {
  action: (
    state: StartProcessState,
    form: FormData,
  ) => Promise<StartProcessState>;
  visaSlug: string;
  visaName: string;
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
  });
  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="visaSlug" value={visaSlug} />
      <Button
        type="submit"
        disabled={pending}
        aria-label={`Iniciar processo de ${visaName}`}
      >
        {pending ? "Criando processo…" : "Iniciar processo"}
      </Button>
      {state.status === "error" && (
        <p role="alert" className="w-full text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
