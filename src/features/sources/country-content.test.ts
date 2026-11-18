import { expect, test } from "vitest";
import { destinationContents } from "../../../prisma/seed-data/countries";
import { irelandContent } from "../../../prisma/seed-data/countries/ireland";
import { isVerifiedOfficialHostname } from "./official-domains";

const contents = [irelandContent, ...destinationContents];

test("todo conteúdo publicado cita só fontes oficiais revisadas", () => {
  for (const content of contents)
    for (const source of Object.values(content.sources)) {
      const url = new URL(source.url);
      expect(url.protocol, source.url).toBe("https:");
      expect(isVerifiedOfficialHostname(url.hostname), source.url).toBe(true);
    }
});

test("cada item aponta para uma fonte do próprio destino e tem código único", () => {
  for (const content of contents) {
    expect(content.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const slugs = new Set<string>();
    for (const visa of content.visas) {
      expect(slugs.has(visa.slug), visa.slug).toBe(false);
      slugs.add(visa.slug);
      expect(content.sources[visa.overviewSource]).toBeDefined();
      expect(visa.requirements.length).toBeGreaterThan(0);
      const codes = new Set<string>();
      for (const item of [...visa.requirements, ...visa.steps]) {
        expect(
          content.sources[item.source],
          `${visa.slug}/${item.code}`,
        ).toBeDefined();
        expect(codes.has(item.code), `${visa.slug}/${item.code}`).toBe(false);
        codes.add(item.code);
      }
    }
  }
});

test("destinos com conteúdo têm códigos e slugs únicos", () => {
  expect(new Set(contents.map((c) => c.code)).size).toBe(contents.length);
  expect(new Set(contents.map((c) => c.slug)).size).toBe(contents.length);
});
