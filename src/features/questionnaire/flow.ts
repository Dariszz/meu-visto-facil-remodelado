import type { AnswerValue, Answers, QuestionView } from "./types";

export function isQuestionVisible(
  question: QuestionView,
  answers: Answers,
): boolean {
  if (!question.showIf) return true;
  const answer = answers[question.showIf.questionCode];
  if (answer === undefined || Array.isArray(answer)) return false;
  return question.showIf.equalsAnyOf.includes(answer as string | boolean);
}

// Perguntas visíveis na ordem configurada. Uma pergunta cuja condição depende
// de outra oculta também fica oculta.
export function getVisibleQuestions(
  questions: readonly QuestionView[],
  answers: Answers,
): QuestionView[] {
  const visible: QuestionView[] = [];
  const visibleCodes = new Set<string>();
  for (const question of questions) {
    const parent = question.showIf?.questionCode;
    if (parent && !visibleCodes.has(parent)) continue;
    if (!isQuestionVisible(question, answers)) continue;
    visible.push(question);
    visibleCodes.add(question.code);
  }
  return visible;
}

// Total estimado para o indicador de progresso: perguntas visíveis mais as
// que ainda podem aparecer porque a pergunta de que dependem não foi
// respondida. Evita mostrar "1 de 3" e depois saltar para "4 de 6".
export function countPotentialQuestions(
  questions: readonly QuestionView[],
  answers: Answers,
): number {
  const excluded = new Set<string>();
  let total = 0;
  for (const question of questions) {
    const parent = question.showIf?.questionCode;
    if (parent) {
      if (excluded.has(parent)) {
        excluded.add(question.code);
        continue;
      }
      if (
        answers[parent] !== undefined &&
        !isQuestionVisible(question, answers)
      ) {
        excluded.add(question.code);
        continue;
      }
    }
    total += 1;
  }
  return total;
}

export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return value !== "";
}

// Remove respostas de perguntas que deixaram de ser exibidas, para que o
// perfil enviado não carregue informação contraditória.
export function pruneHiddenAnswers(
  questions: readonly QuestionView[],
  answers: Answers,
): Answers {
  const visibleCodes = new Set(
    getVisibleQuestions(questions, answers).map((question) => question.code),
  );
  return Object.fromEntries(
    Object.entries(answers).filter(([code]) => visibleCodes.has(code)),
  );
}

export function formatAnswer(
  question: QuestionView,
  value: AnswerValue | undefined,
): string {
  if (!isAnswered(value)) return "Sem resposta";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  const labels = new Map(
    question.options?.map((option) => [option.value, option.label]),
  );
  const values: readonly string[] = Array.isArray(value)
    ? value
    : [value as string];
  return values.map((item) => labels.get(item) ?? item).join(", ");
}
