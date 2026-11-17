-- Fases 13 e 14: questionário configurável por país e respostas privadas.
BEGIN;

CREATE TYPE "catalog"."QuestionType" AS ENUM ('BOOLEAN', 'SINGLE_SELECT', 'MULTI_SELECT');
CREATE TYPE "catalog"."QuestionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "catalog"."ProfileQuestion" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "question" TEXT NOT NULL,
    "shortLabel" VARCHAR(60),
    "description" TEXT,
    "type" "catalog"."QuestionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "catalog"."QuestionStatus" NOT NULL DEFAULT 'ACTIVE',
    "showIf" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "ProfileQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" VARCHAR(80) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "catalog"."ProfileAnswer" (
    "id" UUID NOT NULL,
    "userProfileId" UUID NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "ProfileAnswer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProfileQuestion_countryId_code_key" ON "catalog"."ProfileQuestion"("countryId", "code");
CREATE INDEX "ProfileQuestion_countryId_status_sortOrder_idx" ON "catalog"."ProfileQuestion"("countryId", "status", "sortOrder");
CREATE UNIQUE INDEX "QuestionOption_questionId_value_key" ON "catalog"."QuestionOption"("questionId", "value");
CREATE INDEX "QuestionOption_questionId_sortOrder_idx" ON "catalog"."QuestionOption"("questionId", "sortOrder");
CREATE UNIQUE INDEX "ProfileAnswer_userProfileId_questionId_key" ON "catalog"."ProfileAnswer"("userProfileId", "questionId");
CREATE INDEX "ProfileAnswer_questionId_idx" ON "catalog"."ProfileAnswer"("questionId");

ALTER TABLE "catalog"."ProfileQuestion" ADD CONSTRAINT "ProfileQuestion_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "catalog"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "catalog"."QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "catalog"."ProfileQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ProfileAnswer" ADD CONSTRAINT "ProfileAnswer_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "catalog"."UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "catalog"."ProfileAnswer" ADD CONSTRAINT "ProfileAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "catalog"."ProfileQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Respostas são dados pessoais: mesma política privada do UserProfile.
REVOKE ALL PRIVILEGES ON TABLE "catalog"."ProfileAnswer" FROM PUBLIC;
DO $$
DECLARE
    blocked_role TEXT;
BEGIN
    FOREACH blocked_role IN ARRAY ARRAY['mvf_catalog_reader', 'anon', 'authenticated', 'service_role']
    LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = blocked_role) THEN
            EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE "catalog"."ProfileAnswer" FROM %I', blocked_role);
        END IF;
    END LOOP;
END
$$;

COMMIT;
