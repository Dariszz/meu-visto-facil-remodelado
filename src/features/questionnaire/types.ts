// Contratos de apresentação do questionário (Fases 13–14). As perguntas reais
// virão de ProfileQuestion/QuestionOption; a UI só conhece estes tipos.
export type QuestionType = "BOOLEAN" | "SINGLE_SELECT" | "MULTI_SELECT";

export type QuestionOptionView = {
  value: string;
  label: string;
  description?: string;
};

export type AnswerValue = boolean | string | readonly string[];

export type Answers = Readonly<Record<string, AnswerValue>>;

// Condição simples: a pergunta aparece quando outra resposta é igual a um dos
// valores listados. Evita uma engine genérica, como pede o roadmap.
export type QuestionCondition = {
  questionCode: string;
  equalsAnyOf: readonly (string | boolean)[];
};

export type QuestionView = {
  code: string;
  question: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: readonly QuestionOptionView[];
  showIf?: QuestionCondition;
};
