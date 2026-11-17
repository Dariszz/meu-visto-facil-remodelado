import { expect, test } from "vitest";
import {
  findOfficialDomain,
  isVerifiedOfficialHostname,
  officialDomains,
  officialDomainsForCountry,
} from "./official-domains";
import { safeSourceLink } from "./source-link-policy";

test("cada domínio tem hostname exato, país, evidência HTTPS e data de revisão", () => {
  const seen = new Set<string>();
  for (const domain of officialDomains) {
    expect(domain.hostname).toMatch(/^[a-z0-9.-]+$/);
    expect(domain.hostname).not.toContain("*");
    expect(seen.has(domain.hostname)).toBe(false);
    seen.add(domain.hostname);
    expect(domain.countryCode).toMatch(/^[A-Z]{2}$/);
    expect(new URL(domain.evidence.url).protocol).toBe("https:");
    // A evidência vem de outro site: um domínio não prova a si mesmo.
    expect(new URL(domain.evidence.url).hostname).not.toBe(domain.hostname);
    expect(domain.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});

test("busca é exata: subdomínios e parecidos não são aceitos", () => {
  expect(findOfficialDomain("enterprise.gov.ie")).not.toBeNull();
  expect(findOfficialDomain("www.enterprise.gov.ie")).toBeNull();
  expect(findOfficialDomain("irishimmigration.ie")).toBeNull();
  expect(findOfficialDomain("www.irish-immigration.ie")).toBeNull();
});

test("domínios por país", () => {
  expect(officialDomainsForCountry("IE").map((d) => d.hostname)).toEqual([
    "enterprise.gov.ie",
    "www.irishimmigration.ie",
  ]);
  expect(officialDomainsForCountry("PT").map((d) => d.hostname)).toEqual([
    "aima.gov.pt",
    "vistos.mne.gov.pt",
  ]);
  expect(officialDomainsForCountry("ZZ")).toEqual([]);
});

test("domínio pendente de revisão nunca vira link", () => {
  expect(findOfficialDomain("aima.gov.pt")?.status).toBe("PENDING_REVIEW");
  expect(isVerifiedOfficialHostname("aima.gov.pt")).toBe(false);
  expect(
    safeSourceLink("https://aima.gov.pt/pt/viver", "aima.gov.pt"),
  ).toBeNull();
  expect(isVerifiedOfficialHostname("enterprise.gov.ie")).toBe(true);
});

test("política de links segue o registro", () => {
  expect(
    safeSourceLink("https://enterprise.gov.ie/en/", "enterprise.gov.ie"),
  ).toBe("https://enterprise.gov.ie/en/");
  expect(
    safeSourceLink("https://example.gov.ie/en/", "example.gov.ie"),
  ).toBeNull();
});
