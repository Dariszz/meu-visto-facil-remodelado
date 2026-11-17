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

// Substitui as respostas do questionário de um país: grava as enviadas e
// remove as que deixaram de valer (perguntas ocultas ou limpas) dentro do
// mesmo conjunto de perguntas. Respostas de outros países ficam intactas.
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
        questionId: {
          in: input.countryQuestionIds.filter(
            (id) => !input.answers.some((answer) => answer.questionId === id),
          ),
        },
      },
    });
    for (const answer of input.answers) {
      await tx.profileAnswer.upsert({
        where: {
          userProfileId_questionId: {
            userProfileId: input.userProfileId,
            questionId: answer.questionId,
          },
        },
        create: { userProfileId: input.userProfileId, ...answer },
        update: { value: answer.value },
      });
    }
  };
  if (db) return run(db);
  await getProfileDatabaseClient().$transaction(run);
}
