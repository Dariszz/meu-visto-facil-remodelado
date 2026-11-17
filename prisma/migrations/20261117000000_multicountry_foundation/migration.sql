-- ADR 0001: cobertura por país e status de revisão do conteúdo. Migration aditiva.
CREATE TYPE "catalog"."CoverageLevel" AS ENUM ('FULL', 'PARTIAL', 'LINKS_ONLY', 'NONE');
CREATE TYPE "catalog"."ReviewStatus" AS ENUM ('REVIEWED', 'SOURCED_UNREVIEWED', 'NEEDS_REVIEW', 'DEPRECATED');

ALTER TABLE "catalog"."Country"
  ADD COLUMN "coverageLevel" "catalog"."CoverageLevel" NOT NULL DEFAULT 'NONE';

ALTER TABLE "catalog"."Visa"
  ADD COLUMN "reviewStatus" "catalog"."ReviewStatus" NOT NULL DEFAULT 'SOURCED_UNREVIEWED';

ALTER TABLE "catalog"."VisaRequirement"
  ADD COLUMN "reviewStatus" "catalog"."ReviewStatus" NOT NULL DEFAULT 'SOURCED_UNREVIEWED',
  ADD COLUMN "lastVerifiedAt" TIMESTAMPTZ(3),
  ADD COLUMN "sourceQuote" VARCHAR(500);

-- O conteúdo da Irlanda já existente foi pesquisado e aprovado nas Fases 5 a 7,
-- antes de existir o status de revisão. Preserva o comportamento atual.
UPDATE "catalog"."Country" SET "coverageLevel" = 'PARTIAL' WHERE "code" = 'IE';

UPDATE "catalog"."Visa" AS v
SET "reviewStatus" = 'REVIEWED'
FROM "catalog"."Country" AS c
WHERE v."countryId" = c."id" AND c."code" = 'IE';

UPDATE "catalog"."VisaRequirement" AS r
SET "reviewStatus" = 'REVIEWED'
FROM "catalog"."Visa" AS v
JOIN "catalog"."Country" AS c ON c."id" = v."countryId"
WHERE r."visaId" = v."id" AND c."code" = 'IE';
