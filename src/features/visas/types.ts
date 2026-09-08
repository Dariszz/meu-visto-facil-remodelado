// Projeções editoriais temporárias; não representam os futuros modelos persistidos.
export type Country = { code: string; slug: string; name: string };

export type VisaCategory = {
  slug: "work" | "study" | "family";
  name: string;
  description: string;
};

export type VisaSummary = {
  slug: string;
  countryCode: Country["code"];
  categorySlug: VisaCategory["slug"];
  name: string;
  shortDescription: string;
  type: string;
};
