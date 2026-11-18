-- Fases 19 a 24: processos, snapshot e checklist. Dados pessoais, sem acesso público.
BEGIN;

ALTER TYPE "catalog"."RequirementCategory" ADD VALUE 'ENTRY';

CREATE TYPE "catalog"."ProcessStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "catalog"."ChecklistItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE');
CREATE TYPE "catalog"."ChecklistStage" AS ENUM ('REQUIREMENTS', 'APPLICATION', 'ENTRY', 'AFTER_ARRIVAL');

CREATE TABLE "catalog"."ImmigrationProcess" (
    "id" UUID NOT NULL,
    "userProfileId" UUID NOT NULL,
    "visaId" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "status" "catalog"."ProcessStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "ImmigrationProcess_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."ProcessSnapshot" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "ruleEngineVersion" VARCHAR(40) NOT NULL,
    "promptVersion" VARCHAR(40),
    "profile" JSONB NOT NULL,
    "visa" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "recommendation" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."Checklist" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "generatorVersion" VARCHAR(40) NOT NULL,
    "referenceDate" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."ChecklistItem" (
    "id" UUID NOT NULL,
    "checklistId" UUID NOT NULL,
    "requirementId" TEXT,
    "code" VARCHAR(80) NOT NULL,
    "stage" "catalog"."ChecklistStage" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "catalog"."ChecklistItemStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "catalog"."RequirementImportance" NOT NULL DEFAULT 'NORMAL',
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "isOfficial" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."ChecklistItemSource" (
    "itemId" UUID NOT NULL,
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChecklistItemSource_pkey" PRIMARY KEY ("itemId","sourceId")
);

CREATE INDEX "ImmigrationProcess_userProfileId_status_updatedAt_idx" ON "catalog"."ImmigrationProcess"("userProfileId", "status", "updatedAt");
CREATE INDEX "ImmigrationProcess_visaId_idx" ON "catalog"."ImmigrationProcess"("visaId");
CREATE UNIQUE INDEX "ProcessSnapshot_processId_key" ON "catalog"."ProcessSnapshot"("processId");
CREATE UNIQUE INDEX "Checklist_processId_key" ON "catalog"."Checklist"("processId");
CREATE UNIQUE INDEX "ChecklistItem_checklistId_code_key" ON "catalog"."ChecklistItem"("checklistId", "code");
CREATE INDEX "ChecklistItem_checklistId_stage_sortOrder_idx" ON "catalog"."ChecklistItem"("checklistId", "stage", "sortOrder");
CREATE INDEX "ChecklistItem_requirementId_idx" ON "catalog"."ChecklistItem"("requirementId");
CREATE INDEX "ChecklistItemSource_sourceId_idx" ON "catalog"."ChecklistItemSource"("sourceId");

ALTER TABLE "catalog"."ImmigrationProcess" ADD CONSTRAINT "ImmigrationProcess_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "catalog"."UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ImmigrationProcess" ADD CONSTRAINT "ImmigrationProcess_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "catalog"."Visa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "catalog"."ProcessSnapshot" ADD CONSTRAINT "ProcessSnapshot_processId_fkey" FOREIGN KEY ("processId") REFERENCES "catalog"."ImmigrationProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."Checklist" ADD CONSTRAINT "Checklist_processId_fkey" FOREIGN KEY ("processId") REFERENCES "catalog"."ImmigrationProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ChecklistItem" ADD CONSTRAINT "ChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "catalog"."Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ChecklistItem" ADD CONSTRAINT "ChecklistItem_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "catalog"."VisaRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "catalog"."ChecklistItemSource" ADD CONSTRAINT "ChecklistItemSource_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "catalog"."ChecklistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ChecklistItemSource" ADD CONSTRAINT "ChecklistItemSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "catalog"."OfficialSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Mesma política privada do UserProfile e do ProfileAnswer.
DO $$
DECLARE
    private_table TEXT;
    blocked_role TEXT;
BEGIN
    FOREACH private_table IN ARRAY ARRAY['ImmigrationProcess', 'ProcessSnapshot', 'Checklist', 'ChecklistItem', 'ChecklistItemSource']
    LOOP
        EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE "catalog".%I FROM PUBLIC', private_table);
        FOREACH blocked_role IN ARRAY ARRAY['mvf_catalog_reader', 'anon', 'authenticated', 'service_role']
        LOOP
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = blocked_role) THEN
                EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE "catalog".%I FROM %I', private_table, blocked_role);
            END IF;
        END LOOP;
    END LOOP;
END
$$;

COMMIT;
