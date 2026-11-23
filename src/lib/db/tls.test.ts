import { expect, test } from "vitest";
import { poolConnection } from "./tls";

const remote =
  "postgresql://user:secret@aws-0.pooler.supabase.com:6543/postgres?sslmode=verify-full&sslrootcert=C%3A%2Fca.crt&schema=catalog";
const pem = "-----BEGIN CERTIFICATE-----\\nMIIB\\n-----END CERTIFICATE-----";

test("sem certificado em variável, mantém a URL (arquivo local)", () => {
  expect(poolConnection(remote, undefined)).toEqual({
    connectionString: remote,
  });
  expect(poolConnection(remote, "  ")).toEqual({ connectionString: remote });
});

test("com certificado em variável, verifica com ele e nunca desliga a verificação", () => {
  const result = poolConnection(remote, pem);
  expect(result).toEqual({
    connectionString:
      "postgresql://user:secret@aws-0.pooler.supabase.com:6543/postgres?schema=catalog",
    ssl: {
      ca: "-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----",
      rejectUnauthorized: true,
    },
  });
});

test("rejeita conteúdo que não é certificado", () => {
  expect(() => poolConnection(remote, "senha")).toThrow(
    "DATABASE_CONFIG_INVALID: DATABASE_CA_CERT",
  );
});

test("banco local sem TLS não é afetado", () => {
  const local =
    "postgresql://postgres:postgres@localhost:5433/db?schema=catalog";
  expect(poolConnection(local, pem)).toEqual({ connectionString: local });
});
