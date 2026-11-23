import "server-only";
import { Prisma } from "../src/lib/db/generated/client";
import {
  buildDestinationQuestions,
  type DestinationQuestionConfig,
} from "../src/features/questionnaire/data/destination-questions";
import { irelandQuestions } from "../src/features/questionnaire/data/ireland-questions";
import type { QuestionView } from "../src/features/questionnaire/types";
import { recommendationDestinations } from "../src/features/destinations/registry";
import type { CountryContent } from "./seed-data/countries/types";

// Opções de cada destino além do que vem do conteúdo (categorias de visto).
const destinationOptions: Record<
  string,
  Omit<DestinationQuestionConfig, "inName" | "categories">
> = {
  portugal: { passport: "eu" },
  spain: { passport: "eu" },
  italy: { passport: "eu" },
  germany: { passport: "eu", asksGerman: true, asksEnglish: true },
  netherlands: { passport: "eu", asksAge: true },
  "united-kingdom": { passport: "uk", asksEnglish: true },
  canada: {
    passport: "local",
    localLabel: "Sou cidadão ou residente permanente do Canadá",
    asksEnglish: true,
    asksAge: true,
  },
  "united-states": {
    passport: "local",
    localLabel:
      "Sou cidadão ou residente permanente (green card) dos Estados Unidos",
    asksEnglish: true,
  },
  australia: {
    passport: "local",
    localLabel: "Sou cidadão ou residente permanente da Austrália",
    asksEnglish: true,
    asksAge: true,
  },
};

export function questionsForDestination(content: CountryContent) {
  const options = destinationOptions[content.slug];
  const registry =
    recommendationDestinations[
      content.slug as keyof typeof recommendationDestinations
    ];
  if (!options || !registry)
    throw new Error(`Destino sem questionário configurado: ${content.slug}`);
  return buildDestinationQuestions({
    ...options,
    inName: registry.inName,
    categories: new Set(content.visas.map((visa) => visa.category)),
  });
}

// O banco (jsonb) reordena as chaves: compara ignorando a ordem.
const canonical = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, item]) => [key, canonical(item)]),
        )
      : value;
const sameJson = (a: unknown, b: unknown) =>
  JSON.stringify(canonical(a ?? null)) === JSON.stringify(canonical(b ?? null));

// Grava as perguntas de um destino escrevendo só o que mudou, para o seed
// poder rodar de novo sem alterar datas. Perguntas que saíram do arquivo
// viram ARCHIVED (as respostas antigas continuam no banco, sem uso).
export async function seedQuestions(
  tx: Prisma.TransactionClient,
  countryId: string,
  countryCode: string,
  questions: readonly QuestionView[],
) {
  const existing = await tx.profileQuestion.findMany({
    where: { countryId },
    include: { options: true },
  });
  const byCode = new Map(existing.map((question) => [question.code, question]));
  for (const [index, item] of questions.entries()) {
    const data = {
      question: item.question,
      shortLabel: item.shortLabel ?? null,
      description: item.description ?? null,
      type: item.type,
      required: item.required,
      sortOrder: index,
      status: "ACTIVE" as const,
    };
    const showIf = item.showIf
      ? {
          questionCode: item.showIf.questionCode,
          equalsAnyOf: [...item.showIf.equalsAnyOf],
        }
      : null;
    let current = byCode.get(item.code);
    if (!current)
      current = await tx.profileQuestion.create({
        data: {
          id: `seed-question-${countryCode.toLowerCase()}-${item.code}`,
          countryId,
          code: item.code,
          ...data,
          ...(showIf ? { showIf } : {}),
        },
        include: { options: true },
      });
    else if (
      Object.entries(data).some(
        ([key, value]) => (current as Record<string, unknown>)[key] !== value,
      ) ||
      !sameJson(current.showIf, showIf)
    )
      await tx.profileQuestion.update({
        where: { id: current.id },
        data: {
          ...data,
          showIf: showIf ?? Prisma.DbNull,
        },
      });

    const wanted = item.options ?? [];
    const optionsByValue = new Map(
      current.options.map((option) => [option.value, option]),
    );
    for (const [optionIndex, option] of wanted.entries()) {
      const optionData = {
        label: option.label,
        description: option.description ?? null,
        sortOrder: optionIndex,
      };
      const found = optionsByValue.get(option.value);
      if (!found)
        await tx.questionOption.create({
          data: { questionId: current.id, value: option.value, ...optionData },
        });
      else if (
        Object.entries(optionData).some(
          ([key, value]) => (found as Record<string, unknown>)[key] !== value,
        )
      )
        await tx.questionOption.update({
          where: { id: found.id },
          data: optionData,
        });
    }
    const stale = current.options.filter(
      (option) => !wanted.some((item) => item.value === option.value),
    );
    if (stale.length)
      await tx.questionOption.deleteMany({
        where: { id: { in: stale.map((option) => option.id) } },
      });
  }
  const codes = new Set(questions.map((question) => question.code));
  const archived = existing.filter(
    (question) => !codes.has(question.code) && question.status !== "ARCHIVED",
  );
  if (archived.length)
    await tx.profileQuestion.updateMany({
      where: { id: { in: archived.map((question) => question.id) } },
      data: { status: "ARCHIVED" },
    });
}

export { irelandQuestions };
