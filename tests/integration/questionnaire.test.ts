import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import {
  listActiveQuestions,
  toQuestionView,
} from "../../src/lib/db/repositories/question-repository";
import {
  findAnswers,
  replaceAnswers,
} from "../../src/lib/db/repositories/answer-repository";
import { irelandQuestions } from "../../src/features/questionnaire/data/ireland-questions";
import { seedCatalog } from "../../prisma/seed-catalog";

test("questionnaire: seeded questions, private answers replaced per country and cascade", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_QUESTIONNAIRE_FIXTURES");
  try {
    await assert.rejects(
      client.$transaction(async (tx) => {
        await seedCatalog(tx);
        await seedCatalog(tx);
        const records = await listActiveQuestions("ireland", tx);
        // Seed repetido não duplica; ordem e conteúdo iguais aos dados versionados.
        assert.deepEqual(
          records.map(toQuestionView),
          irelandQuestions.map((question) => ({ ...question })),
        );
        const id = (code: string) => records.find((r) => r.code === code)!.id;

        const other = await tx.country.create({
          data: {
            code: "QA",
            slug: "questionnaire-other",
            name: "Other",
            status: "ACTIVE",
          },
        });
        const otherQuestion = await tx.profileQuestion.create({
          data: {
            countryId: other.id,
            code: "objective",
            question: "Other?",
            type: "BOOLEAN",
          },
        });
        const [alice, bob] = await Promise.all(
          [
            "00000000-0000-4000-8000-0000000000a1",
            "00000000-0000-4000-8000-0000000000b2",
          ].map((authUserId) =>
            tx.userProfile.create({ data: { authUserId } }),
          ),
        );
        await tx.profileAnswer.create({
          data: {
            userProfileId: alice.id,
            questionId: otherQuestion.id,
            value: true,
          },
        });
        const irelandIds = records.map((record) => record.id);
        await replaceAnswers(
          {
            userProfileId: alice.id,
            countryQuestionIds: irelandIds,
            answers: [
              { questionId: id("objective"), value: "work" },
              { questionId: id("has_employment_offer"), value: true },
              { questionId: id("offer_duration"), value: "2y_plus" },
            ],
          },
          tx,
        );
        await replaceAnswers(
          {
            userProfileId: alice.id,
            countryQuestionIds: irelandIds,
            answers: [
              { questionId: id("objective"), value: "study" },
              { questionId: id("region"), value: "other" },
            ],
          },
          tx,
        );
        const stored = await findAnswers(alice.id, irelandIds, tx);
        assert.deepEqual(
          stored
            .map((a) => [
              records.find((r) => r.id === a.questionId)!.code,
              a.value,
            ])
            .sort(),
          [
            ["objective", "study"],
            ["region", "other"],
          ],
        );
        // Respostas de outro país e de outra pessoa ficam intactas e isoladas.
        assert.equal(
          (await findAnswers(alice.id, [otherQuestion.id], tx)).length,
          1,
        );
        assert.deepEqual(await findAnswers(bob.id, irelandIds, tx), []);
        await assert.rejects(
          replaceAnswers(
            {
              userProfileId: bob.id,
              countryQuestionIds: irelandIds,
              answers: [{ questionId: otherQuestion.id, value: true }],
            },
            tx,
          ),
          /ANSWER_QUESTION_MISMATCH/,
        );
        // Excluir o perfil remove as respostas.
        await tx.userProfile.delete({ where: { id: alice.id } });
        assert.equal(
          await tx.profileAnswer.count({ where: { userProfileId: alice.id } }),
          0,
        );
        // Configuração inválida de exibição falha de forma segura.
        await tx.profileQuestion.update({
          where: { id: id("offer_duration") },
          data: { showIf: { questionCode: "x" } },
        });
        await assert.rejects(
          listActiveQuestions("ireland", tx),
          /CATALOG_UNAVAILABLE/,
        );
        throw rollback;
      }),
      rollback,
    );
  } finally {
    await client.$disconnect();
  }
});

test("answers table has no public or Data API grants", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  try {
    const exposed = await client.$queryRaw<{ grantee: string }[]>`
      SELECT CASE WHEN acl.grantee = 0 THEN 'PUBLIC' ELSE roles.rolname END AS grantee
      FROM pg_class class
      JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
      CROSS JOIN LATERAL aclexplode(COALESCE(class.relacl, acldefault('r', class.relowner))) acl
      LEFT JOIN pg_roles roles ON roles.oid = acl.grantee
      WHERE namespace.nspname = 'catalog' AND class.relname = 'ProfileAnswer'
        AND (acl.grantee = 0 OR roles.rolname IN ('mvf_catalog_reader', 'anon', 'authenticated', 'service_role'))`;
    assert.deepEqual(exposed, []);
  } finally {
    await client.$disconnect();
  }
});
