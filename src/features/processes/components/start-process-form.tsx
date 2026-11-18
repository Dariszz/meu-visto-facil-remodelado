"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { StartProcessState } from "../actions";

export function StartProcessForm({
  action,
  visaSlug,
  visaName,
  countrySlug,
  label = "Iniciar processo",
}: {
  action: (
    state: StartProcessState,
    form: FormData,
  ) => Promise<StartProcessState>;
  visaSlug: string;
  visaName: string;
  countrySlug?: string;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
  });
  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="visaSlug" value={visaSlug} />
      {countrySlug && (
        <input type="hidden" name="countrySlug" value={countrySlug} />
      )}
      <Button
        type="submit"
        disabled={pending}
        aria-label={`${label} de ${visaName}`}
      >
        {pending ? "Criando…" : label}
      </Button>
      {state.status === "error" && (
        <p role="alert" className="w-full text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
