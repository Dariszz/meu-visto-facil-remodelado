import "server-only";
import { z } from "zod";
import type { QuestionView } from "@/features/questionnaire/types";
import type { Prisma } from "../generated/client";
import { getDatabaseClient } from "../client";
import { catalogSlug, publicQuery } from "./public-query";

export type QuestionRecord = QuestionView & { id: string };

export function toQuestionView(record: QuestionRecord): QuestionView {
  const view: QuestionView & { id?: string } = { ...record };
  delete view.id;
  return view;
}

const showIfSchema = z
  .object({
    questionCode: z.string().min(1).max(80),
    equalsAnyOf: z
      .array(z.union([z.string().max(80), z.boolean()]))
      .min(1)
      .max(20),
  })
  .strict();

// Perguntas são catálogo público, lidas com a credencial somente leitura.
export async function listActiveQuestions(
  countrySlug: string,
  db?: Prisma.TransactionClient,
): Promise<QuestionRecord[]> {
  if (!catalogSlug.safeParse(countrySlug).success) return [];
  return publicQuery(async () => {
    const rows = await (db ?? getDatabaseClient()).profileQuestion.findMany({
      where: {
        status: "ACTIVE",
        country: { slug: countrySlug, status: "ACTIVE" },
      },
      select: {
        id: true,
        code: true,
        question: true,
        shortLabel: true,
        description: true,
        type: true,
        required: true,
        showIf: true,
        options: {
          select: { value: true, label: true, description: true },
          orderBy: [{ sortOrder: "asc" }, { value: "asc" }],
          take: 51,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      take: 101,
    });
    if (rows.length > 100 || rows.some((row) => row.options.length > 50))
      throw new Error("QUESTIONNAIRE_LIMIT_EXCEEDED");
    return rows.map((row) => {
      const showIf =
        row.showIf === null ? undefined : showIfSchema.safeParse(row.showIf);
      // Configuração inválida falha de forma segura em vez de exibir perguntas erradas.
      if (showIf && !showIf.success)
        throw new Error("QUESTIONNAIRE_CONFIG_INVALID");
      return {
        id: row.id,
        code: row.code,
        question: row.question,
        type: row.type,
        required: row.required,
        ...(row.shortLabel ? { shortLabel: row.shortLabel } : {}),
        ...(row.description ? { description: row.description } : {}),
        ...(row.type === "BOOLEAN"
          ? {}
          : {
              options: row.options.map((option) => ({
                value: option.value,
                label: option.label,
                ...(option.description
                  ? { description: option.description }
                  : {}),
              })),
            }),
        ...(showIf?.success ? { showIf: showIf.data } : {}),
      };
    });
  });
}
