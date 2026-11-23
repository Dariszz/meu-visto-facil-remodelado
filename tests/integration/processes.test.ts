import assert from "node:assert/strict";
import test from "node:test";
import { createDatabaseClient } from "../../src/lib/db/create-client";
import { readTestDatabaseUrl } from "../../src/lib/db/environment";
import {
  findVisaForChecklist,
  listChecklistReadyVisaSlugs,
  listSourcesByIds,
} from "../../src/lib/db/repositories/checklist-catalog-repository";
import {
  createProcessWithChecklist,
  findOpenProcessIdForVisa,
  findProcessForProfile,
  listProcessesForProfile,
  updateItemStatusForProfile,
  addPersonalItemForProfile,
  deletePersonalItemForProfile,
  setProcessStatusForProfile,
} from "../../src/lib/db/repositories/process-repository";
import { updateUserProfileByAuthUserId } from "../../src/lib/db/repositories/user-profile-repository";
import { deleteUserProfileByAuthUserId } from "../../src/lib/db/repositories/user-profile-repository";
import { findPublicVisa } from "../../src/lib/db/repositories/visa-repository";
import {
  buildBaseChecklist,
  CHECKLIST_GENERATOR_VERSION,
} from "../../src/features/processes/checklist/build-base-checklist";
import { seedCatalog } from "../../prisma/seed-catalog";
import { publishDevelopmentCatalog } from "../../prisma/publish-development-catalog";
import type { ImmigrationProfile } from "../../src/features/questionnaire/immigration-profile";

const profile: ImmigrationProfile = {
  objective: "work",
  passportRegion: "other",
  hasEmploymentOffer: true,
  offerDuration: "2y_plus",
  occupationArea: "technology",
  educationLevel: null,
  familyInCountry: null,
};

test("processes: checklist from reviewed requirements, ownership isolation and cascade", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  const rollback = new Error("ROLLBACK_PROCESS_FIXTURES");
  try {
    await assert.rejects(
      client.$transaction(
        async (tx) => {
          await seedCatalog(tx);
          const slug = "critical-skills-employment-permit";
          // Rascunho não gera checklist.
          assert.equal(await findVisaForChecklist("ireland", slug, tx), null);
          await publishDevelopmentCatalog(tx);
          assert.deepEqual(await listChecklistReadyVisaSlugs("ireland", tx), [
            slug,
            "general-employment-permit",
            "join-family",
            "student-stamp-2",
          ]);

          // Requisito não revisado nunca entra no checklist.
          const draft = await tx.visaRequirement.create({
            data: {
              visaId: "seed-visa-ie-critical-skills",
              code: "draft-requirement",
              title: "Rascunho",
              description: "Ainda não revisado",
              category: "OTHER",
              requirementType: "DOCUMENT",
              reviewStatus: "NEEDS_REVIEW",
            },
          });
          const visa = (await findVisaForChecklist("ireland", slug, tx))!;
          assert.equal(
            visa.requirements.some((r) => r.id === draft.id),
            false,
          );
          const items = buildBaseChecklist(visa.requirements, profile);
          assert.deepEqual(
            items.map((item) => [item.code, item.stage]),
            [
              ["employment-offer", "REQUIREMENTS"],
              ["occupation-remuneration", "REQUIREMENTS"],
              ["qualifications", "REQUIREMENTS"],
              ["employer-conditions", "REQUIREMENTS"],
              ["submit-application", "APPLICATION"],
              ["entry-visa-check", "ENTRY"],
              ["register-residence", "AFTER_ARRIVAL"],
            ],
          );
          // A página pública continua mostrando só as condições.
          const page = await findPublicVisa("ireland", slug, tx);
          assert.equal(page?.requirements.length, 4);

          const [alice, bob] = await Promise.all(
            [
              "00000000-0000-4000-8000-00000000a001",
              "00000000-0000-4000-8000-00000000b002",
            ].map((authUserId) =>
              tx.userProfile.create({ data: { authUserId } }),
            ),
          );
          const input = (userProfileId: string) => ({
            userProfileId,
            visaId: visa.id,
            title: `Minha mudança: ${visa.name}`,
            snapshot: {
              ruleEngineVersion: "ireland-work-v1",
              profile,
              visa: { id: visa.id, slug: visa.slug },
              requirements: visa.requirements.map((r) => ({ ...r })),
              recommendation: { compatibility: "HIGH" },
            },
            checklist: {
              generatorVersion: CHECKLIST_GENERATOR_VERSION,
              referenceDate: visa.lastReviewedAt,
              items,
            },
          });
          const created = await createProcessWithChecklist(input(alice.id), tx);
          assert.equal(created.created, true);
          // Repetir não duplica: devolve o processo aberto.
          assert.deepEqual(
            await createProcessWithChecklist(input(alice.id), tx),
            { id: created.id, created: false },
          );
          assert.equal(
            await findOpenProcessIdForVisa(alice.id, visa.id, tx),
            created.id,
          );

          const own = (await findProcessForProfile(alice.id, created.id, tx))!;
          assert.equal(own.checklist?.items.length, 7);
          assert.equal(
            own.checklist?.items.every((item) => item.status === "PENDING"),
            true,
          );
          const snapshot = await tx.processSnapshot.findUniqueOrThrow({
            where: { processId: created.id },
          });
          assert.equal(snapshot.ruleEngineVersion, "ireland-work-v1");
          const cited = own.checklist!.items.flatMap((item) =>
            item.sources.map((link) => link.sourceId),
          );
          assert.deepEqual(
            (await listSourcesByIds(cited, tx)).map((source) => source.id),
            [
              "seed-source-ie-entry",
              "seed-source-ie-permit",
              "seed-source-ie-residence",
            ],
          );

          // Fase 24: Bob não lê nem altera o processo de Alice.
          assert.equal(
            await findProcessForProfile(bob.id, created.id, tx),
            null,
          );
          assert.deepEqual(await listProcessesForProfile(bob.id, tx), []);
          const target = own.checklist!.items[0];
          assert.equal(
            await updateItemStatusForProfile(
              {
                userProfileId: bob.id,
                processId: created.id,
                itemId: target.id,
                status: "COMPLETED",
              },
              tx,
            ),
            false,
          );
          // Nem combinando o próprio processo com item alheio.
          const bobProcess = await createProcessWithChecklist(
            input(bob.id),
            tx,
          );
          assert.equal(
            await updateItemStatusForProfile(
              {
                userProfileId: bob.id,
                processId: bobProcess.id,
                itemId: target.id,
                status: "COMPLETED",
              },
              tx,
            ),
            false,
          );
          const untouched = await tx.checklistItem.findUniqueOrThrow({
            where: { id: target.id },
          });
          assert.equal(untouched.status, "PENDING");

          // A dona altera; concluir registra a data e voltar limpa.
          assert.equal(
            await updateItemStatusForProfile(
              {
                userProfileId: alice.id,
                processId: created.id,
                itemId: target.id,
                status: "COMPLETED",
              },
              tx,
            ),
            true,
          );
          const done = await tx.checklistItem.findUniqueOrThrow({
            where: { id: target.id },
          });
          assert.equal(done.status, "COMPLETED");
          assert.ok(done.completedAt);
          await updateItemStatusForProfile(
            {
              userProfileId: alice.id,
              processId: created.id,
              itemId: target.id,
              status: "IN_PROGRESS",
            },
            tx,
          );
          assert.equal(
            (
              await tx.checklistItem.findUniqueOrThrow({
                where: { id: target.id },
              })
            ).completedAt,
            null,
          );

          // Processo arquivado some e não aceita mudanças.
          await tx.immigrationProcess.update({
            where: { id: bobProcess.id },
            data: { status: "ARCHIVED" },
          });
          assert.equal(
            await findProcessForProfile(bob.id, bobProcess.id, tx),
            null,
          );

          // Itens pessoais: só o dono adiciona e remove; oficiais ficam.
          const personal = {
            processId: created.id,
            stage: "REQUIREMENTS" as const,
            title: "Traduzir diploma",
            description: "",
          };
          assert.equal(
            await addPersonalItemForProfile(
              { userProfileId: bob.id, ...personal },
              tx,
            ),
            false,
          );
          assert.equal(
            await addPersonalItemForProfile(
              { userProfileId: alice.id, ...personal },
              tx,
            ),
            true,
          );
          const withPersonal = (await findProcessForProfile(
            alice.id,
            created.id,
            tx,
          ))!.checklist!.items;
          const personalItem = withPersonal.find((item) => !item.isOfficial)!;
          const officialItem = withPersonal.find((item) => item.isOfficial)!;
          assert.equal(personalItem.isMandatory, false);
          assert.equal(
            await deletePersonalItemForProfile(
              {
                userProfileId: bob.id,
                processId: created.id,
                itemId: personalItem.id,
              },
              tx,
            ),
            false,
          );
          assert.equal(
            await deletePersonalItemForProfile(
              {
                userProfileId: alice.id,
                processId: created.id,
                itemId: officialItem.id,
              },
              tx,
            ),
            false,
          );
          assert.equal(
            await deletePersonalItemForProfile(
              {
                userProfileId: alice.id,
                processId: created.id,
                itemId: personalItem.id,
              },
              tx,
            ),
            true,
          );

          // Pausar e arquivar: só o dono; arquivado some das listas.
          const status = (
            userProfileId: string,
            value: "PAUSED" | "ARCHIVED",
          ) =>
            setProcessStatusForProfile(
              { userProfileId, processId: created.id, status: value },
              tx,
            );
          assert.equal(await status(bob.id, "PAUSED"), false);
          assert.equal(await status(alice.id, "PAUSED"), true);
          assert.equal(
            (await findProcessForProfile(alice.id, created.id, tx))?.status,
            "PAUSED",
          );
          assert.equal(await status(alice.id, "ARCHIVED"), true);
          assert.equal(
            await findProcessForProfile(alice.id, created.id, tx),
            null,
          );
          assert.equal(
            (await listProcessesForProfile(alice.id, tx)).some(
              (item) => item.id === created.id,
            ),
            false,
          );
          assert.equal(await status(alice.id, "PAUSED"), false);

          // Edição de perfil: só pelo próprio authUserId.
          const renamed = await updateUserProfileByAuthUserId(
            {
              authUserId: "00000000-0000-4000-8000-00000000a001",
              displayName: "Alice",
              preferredLocale: "pt-BR",
            },
            tx,
          );
          assert.equal(renamed?.displayName, "Alice");
          assert.equal(
            await updateUserProfileByAuthUserId(
              {
                authUserId: "00000000-0000-4000-8000-0000000000ff",
                displayName: "X",
                preferredLocale: "pt-BR",
              },
              tx,
            ),
            null,
          );

          // Requisito removido do catálogo não apaga o item do usuário.
          await tx.requirementSource.deleteMany({
            where: { requirementId: draft.id },
          });
          await tx.visaRequirement.delete({ where: { id: draft.id } });

          // Excluir o perfil apaga processo, snapshot, checklist e itens.
          assert.equal(
            await deleteUserProfileByAuthUserId(
              "00000000-0000-4000-8000-00000000a001",
              tx,
            ),
            1,
          );
          assert.equal(
            await tx.immigrationProcess.count({ where: { id: created.id } }),
            0,
          );
          assert.equal(
            await tx.processSnapshot.count({
              where: { processId: created.id },
            }),
            0,
          );
          assert.equal(
            await tx.checklistItem.count({
              where: { checklist: { processId: created.id } },
            }),
            0,
          );
          throw rollback;
        },
        { timeout: 60_000 },
      ),
      (error) => error === rollback,
    );
  } finally {
    await client.$disconnect();
  }
});

test("process tables have no public or Data API grants", async () => {
  const client = createDatabaseClient(readTestDatabaseUrl(process.env));
  try {
    const exposed = await client.$queryRaw<
      { table: string; grantee: string }[]
    >`
      SELECT class.relname AS table,
        CASE WHEN acl.grantee = 0 THEN 'PUBLIC' ELSE roles.rolname END AS grantee
      FROM pg_class class
      JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
      CROSS JOIN LATERAL aclexplode(COALESCE(class.relacl, acldefault('r', class.relowner))) acl
      LEFT JOIN pg_roles roles ON roles.oid = acl.grantee
      WHERE namespace.nspname = 'catalog'
        AND class.relname IN ('ImmigrationProcess', 'ProcessSnapshot', 'Checklist', 'ChecklistItem', 'ChecklistItemSource')
        AND (acl.grantee = 0 OR roles.rolname IN ('mvf_catalog_reader', 'anon', 'authenticated', 'service_role'))`;
    assert.deepEqual(exposed, []);
  } finally {
    await client.$disconnect();
  }
});
