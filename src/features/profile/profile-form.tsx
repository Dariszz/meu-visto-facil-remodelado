"use client";

import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProfileAction, updateProfileAction } from "./actions";
import type { ProfileActionState } from "./types";

export function ProfileForm({
  initialDisplayName,
}: {
  // Presente quando o perfil já existe: o formulário passa a editar.
  initialDisplayName?: string | null;
} = {}) {
  const editing = initialDisplayName !== undefined;
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [state, action, pending] = useActionState<ProfileActionState, FormData>(
    editing ? updateProfileAction : createProfileAction,
    { status: "idle" },
  );
  return (
    <form action={action} className="space-y-5" aria-busy={pending}>
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Nome de exibição (opcional)
        </label>
        <Input
          id="displayName"
          name="displayName"
          autoComplete="nickname"
          maxLength={100}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          disabled={pending}
          aria-invalid={state.fieldErrors?.displayName ? true : undefined}
          aria-describedby={
            state.fieldErrors?.displayName
              ? "displayName-hint displayName-error"
              : "displayName-hint"
          }
        />
        <p id="displayName-hint" className="text-xs text-muted-foreground">
          Como você prefere ser chamado. Até 100 caracteres.
        </p>
        {state.fieldErrors?.displayName && (
          <p id="displayName-error" className="text-sm text-destructive">
            {state.fieldErrors.displayName}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="preferredLocale" className="text-sm font-medium">
          Idioma
        </label>
        <Select name="preferredLocale" defaultValue="pt-BR" disabled={pending}>
          <SelectTrigger
            id="preferredLocale"
            aria-invalid={state.fieldErrors?.preferredLocale ? true : undefined}
            aria-describedby={
              state.fieldErrors?.preferredLocale
                ? "preferredLocale-error"
                : undefined
            }
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
          </SelectContent>
        </Select>
        {state.fieldErrors?.preferredLocale && (
          <p id="preferredLocale-error" className="text-sm text-destructive">
            {state.fieldErrors.preferredLocale}
          </p>
        )}
      </div>
      {state.message && (
        <Alert
          role={state.status === "error" ? "alert" : "status"}
          variant={state.status === "error" ? "destructive" : "default"}
        >
          {state.message}
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {editing
          ? pending
            ? "Salvando…"
            : "Salvar alterações"
          : pending
            ? "Criando perfil…"
            : "Criar meu perfil"}
      </Button>
    </form>
  );
}
