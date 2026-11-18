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

// VERIFIED: revisado por uma pessoa; pode virar link e ser consultado pelo
// servidor. PENDING_REVIEW: evidência levantada, aguardando revisão humana;
// nunca vira link nem é consultado.
export type DomainReviewStatus = "VERIFIED" | "PENDING_REVIEW";

export type OfficialDomain = {
  hostname: string;
  status: DomainReviewStatus;
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
    status: "VERIFIED",
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
    status: "VERIFIED",
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
  // Portugal: revisado em 18/11/2026.
  {
    hostname: "aima.gov.pt",
    status: "VERIFIED",
    countryCode: "PT",
    authority: "Agência para a Integração, Migrações e Asilo (AIMA)",
    purpose: "Autorizações de residência e integração de migrantes",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://www.gov.pt/noticias/agencia-para-a-integracao-migracoes-e-asilo-aima-inicia-funcoes",
      note: "O portal gov.pt anuncia a AIMA como agência responsável por acolhimento, integração e asilo desde 29/10/2023. Domínio com sufixo gov.pt.",
    },
    reviewedAt: "2026-11-18",
    reuseNote:
      "Conferir aviso legal do site antes de reutilizar; resumir e citar com link.",
  },
  {
    hostname: "vistos.mne.gov.pt",
    status: "VERIFIED",
    countryCode: "PT",
    authority: "Ministério dos Negócios Estrangeiros (MNE)",
    purpose: "Vistos nacionais e Schengen para entrar em Portugal",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://acaosocial.cm-porto.pt/files/uploads/cms/02_EN_caderno_Regularizacao_VF.pdf",
      note: "Guia de integração de migrantes da Câmara Municipal do Porto indica vistos.mne.gov.pt para tipos de visto e onde pedir. Subdomínio do MNE (mne.gov.pt).",
    },
    reviewedAt: "2026-11-18",
    reuseNote:
      "Conferir aviso legal do site antes de reutilizar; resumir e citar com link.",
  },
  {
    hostname: "diariodarepublica.pt",
    status: "VERIFIED",
    countryCode: "PT",
    authority: "Diário da República (Imprensa Nacional-Casa da Moeda)",
    purpose: "Texto oficial e consolidado das leis portuguesas",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/legislacao-nacional",
      note: "A página de legislação do portal de vistos do MNE aponta para diariodarepublica.pt como texto da Lei de Estrangeiros e alterações.",
    },
    reviewedAt: "2026-11-18",
    reuseNote: "Texto legal oficial; citar com link.",
  },
  // Espanha: revisado em 18/11/2026.
  {
    hostname: "www.inclusion.gob.es",
    status: "VERIFIED",
    countryCode: "ES",
    authority: "Secretaría de Estado de Migraciones (Ministerio de Inclusión)",
    purpose: "Autorizações de residência e trabalho na Espanha",
    evidence: {
      type: "INTERGOVERNMENTAL_LINK",
      url: "https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/who-does-what/spain_en",
      note: "Página da Comissão Europeia sobre quem faz o quê na Espanha descreve a Secretaria de Estado de Migrações como órgão da política migratória.",
    },
    reviewedAt: "2026-11-18",
    reuseNote:
      "Conferir aviso legal do site antes de reutilizar; resumir e citar com link.",
  },
  {
    hostname: "www.exteriores.gob.es",
    status: "VERIFIED",
    countryCode: "ES",
    authority: "Ministerio de Asuntos Exteriores, Unión Europea y Cooperación",
    purpose: "Vistos nacionais pedidos nos consulados da Espanha",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://inclusion.gob.es/gl/web/migraciones/informacion-util/otra-informacion",
      note: "A área de migrações do Ministerio de Inclusión aponta o Ministerio de Asuntos Exteriores para informação sobre vistos.",
    },
    reviewedAt: "2026-11-18",
    reuseNote:
      "Conferir aviso legal do site antes de reutilizar; resumir e citar com link.",
  },
  // Alemanha: revisado em 18/11/2026.
  {
    hostname: "brasil.diplo.de",
    status: "VERIFIED",
    countryCode: "DE",
    authority: "Representações da Alemanha no Brasil (Auswärtiges Amt)",
    purpose:
      "Vistos nacionais para trabalho, estudo e família pedidos no Brasil",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://www.auswaertiges-amt.de/de",
      note: "O site do Ministério Federal das Relações Exteriores alemão usa o domínio diplo.de para as representações no exterior (Konsulatfinder).",
    },
    reviewedAt: "2026-11-18",
    reuseNote: "Conteúdo governamental alemão; resumir e citar com link.",
  },
  // Holanda: revisado em 18/11/2026.
  {
    hostname: "ind.nl",
    status: "VERIFIED",
    countryCode: "NL",
    authority: "Immigration and Naturalisation Service (IND)",
    purpose: "Autorizações de residência para trabalho, estudo e família",
    evidence: {
      type: "PARENT_PORTAL",
      url: "https://www.government.nl/faq/do-i-need-a-residence-permit-if-i-want-to-stay-in-the-netherlands-for-a-long-period-of-time",
      note: "O portal do governo holandês (government.nl) indica o IND para pedidos de autorização de residência.",
    },
    reviewedAt: "2026-11-18",
    reuseNote: "Conteúdo governamental holandês; resumir e citar com link.",
  },
];

const byHostname = new Map(
  officialDomains.map((domain) => [domain.hostname, domain]),
);

export function findOfficialDomain(hostname: string): OfficialDomain | null {
  return byHostname.get(hostname) ?? null;
}

// Só domínios revisados por uma pessoa entram na allowlist efetiva.
export function isVerifiedOfficialHostname(hostname: string): boolean {
  return findOfficialDomain(hostname)?.status === "VERIFIED";
}

export function officialDomainsForCountry(
  countryCode: string,
): OfficialDomain[] {
  return officialDomains.filter((domain) => domain.countryCode === countryCode);
}
