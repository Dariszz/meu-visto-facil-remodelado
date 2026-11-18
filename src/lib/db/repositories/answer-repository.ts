import "server-only";
import type { Prisma } from "../generated/client";
import { getProfileDatabaseClient } from "../profile-client";

// Respostas são dados pessoais: credencial de perfil, nunca a do catálogo.
export async function findAnswers(
  userProfileId: string,
  questionIds: readonly string[],
  db?: Prisma.TransactionClient,
): Promise<{ questionId: string; value: unknown }[]> {
  if (!questionIds.length) return [];
  return (db ?? getProfileDatabaseClient()).profileAnswer.findMany({
    where: { userProfileId, questionId: { in: [...questionIds] } },
    select: { questionId: true, value: true },
    take: 101,
  });
}

// Substitui as respostas do questionário de um país: apaga as do conjunto de
// perguntas e grava as enviadas, numa transação. São duas instruções no banco
// em vez de uma por resposta, o que importa quando o banco está longe.
// Respostas de outros países ficam intactas.
export async function replaceAnswers(
  input: {
    userProfileId: string;
    countryQuestionIds: readonly string[];
    answers: readonly { questionId: string; value: Prisma.InputJsonValue }[];
  },
  db?: Prisma.TransactionClient,
): Promise<void> {
  const allowed = new Set(input.countryQuestionIds);
  if (input.answers.some((answer) => !allowed.has(answer.questionId)))
    throw new Error("ANSWER_QUESTION_MISMATCH");
  const run = async (tx: Prisma.TransactionClient) => {
    await tx.profileAnswer.deleteMany({
      where: {
        userProfileId: input.userProfileId,
        questionId: { in: [...input.countryQuestionIds] },
      },
    });
    if (input.answers.length)
      await tx.profileAnswer.createMany({
        data: input.answers.map((answer) => ({
          userProfileId: input.userProfileId,
          questionId: answer.questionId,
          value: answer.value,
        })),
      });
  };
  if (db) return run(db);
  await getProfileDatabaseClient().$transaction(run);
}
