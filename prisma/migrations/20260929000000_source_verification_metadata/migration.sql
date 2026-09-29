ALTER TABLE "catalog"."OfficialSource"
  ADD COLUMN "verificationResolvedUrl" TEXT,
  ADD COLUMN "verificationDurationMs" INTEGER;

ALTER TABLE "catalog"."OfficialSource"
  ADD CONSTRAINT "OfficialSource_verificationDurationMs_nonnegative"
  CHECK ("verificationDurationMs" IS NULL OR "verificationDurationMs" >= 0);
