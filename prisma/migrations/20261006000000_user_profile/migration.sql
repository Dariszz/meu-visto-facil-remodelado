BEGIN;

CREATE TABLE "catalog"."UserProfile" (
    "id" UUID NOT NULL,
    "authUserId" UUID NOT NULL,
    "displayName" VARCHAR(100),
    "preferredLocale" VARCHAR(35) NOT NULL DEFAULT 'pt-BR',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_authUserId_key" ON "catalog"."UserProfile"("authUserId");

-- Existing default grants must not expose this private table when it is created.
REVOKE ALL PRIVILEGES ON TABLE "catalog"."UserProfile" FROM PUBLIC;
DO $$
DECLARE
    blocked_role TEXT;
BEGIN
    FOREACH blocked_role IN ARRAY ARRAY['mvf_catalog_reader', 'anon', 'authenticated', 'service_role']
    LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = blocked_role) THEN
            EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE "catalog"."UserProfile" FROM %I', blocked_role);
        END IF;
    END LOOP;
END
$$;

COMMIT;
