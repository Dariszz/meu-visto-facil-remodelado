// Registro de domínios oficiais por país (ADR 0001). É a allowlist usada por
// safeSourceLink e pelo validador de URLs: um hostname fora daqui nunca vira
// link nem é consultado pelo servidor.
//
// Fica no código, e não no banco, de propósito: ampliar a allowlist aumenta a
// superfície de requisições do servidor, então cada entrada passa por revisão
// de código e testes. Hostname exato, sem curingas.
export type DomainEvidenceType =
  // Registro oficial de domínios do governo (ex.: overheid.nl, get.gov).
  | "GOVERNMENT_REGISTRY"
  // Link a partir do portal do governo nacional ou do ministério responsável.
  | "PARENT_PORTAL"
  // Link a partir de fonte intergovernamental oficial (ex.: EU Immigration Portal).
  | "INTERGOVERNMENTAL_LINK";

export type OfficialDomain = {
  hostname: string;
  countryCode: string;
  authority: string;
  // O que este domínio cobre, em linguagem do usuário.
  purpose: string;
  evidence: {
    type: DomainEvidenceType;
    url: string;
    // Descrição curta, sem copiar o texto da página de evidência.
    note: string;
  };
  reviewedAt: string;
  // Aviso de reutilização registrado na revisão; resumir e citar com link.
  reuseNote: string;
};

export const officialDomains: readonly OfficialDomain[] = [
  {
    hostname: "enterprise.gov.ie",
    countryCode: "IE",
    authority: "Department of Enterprise, Tourism and Employment (DETE)",
    purpose: "Autorizações de trabalho (employment permits)",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://www.gov.ie/en/department-of-enterprise-tourism-and-employment/policy-information/employment-permits",
      note: "Página do departamento no portal gov.ie descreve o sistema de employment permits, com contatos @enterprise.gov.ie.",
    },
    reviewedAt: "2026-11-17",
    reuseNote: "Conteúdo governamental irlandês; resumir e citar com link.",
  },
  {
    hostname: "www.irishimmigration.ie",
    countryCode: "IE",
    authority: "Immigration Service Delivery (ISD)",
    purpose: "Vistos de entrada e permissões de residência",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://www.ireland.ie/en/dfa/visas-for-ireland/",
      note: "O Departamento de Relações Exteriores (ireland.ie) indica o ISD/IrishImmigration.ie como responsável por vistos.",
    },
    reviewedAt: "2026-11-17",
    reuseNote: "Conteúdo governamental irlandês; resumir e citar com link.",
  },
];

const byHostname = new Map(
  officialDomains.map((domain) => [domain.hostname, domain]),
);

export function findOfficialDomain(hostname: string): OfficialDomain | null {
  return byHostname.get(hostname) ?? null;
}

export function officialDomainsForCountry(
  countryCode: string,
): OfficialDomain[] {
  return officialDomains.filter((domain) => domain.countryCode === countryCode);
}
