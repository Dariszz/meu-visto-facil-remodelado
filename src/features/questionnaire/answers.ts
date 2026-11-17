import { z } from "zod";
import { getVisibleQuestions, isAnswered, pruneHiddenAnswers } from "./flow";
import type { AnswerValue, Answers, QuestionView } from "./types";

export class AnswersInvalidError extends Error {
  readonly code = "ANSWERS_INVALID";
  constructor(readonly issues: readonly string[]) {
    super("ANSWERS_INVALID");
    this.name = "AnswersInvalidError";
  }
}

// Schema do valor de uma resposta a partir do tipo da pergunta. Usado ao
// receber do navegador e ao ler do banco: nada de JSON arbitrário no domínio.
export function answerValueSchema(
  question: QuestionView,
): z.ZodType<AnswerValue> {
  const values = (question.options ?? []).map((option) => option.value);
  if (question.type === "BOOLEAN") return z.boolean();
  const option = z
    .string()
    .refine((value) => values.includes(value), "OPTION_NOT_ALLOWED");
  if (question.type === "SINGLE_SELECT") return option;
  return z
    .array(option)
    .max(values.length)
    .refine((list) => new Set(list).size === list.length, "DUPLICATE_OPTION");
}

const submissionShape = z.record(z.string().max(80), z.unknown());

// Valida a submissão completa contra as perguntas configuradas: só códigos
// conhecidos, valores do tipo certo, obrigatórias visíveis respondidas.
// Respostas de perguntas ocultas são descartadas.
export function validateAnswers(
  questions: readonly QuestionView[],
  input: unknown,
): Answers {
  const raw = submissionShape.safeParse(input);
  if (!raw.success) throw new AnswersInvalidError(["SHAPE"]);
  const byCode = new Map(
    questions.map((question) => [question.code, question]),
  );
  const issues: string[] = [];
  const parsed: Record<string, AnswerValue> = {};
  for (const [code, value] of Object.entries(raw.data)) {
    const question = byCode.get(code);
    if (!question) {
      issues.push(`UNKNOWN_QUESTION:${code}`);
      continue;
    }
    const result = answerValueSchema(question).safeParse(value);
    if (!result.success) issues.push(`INVALID_VALUE:${code}`);
    else parsed[code] = result.data;
  }
  if (issues.length) throw new AnswersInvalidError(issues);
  const answers = pruneHiddenAnswers(questions, parsed);
  const missing = getVisibleQuestions(questions, answers)
    .filter(
      (question) => question.required && !isAnswered(answers[question.code]),
    )
    .map((question) => `REQUIRED:${question.code}`);
  if (missing.length) throw new AnswersInvalidError(missing);
  return Object.fromEntries(
    Object.entries(answers).filter(([, value]) => isAnswered(value)),
  );
}

// Respostas lidas do banco: valores que não batem com a pergunta atual (por
// exemplo, opção removida) são ignorados em vez de quebrar a tela.
export function readStoredAnswers(
  questions: readonly QuestionView[],
  stored: readonly { questionCode: string; value: unknown }[],
): Answers {
  const byCode = new Map(
    questions.map((question) => [question.code, question]),
  );
  const answers: Record<string, AnswerValue> = {};
  for (const { questionCode, value } of stored) {
    const question = byCode.get(questionCode);
    if (!question) continue;
    const result = answerValueSchema(question).safeParse(value);
    if (result.success) answers[questionCode] = result.data;
  }
  return pruneHiddenAnswers(questions, answers);
}

export function isQuestionnaireComplete(
  questions: readonly QuestionView[],
  answers: Answers,
): boolean {
  if (!questions.length) return false;
  return getVisibleQuestions(questions, answers).every(
    (question) => !question.required || isAnswered(answers[question.code]),
  );
}
