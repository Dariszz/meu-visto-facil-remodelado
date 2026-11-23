"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loginAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordAction,
  logoutAction,
  confirmEmailAction,
} from "./actions";
import type { AuthActionState } from "./types";

const modes = {
  login: { action: loginAction, label: "Entrar" },
  register: { action: registerAction, label: "Criar conta" },
  "forgot-password": {
    action: forgotPasswordAction,
    label: "Enviar link de recuperação",
  },
  "reset-password": { action: resetPasswordAction, label: "Salvar nova senha" },
  logout: { action: logoutAction, label: "Sair da conta" },
  confirm: { action: confirmEmailAction, label: "Continuar" },
};

type AuthFormProps = {
  mode: keyof typeof modes;
  confirmation?: { token_hash: string; type: "signup" | "recovery" };
  // Caminho interno para voltar depois do login (validado no servidor).
  next?: string;
};

export function AuthForm({ mode, confirmation, next }: AuthFormProps) {
  const [state, action, pending] = useActionState<AuthActionState, FormData>(
    modes[mode].action,
    { status: "idle" },
  );
  const hasEmail = ["login", "register", "forgot-password"].includes(mode);
  const hasPassword = ["login", "register", "reset-password"].includes(mode);
  const hasConfirmation = mode === "register" || mode === "reset-password";
  const fields = [
    ...(hasEmail
      ? [
          {
            name: "email" as const,
            label: "E-mail",
            type: "email",
            autoComplete: "email",
          },
        ]
      : []),
    ...(hasPassword
      ? [
          {
            name: "password" as const,
            label: mode === "reset-password" ? "Nova senha" : "Senha",
            type: "password",
            autoComplete:
              mode === "login" ? "current-password" : "new-password",
          },
        ]
      : []),
    ...(hasConfirmation
      ? [
          {
            name: "confirmPassword" as const,
            label: "Confirmar senha",
            type: "password",
            autoComplete: "new-password",
          },
        ]
      : []),
  ];
  return (
    <form action={action} className="space-y-5" aria-busy={pending}>
      {mode === "login" && next && (
        <input type="hidden" name="next" value={next} />
      )}
      {confirmation && (
        <>
          <input
            type="hidden"
            name="token_hash"
            value={confirmation.token_hash}
          />
          <input type="hidden" name="type" value={confirmation.type} />
        </>
      )}
      {fields.map((field) => {
        const error = state.fieldErrors?.[field.name];
        const hint = field.name === "password" && hasConfirmation;
        return (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              disabled={pending}
              maxLength={field.name === "email" ? 254 : 128}
              minLength={hint ? 8 : undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={
                [
                  hint ? "password-hint" : "",
                  error ? `${field.name}-error` : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
            {hint && (
              <p id="password-hint" className="text-xs text-muted-foreground">
                Use pelo menos 8 caracteres.
              </p>
            )}
            {error && (
              <p
                id={`${field.name}-error`}
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}
      {state.message && (
        <Alert
          role={state.status === "error" ? "alert" : "status"}
          variant={state.status === "error" ? "destructive" : "default"}
        >
          {state.message}
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Aguarde…" : modes[mode].label}
      </Button>
      {mode === "login" && (
        <div className="space-y-3 text-center text-sm">
          <p>
            <Link
              href="/forgot-password"
              className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
            >
              Esqueci minha senha
            </Link>
          </p>
          <p className="text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline underline-offset-4"
            >
              Criar conta
            </Link>
          </p>
        </div>
      )}
      {mode === "register" && (
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Ao criar a conta, você concorda com os{" "}
          <Link
            href="/termos"
            className="text-primary underline underline-offset-4"
          >
            Termos de uso
          </Link>{" "}
          e com a{" "}
          <Link
            href="/privacidade"
            className="text-primary underline underline-offset-4"
          >
            Política de privacidade
          </Link>
          .
        </p>
      )}
      {["register", "forgot-password", "reset-password", "confirm"].includes(
        mode,
      ) && (
        <p className="text-center text-sm">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
          >
            Voltar para entrar
          </Link>
        </p>
      )}
    </form>
  );
}
