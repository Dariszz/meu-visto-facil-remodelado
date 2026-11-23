// Em hospedagem (Vercel) não há arquivo de certificado em disco: o certificado
// CA público do Supabase vem da variável DATABASE_CA_CERT (texto PEM). Nesse caso
// a verificação continua completa (cadeia + nome do servidor), só muda a origem
// do certificado. Sem a variável, a URL é usada como está (sslrootcert local).
export function poolConnection(
  connectionString: string,
  caCertificate: string | undefined,
):
  | { connectionString: string }
  | {
      connectionString: string;
      ssl: { ca: string; rejectUnauthorized: true };
    } {
  const ca = caCertificate?.replace(/\\n/g, "\n").trim();
  if (!ca) return { connectionString };
  if (
    !ca.startsWith("-----BEGIN CERTIFICATE-----") ||
    !ca.endsWith("-----END CERTIFICATE-----")
  )
    throw new Error("DATABASE_CONFIG_INVALID: DATABASE_CA_CERT");
  const url = new URL(connectionString);
  if (url.searchParams.get("sslmode") !== "verify-full")
    return { connectionString };
  // Parâmetros TLS da URL sobrescreveriam o objeto ssl no driver pg.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("sslrootcert");
  return {
    connectionString: url.toString(),
    ssl: { ca, rejectUnauthorized: true },
  };
}
