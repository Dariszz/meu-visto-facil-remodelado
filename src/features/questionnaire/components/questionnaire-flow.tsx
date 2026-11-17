"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import {
  countPotentialQuestions,
  formatAnswer,
  getVisibleQuestions,
  isAnswered,
  pruneHiddenAnswers,
} from "../flow";
import type {
  AnswerValue,
  Answers,
  QuestionOptionView,
  QuestionView,
} from "../types";

const REVIEW = "review";

export function QuestionnaireFlow({
  questions,
  initialAnswers = {},
  resultHref,
}: {
  questions: readonly QuestionView[];
  initialAnswers?: Answers;
  // Fase 13: substituir por envio a uma Server Action que salva ProfileAnswer.
  resultHref: string;
}) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const visible = getVisibleQuestions(questions, answers);
  const isReview = step >= visible.length;
  const current = isReview ? null : visible[step];
  const stepKey = current?.code ?? REVIEW;
  const total = Math.max(
    countPotentialQuestions(questions, answers),
    visible.length,
  );
  const percent = Math.round((Math.min(step, total) / total) * 100);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepKey]);

  function answer(code: string, value: AnswerValue) {
    setShowError(false);
    setAnswers((previous) =>
      pruneHiddenAnswers(questions, { ...previous, [code]: value }),
    );
  }

  function next() {
    if (current?.required && !isAnswered(answers[current.code])) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setStep((value) => value + 1);
  }

  function back() {
    setShowError(false);
    setStep((value) => Math.max(0, value - 1));
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>
          {isReview
            ? "Revisão das respostas"
            : `Pergunta ${step + 1} de ${total}`}
        </span>
        <span>{isReview ? 100 : percent}%</span>
      </div>
      <Progress
        value={isReview ? 100 : percent}
        aria-label="Progresso do questionário"
        className="mt-3"
      />

      <Card className="mt-8 p-6 sm:p-10">
        {current ? (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              next();
            }}
          >
            <fieldset
              aria-describedby={showError ? `${current.code}-error` : undefined}
            >
              <legend className="w-full">
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-semibold leading-snug tracking-tight focus:outline-none sm:text-3xl"
                >
                  {current.question}
                </h2>
                {current.description && (
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>
                )}
                {!current.required && (
                  <p className="mt-2 text-sm text-muted-foreground">Opcional</p>
                )}
              </legend>
              <QuestionInput
                question={current}
                value={answers[current.code]}
                invalid={showError}
                onChange={(value) => answer(current.code, value)}
              />
            </fieldset>
            {showError && (
              <p
                id={`${current.code}-error`}
                role="alert"
                className="mt-4 text-sm font-medium text-destructive"
              >
                Escolha uma opção para continuar.
              </p>
            )}
            <div className="mt-10 flex flex-wrap-reverse items-center justify-between gap-3">
              <Button variant="ghost" onClick={back} disabled={step === 0}>
                <ArrowLeft aria-hidden="true" /> Voltar
              </Button>
              <Button type="submit">
                {!current.required && !isAnswered(answers[current.code])
                  ? "Pular"
                  : "Continuar"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-semibold tracking-tight focus:outline-none sm:text-3xl"
            >
              Confira suas respostas
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Você pode alterar qualquer resposta antes de ver os caminhos.
            </p>
            <dl className="mt-8 divide-y border-y">
              {visible.map((question, index) => (
                <div
                  key={question.code}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm text-muted-foreground">
                      {question.question}
                    </dt>
                    <dd className="mt-1 font-medium">
                      {formatAnswer(question, answers[question.code])}
                    </dd>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setStep(index)}
                    aria-label={`Alterar resposta: ${question.question}`}
                  >
                    <PencilLine aria-hidden="true" /> Alterar
                  </Button>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap-reverse items-center justify-between gap-3">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft aria-hidden="true" /> Voltar
              </Button>
              <Button asChild size="lg">
                <Link href={resultHref}>
                  Ver caminhos possíveis <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Card>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Lock aria-hidden="true" className="size-4" />
        Não pedimos documentos nem dados pessoais desnecessários.
      </p>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  invalid,
  onChange,
}: {
  question: QuestionView;
  value: AnswerValue | undefined;
  invalid: boolean;
  onChange: (value: AnswerValue) => void;
}) {
  if (question.type === "BOOLEAN") {
    return (
      <OptionGrid
        name={question.code}
        type="radio"
        invalid={invalid}
        options={[
          { value: "true", label: "Sim" },
          { value: "false", label: "Não" },
        ]}
        isChecked={(option) => String(value) === option}
        onToggle={(option) => onChange(option === "true")}
        columns
      />
    );
  }
  if (question.type === "MULTI_SELECT") {
    const selected: readonly string[] = Array.isArray(value) ? value : [];
    return (
      <OptionGrid
        name={question.code}
        type="checkbox"
        invalid={invalid}
        options={question.options ?? []}
        isChecked={(option) => selected.includes(option)}
        onToggle={(option) =>
          onChange(
            selected.includes(option)
              ? selected.filter((item) => item !== option)
              : [...selected, option],
          )
        }
      />
    );
  }
  return (
    <OptionGrid
      name={question.code}
      type="radio"
      invalid={invalid}
      options={question.options ?? []}
      isChecked={(option) => value === option}
      onToggle={(option) => onChange(option)}
    />
  );
}

function OptionGrid({
  name,
  type,
  options,
  invalid,
  isChecked,
  onToggle,
  columns = false,
}: {
  name: string;
  type: "radio" | "checkbox";
  options: readonly QuestionOptionView[];
  invalid: boolean;
  isChecked: (value: string) => boolean;
  onToggle: (value: string) => void;
  columns?: boolean;
}) {
  return (
    <div className={cn("mt-8 grid gap-3", columns && "sm:grid-cols-2")}>
      {options.map((option) => {
        const checked = isChecked(option.value);
        return (
          <label
            key={option.value}
            className={cn(
              "relative flex min-h-14 cursor-pointer items-start gap-4 rounded-lg border bg-background p-4 transition-colors hover:border-primary/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
              checked && "border-primary bg-accent/60",
              invalid && !checked && "border-destructive/50",
            )}
          >
            <input
              type={type}
              name={name}
              value={option.value}
              checked={checked}
              aria-invalid={invalid || undefined}
              onChange={() => onToggle(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-input bg-card text-primary-foreground",
                type === "radio" ? "rounded-full" : "rounded",
                checked && "border-primary bg-primary",
              )}
            >
              {checked && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span>
              <span className="block font-medium">{option.label}</span>
              {option.description && (
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
