BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";
SET LOCAL search_path TO "catalog", "pg_catalog";
REVOKE ALL ON SCHEMA "catalog" FROM PUBLIC;

-- CreateEnum
CREATE TYPE "CountryStatus" AS ENUM ('ACTIVE', 'COMING_SOON', 'DISABLED');

-- CreateEnum
CREATE TYPE "VisaStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('ACTIVE', 'TEMPORARILY_UNAVAILABLE', 'BROKEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RequirementCategory" AS ENUM ('IDENTITY', 'EMPLOYMENT', 'EDUCATION', 'FINANCIAL', 'FAMILY', 'HEALTH', 'APPLICATION', 'AFTER_ARRIVAL', 'OTHER');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('DOCUMENT', 'CONDITION', 'ACTION', 'INFORMATION', 'FEE', 'DEADLINE');

-- CreateEnum
CREATE TYPE "RequirementImportance" AS ENUM ('CRITICAL', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "RequirementSourceType" AS ENUM ('PRIMARY', 'SUPPORTING');

-- CreateEnum
CREATE TYPE "VisaSourceType" AS ENUM ('OVERVIEW', 'APPLICATION', 'FEES', 'OFFICIAL_GUIDE');

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CountryStatus" NOT NULL DEFAULT 'COMING_SOON',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "VisaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visa" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT,
    "status" "VisaStatus" NOT NULL DEFAULT 'DRAFT',
    "officialName" TEXT,
    "authorityName" TEXT,
    "lastReviewedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Visa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRequirement" (
    "id" TEXT NOT NULL,
    "visaId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "RequirementCategory" NOT NULL,
    "requirementType" "RequirementType" NOT NULL,
    "importance" "RequirementImportance" NOT NULL DEFAULT 'NORMAL',
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "sourceControlled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "VisaRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialSource" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "status" "SourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "editorialConsultedAt" TIMESTAMPTZ(3),
    "lastVerifiedAt" TIMESTAMPTZ(3),
    "lastSuccessfulVerificationAt" TIMESTAMPTZ(3),
    "verificationStatusCode" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "OfficialSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementSource" (
    "requirementId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "relationType" "RequirementSourceType" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RequirementSource_pkey" PRIMARY KEY ("requirementId","sourceId")
);

-- CreateTable
CREATE TABLE "VisaSource" (
    "visaId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "relationType" "VisaSourceType" NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "VisaSource_pkey" PRIMARY KEY ("visaId","sourceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VisaCategory_slug_key" ON "VisaCategory"("slug");

-- CreateIndex
CREATE INDEX "Visa_countryId_status_categoryId_idx" ON "Visa"("countryId", "status", "categoryId");

-- CreateIndex
CREATE INDEX "Visa_categoryId_idx" ON "Visa"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Visa_countryId_slug_key" ON "Visa"("countryId", "slug");

-- CreateIndex
CREATE INDEX "VisaRequirement_visaId_sortOrder_idx" ON "VisaRequirement"("visaId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "VisaRequirement_visaId_code_key" ON "VisaRequirement"("visaId", "code");

-- CreateIndex
CREATE INDEX "OfficialSource_hostname_idx" ON "OfficialSource"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialSource_countryId_url_key" ON "OfficialSource"("countryId", "url");

-- CreateIndex
CREATE INDEX "RequirementSource_sourceId_idx" ON "RequirementSource"("sourceId");

-- CreateIndex
CREATE INDEX "VisaSource_sourceId_idx" ON "VisaSource"("sourceId");

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VisaCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialSource" ADD CONSTRAINT "OfficialSource_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSource" ADD CONSTRAINT "RequirementSource_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "VisaRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSource" ADD CONSTRAINT "RequirementSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "OfficialSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaSource" ADD CONSTRAINT "VisaSource_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaSource" ADD CONSTRAINT "VisaSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "OfficialSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

REVOKE ALL ON ALL TABLES IN SCHEMA "catalog" FROM PUBLIC;
COMMIT;
